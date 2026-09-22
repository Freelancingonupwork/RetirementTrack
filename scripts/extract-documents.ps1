param(
  [string]$Source = "src/assets/documents",
  [string]$Destination = "src/assets/documents/extracted"
)

$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

New-Item -ItemType Directory -Force -Path $Destination | Out-Null

Get-ChildItem -Path $Source -Filter "*.docx" -File | ForEach-Object {
  $documentName = $_.Name
  $archive = $null
  for ($attempt = 1; $attempt -le 5 -and $null -eq $archive; $attempt++) {
    try {
      $stream = [System.IO.File]::Open($_.FullName, [System.IO.FileMode]::Open, [System.IO.FileAccess]::Read, [System.IO.FileShare]::ReadWrite)
      $archive = [System.IO.Compression.ZipArchive]::new($stream, [System.IO.Compression.ZipArchiveMode]::Read)
    } catch [System.IO.IOException] {
      if ($attempt -eq 5) {
        Write-Warning "Skipped locked document: $documentName. The last extracted reader version will be used."
        break
      }
      Start-Sleep -Milliseconds 500
    }
  }
  if ($null -eq $archive) { return }
  try {
    $entry = $archive.GetEntry("word/document.xml")
    if ($null -eq $entry) { return }

    $reader = [System.IO.StreamReader]::new($entry.Open())
    try {
      [xml]$document = $reader.ReadToEnd()
    } finally {
      $reader.Dispose()
    }

    $namespace = [System.Xml.XmlNamespaceManager]::new($document.NameTable)
    $namespace.AddNamespace("w", "http://schemas.openxmlformats.org/wordprocessingml/2006/main")
    $namespace.AddNamespace("a", "http://schemas.openxmlformats.org/drawingml/2006/main")
    $namespace.AddNamespace("r", "http://schemas.openxmlformats.org/officeDocument/2006/relationships")
    $documentBase = $_.BaseName
    $mediaDirectory = Join-Path "public/documentation" $documentBase
    New-Item -ItemType Directory -Force -Path $mediaDirectory | Out-Null
    $relationshipMap = @{}
    $relationshipsEntry = $archive.GetEntry("word/_rels/document.xml.rels")
    if ($null -ne $relationshipsEntry) {
      $relationshipsReader = [System.IO.StreamReader]::new($relationshipsEntry.Open())
      try {
        [xml]$relationships = $relationshipsReader.ReadToEnd()
      } finally {
        $relationshipsReader.Dispose()
      }
      $relationships.SelectNodes("//*[local-name()='Relationship']") | ForEach-Object {
        $relationshipMap[$_.GetAttribute("Id")] = $_.GetAttribute("Target")
      }
    }
    function Get-ParagraphText([System.Xml.XmlNode]$Paragraph) {
      (($Paragraph.SelectNodes(".//w:t", $namespace) | ForEach-Object { $_.'#text' }) -join "").Trim()
    }

    $bodyNodes = $document.SelectNodes("/w:document/w:body/*", $namespace)
    $html = foreach ($node in $bodyNodes) {
      if ($node.LocalName -eq "p") {
        $text = Get-ParagraphText $node
        $imageMarkup = foreach ($blip in $node.SelectNodes(".//a:blip", $namespace)) {
          $relationshipId = $blip.GetAttribute("embed", "http://schemas.openxmlformats.org/officeDocument/2006/relationships")
          $target = $relationshipMap[$relationshipId]
          if ([string]::IsNullOrWhiteSpace($target)) { continue }
          $mediaEntry = $archive.GetEntry("word/$target")
          if ($null -eq $mediaEntry) { continue }
          $mediaName = [System.IO.Path]::GetFileName($target)
          $mediaPath = Join-Path $mediaDirectory $mediaName
          $mediaStream = $mediaEntry.Open()
          try {
            $outputStream = [System.IO.File]::Open($mediaPath, [System.IO.FileMode]::Create, [System.IO.FileAccess]::Write)
            try { $mediaStream.CopyTo($outputStream) } finally { $outputStream.Dispose() }
          } finally {
            $mediaStream.Dispose()
          }
          '<figure class="document-image"><img data-document-image="{0}/{1}" alt="Embedded document visual"></figure>' -f $documentBase, $mediaName
        }
        if ([string]::IsNullOrWhiteSpace($text) -and -not $imageMarkup) { continue }
        $encoded = [System.Net.WebUtility]::HtmlEncode($text)
        $styleNode = $node.SelectSingleNode("./w:pPr/w:pStyle", $namespace)
        $style = if ($null -ne $styleNode) { $styleNode.GetAttribute("val", "http://schemas.openxmlformats.org/wordprocessingml/2006/main") } else { "" }
        if ($style -match "Heading([1-3])") {
          "<h$($Matches[1])>$encoded</h$($Matches[1])>"
        } else {
          "<p>$encoded</p>"
        }
        $imageMarkup
      }
      elseif ($node.LocalName -eq "tbl") {
        $rows = $node.SelectNodes("./w:tr", $namespace)
        if ($rows.Count -eq 0) { continue }
        $tableRows = for ($rowIndex = 0; $rowIndex -lt $rows.Count; $rowIndex++) {
          $cells = $rows[$rowIndex].SelectNodes("./w:tc", $namespace)
          $tag = if ($rowIndex -eq 0) { "th" } else { "td" }
          $cellMarkup = foreach ($cell in $cells) {
            $paragraphText = $cell.SelectNodes("./w:p", $namespace) | ForEach-Object { Get-ParagraphText $_ } | Where-Object { $_ }
            "<$tag>$(([System.Net.WebUtility]::HtmlEncode(($paragraphText -join "`n"))) -replace "`n", "<br>")</$tag>"
          }
          "<tr>$($cellMarkup -join '')</tr>"
        }
        '<div class="document-table-wrap"><table>{0}</table></div>' -f ($tableRows -join '')
      }
    }

    $target = Join-Path $Destination ($_.BaseName + ".html")
    [System.IO.File]::WriteAllText($target, ($html -join [Environment]::NewLine), [System.Text.UTF8Encoding]::new($false))
  } finally {
    $archive.Dispose()
  }
}
