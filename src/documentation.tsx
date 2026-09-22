import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, ChevronRight, Compass, FileText } from "lucide-react";

type DocumentationItem = {
  id: string;
  label: string;
  fileName: string;
  load?: () => Promise<{ default: string }>;
};

const documentationItems: DocumentationItem[] = [
  { id: "task-1", label: "Task 1 · Discovery kickoff", fileName: "Existing Material Review and Discovery Kickoff Notes", load: () => import("./assets/documents/extracted/Task1_Existing_Material_Review_and_Discovery_Kickoff_Notes.html?raw") },
  { id: "task-2", label: "Task 2 · Product requirements", fileName: "Product Requirements and User Workflow Definition", load: () => import("./assets/documents/extracted/Task2_Product_Requirements_User_Workflow_Definition 1 (1).html?raw") },
  { id: "task-3", label: "Task 3 · MVP boundaries", fileName: "MVP Boundary and Prioritization", load: () => import("./assets/documents/extracted/Task3_MVP_Boundary_Prioritization 1.html?raw") },
  { id: "task-4", label: "Task 4 · Domain data model", fileName: "Domain Data Model", load: () => import("./assets/documents/extracted/Task4_Domain_Data_Model (3).html?raw") },
  { id: "task-5", label: "Task 5 · Source pending", fileName: "Task 5 document" },
  { id: "task-6", label: "Task 6 · Security and privacy", fileName: "Multi Tenancy Identity Security and Privacy", load: () => import("./assets/documents/extracted/Task6_Multi_Tenancy_Identity_Security_Privacy (2).html?raw") },
  { id: "task-7", label: "Task 7 · Technical architecture", fileName: "Azure NET Technical Architecture", load: () => import("./assets/documents/extracted/Task7_Azure_NET_Technical_Architecture.html?raw") },
  { id: "task-8", label: "Task 8 · Engagement design", fileName: "Assessments Scoring Content Benchmarking and Engagement Design", load: () => import("./assets/documents/extracted/Task8_Assessments_Scoring_Content_Benchmarking_Engagement_Design.html?raw") },
  { id: "task-9", label: "Task 9 · Operations", fileName: "DevOps Ownership and Operational Approach", load: () => import("./assets/documents/extracted/Task9_DevOps_Ownership_Operational_Approach_Updated.html?raw") },
  { id: "task-10", label: "Task 10 · Implementation plan", fileName: "MVP Backlog and Implementation Plan", load: () => import("./assets/documents/extracted/Task10_MVP_Backlog_Implementation_Plan.html?raw") },
  { id: "final", label: "Final Documentation", fileName: "Final Documentation Review and Handoff", load: () => import("./assets/documents/extracted/Task11_Final_Documentation_Review_Handoff.html?raw") },
];

function Content({ content }: { content: string }) {
  const assetBase = `${import.meta.env.BASE_URL}documentation/`;
  const resolvedContent = content.replace(
    /data-document-image="([^"]+)"/g,
    (_, imagePath: string) => `src="${assetBase}${imagePath}"`,
  );
  return <div className="documentation-body" dangerouslySetInnerHTML={{ __html: resolvedContent }} />;
}

export function Documentation() {
  const [activeId, setActiveId] = useState("task-1");
  const [content, setContent] = useState<string | null>(null);
  const readerRef = useRef<HTMLElement>(null);
  const active = documentationItems.find((item) => item.id === activeId) ?? documentationItems[0];

  useEffect(() => {
    readerRef.current?.scrollTo({ top: 0, behavior: "auto" });
  }, [activeId]);

  useEffect(() => {
    let activeRequest = true;
    setContent(null);
    if (!active.load) return () => { activeRequest = false; };
    active.load().then((module) => {
      if (activeRequest) setContent(module.default);
    });
    return () => { activeRequest = false; };
  }, [active]);

  return (
    <div className="documentation-app">
      <aside className="documentation-sidebar" aria-label="Documentation navigation">
        <Link className="documentation-brand" to="/client/dashboard">
          <Compass size={28} />
          <span>Retirement<span>Track</span><small>BY HARBOR WEALTH</small></span>
        </Link>
        <p className="documentation-kicker">DISCOVERY DOCUMENTATION</p>
        <nav>
          {documentationItems.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => setActiveId(item.id)}
              className={item.id === active.id ? "active" : ""}
              aria-current={item.id === active.id ? "page" : undefined}
            >
              <FileText size={17} />
              <span>{item.label}</span>
              <ChevronRight size={16} />
            </button>
          ))}
        </nav>
      </aside>
      <main className="documentation-main">
        <header className="documentation-topbar">
          <div><BookOpen size={19} /><span>Documentation</span></div>
          <Link to="/client/dashboard">Return to prototype <ChevronRight size={16} /></Link>
        </header>
        <section className="documentation-reader" ref={readerRef} aria-live="polite">
          <header className="documentation-reader-header">
            <p>{active.label}</p>
            <h1>{active.fileName}</h1>
            <span>{active.load ? "Source document" : "Source document not added"}</span>
          </header>
          {content ? (
            <Content content={content} />
          ) : active.load ? (
            <div className="documentation-empty"><FileText size={32} /><p>Loading source document…</p></div>
          ) : (
            <div className="documentation-empty">
              <FileText size={32} />
              <h2>This task source is not available yet</h2>
              <p>Add the Task 5 Word document to <code>src/assets/documents</code>, then run the document extraction script to make it available here.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
