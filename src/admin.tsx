import React, { useEffect, useState } from "react";
import { Link, NavLink, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { BadgeCheck, BellRing, BookOpen, Building2, Check, ChevronRight, Database, LockKeyhole, Mail, Palette, Search, ShieldCheck, SlidersHorizontal, UsersRound } from "lucide-react";

type AdminUser = { id: string; name: string; email: string; role: "Firm administrator" | "Advisor"; status: "Active" | "Invitation pending"; clients?: number };
type AdminState = {
  firmName: string;
  displayName: string;
  accent: string;
  features: { planning: boolean; assessments: boolean; education: boolean; benchmarking: boolean; reminders: boolean };
  communicationMode: "Automatic" | "Advisor approval" | "Off";
  content: { id: string; title: string; enabled: boolean }[];
  users: AdminUser[];
  advisorVisibility: "Assigned clients only" | "All firm clients";
  clientContact: "Display contact details" | "Platform messages";
  householdSharing: boolean;
  privateRecords: boolean;
  highLevelFinancialData: boolean;
};

const initial: AdminState = {
  firmName: "Harbor Wealth",
  displayName: "Harbor Wealth",
  accent: "#226c6b",
  features: { planning: true, assessments: true, education: true, benchmarking: false, reminders: true },
  communicationMode: "Automatic",
  content: [
    { id: "lifestyle", title: "Retirement lifestyle", enabled: true },
    { id: "planning", title: "Planning essentials", enabled: true },
    { id: "investing", title: "Investment basics", enabled: true },
    { id: "benchmarks", title: "Benchmark context", enabled: false },
  ],
  users: [
    { id: "admin", name: "Jordan Lee", email: "jordan@harborwealth.example", role: "Firm administrator", status: "Active" },
    { id: "michael", name: "Michael Carter, CFP®", email: "michael@harborwealth.example", role: "Advisor", status: "Active", clients: 84 },
    { id: "nina", name: "Nina Patel, CFA", email: "nina@harborwealth.example", role: "Advisor", status: "Active", clients: 67 },
  ],
  advisorVisibility: "Assigned clients only",
  clientContact: "Display contact details",
  householdSharing: true,
  privateRecords: true,
  highLevelFinancialData: true,
};

const adminNav = [
  ["overview", "Administration overview", Building2],
  ["branding", "Basic branding", Palette],
  ["users", "Users & advisors", UsersRound],
  ["features", "Feature controls", SlidersHorizontal],
  ["communications", "Communication modes", Mail],
  ["content", "Content availability", BookOpen],
  ["governance", "Advisor & client governance", ShieldCheck],
  ["privacy", "Household & data privacy", LockKeyhole],
] as const;

function AdminHeader(_props: { eyebrow: string; title: string; children?: React.ReactNode }) { return null; }

function AdminShell({ state, setState }: { state: AdminState; setState: React.Dispatch<React.SetStateAction<AdminState>> }) {
  const location = useLocation();
  useEffect(() => { document.querySelector<HTMLHeadingElement>("h1")?.focus(); window.scrollTo(0, 0); }, [location.pathname]);
  const label = adminNav.find(([path]) => location.pathname.includes(path))?.[1] || "Administration overview";
  return <div className="admin-app">
    <a className="skip" href="#admin-main">Skip to administration content</a>
    <aside className="admin-sidebar">
      <Link to="/admin/overview" className="admin-brand"><Building2 size={26}/><span>RetirementTrack<small>FIRM ADMINISTRATION</small></span></Link>
      <p className="admin-sidebar-label">{state.displayName.toUpperCase()}</p>
      <nav aria-label="Firm administration navigation">{adminNav.map(([path, text, Icon]) => <NavLink key={path} to={`/admin/${path}`}><Icon size={18}/><span>{text}</span></NavLink>)}</nav>
      <div className="admin-sidebar-footer"><BadgeCheck size={17}/><span>Firm configuration<br/>Demo environment</span><Link to="/client/dashboard">View client portal <ChevronRight size={14}/></Link></div>
    </aside>
    <section className="admin-workspace">
      <div className="admin-topbar"><span>Firm administration <ChevronRight size={14}/> <strong>{label}</strong></span><div><span className="demo-pill">DISCOVERY PROTOTYPE</span><span className="admin-avatar">JL</span></div></div>
      <main id="admin-main" className="admin-main"><Routes>
        <Route path="overview" element={<AdminOverview state={state}/>}/>
        <Route path="branding" element={<Branding state={state} setState={setState}/>}/>
        <Route path="users" element={<Users state={state} setState={setState}/>}/>
        <Route path="features" element={<Features state={state} setState={setState}/>}/>
        <Route path="communications" element={<Communications state={state} setState={setState}/>}/>
        <Route path="content" element={<Content state={state} setState={setState}/>}/>
        <Route path="governance" element={<Governance state={state} setState={setState}/>}/>
        <Route path="privacy" element={<DataPrivacy state={state} setState={setState}/>}/>
        <Route path="*" element={<Navigate to="overview" replace/>}/>
      </Routes></main>
    </section>
  </div>;
}

export function FirmAdministration() {
  const [state, setState] = useState<AdminState>(() => { try { return { ...initial, ...JSON.parse(localStorage.getItem("retirementtrack-firm-admin-v1") || "null") }; } catch { return initial; } });
  useEffect(() => { localStorage.setItem("retirementtrack-firm-admin-v1", JSON.stringify(state)); }, [state]);
  return <AdminShell state={state} setState={setState}/>;
}

function AdminOverview({ state }: { state: AdminState }) {
  const enabled = Object.values(state.features).filter(Boolean).length;
  return <><AdminHeader eyebrow="FIRM SETUP → CONTROLS → ONGOING ADMINISTRATION" title="Firm administration">Manage the firm settings that shape your clients’ and advisors’ RetirementTrack experience.</AdminHeader>
    <section className="admin-intro"><div><BadgeCheck size={30}/><div><strong>{state.displayName}</strong><span>Active firm tenant · Client experience enabled</span></div></div><Link className="admin-link-button" to="/admin/branding">Review firm setup <ChevronRight size={17}/></Link></section>
    <div className="admin-grid"> <AdminTile to="branding" icon={<Palette/>} title="Basic branding" detail="Firm name, display name, and controlled accent color." state="Configured"/><AdminTile to="users" icon={<UsersRound/>} title="Users & advisors" detail={`${state.users.length} active team members · ${state.users.filter(x => x.role === "Advisor").length} advisors`} state="Manage"/><AdminTile to="features" icon={<SlidersHorizontal/>} title="Feature controls" detail={`${enabled} of 5 MVP capabilities enabled.`} state="Review"/><AdminTile to="communications" icon={<Mail/>} title="Communication modes" detail={`${state.communicationMode} for supported reminders.`} state="Configured"/><AdminTile to="content" icon={<BookOpen/>} title="Content availability" detail={`${state.content.filter(x => x.enabled).length} of ${state.content.length} resource groups available.`} state="Review"/><AdminTile to="governance" icon={<ShieldCheck/>} title="Advisor / client governance" detail={state.advisorVisibility} state="Review"/><AdminTile to="privacy" icon={<LockKeyhole/>} title="Household & data privacy" detail="Shared household default with private classification available." state="Configured"/></div>
    <section className="admin-note"><BellRing size={20}/><div><strong>What this prototype controls</strong><p>Configuration is saved only in this browser. Invitations, communications, identities, and permission enforcement are not connected to production systems.</p></div></section></>;
}

function AdminTile({ to, icon, title, detail, state }: { to: string; icon: React.ReactNode; title: string; detail: string; state: string }) { return <Link className="admin-tile" to={`/admin/${to}`}><div className="admin-tile-icon">{icon}</div><div><span>{state}</span><h2>{title}</h2><p>{detail}</p><b>Open settings <ChevronRight size={15}/></b></div></Link>; }

function Branding({ state, setState }: { state: AdminState; setState: React.Dispatch<React.SetStateAction<AdminState>> }) {
  const [draft, setDraft] = useState({ firmName: state.firmName, displayName: state.displayName, accent: state.accent }); const [saved, setSaved] = useState(false);
  return <><AdminHeader eyebrow="BASIC BRANDING" title="Recognizable to your clients.">Keep the first-build brand controls disciplined: firm identity and one controlled accent.</AdminHeader><form className="admin-card admin-form" onSubmit={e => { e.preventDefault(); setState(s => ({ ...s, ...draft })); setSaved(true); }}><div className="admin-preview" style={{ "--admin-accent": draft.accent } as React.CSSProperties}><Building2/><strong>{draft.displayName || "Your firm"}</strong><span>RetirementTrack client portal</span></div><label>Legal firm name<input required value={draft.firmName} onChange={e => setDraft({ ...draft, firmName: e.target.value })}/></label><label>Client-facing display name<input required value={draft.displayName} onChange={e => setDraft({ ...draft, displayName: e.target.value })}/></label><label>Controlled accent color<input type="color" value={draft.accent} onChange={e => setDraft({ ...draft, accent: e.target.value })}/></label><p className="admin-help">Logo upload, custom domains, and full theme design are outside this MVP prototype.</p><button className="button" type="submit">Save basic branding <Check size={17}/></button>{saved && <span className="admin-saved" role="status">Saved in this demo</span>}</form></>;
}

function Users({ state, setState }: { state: AdminState; setState: React.Dispatch<React.SetStateAction<AdminState>> }) {
  const [show, setShow] = useState(false); const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [role, setRole] = useState<AdminUser["role"]>("Advisor"); const [query,setQuery]=useState("");
  const visible=state.users.filter(user=>`${user.name} ${user.email} ${user.role} ${user.status}`.toLowerCase().includes(query.toLowerCase()));
  const submit = (e: React.FormEvent) => { e.preventDefault(); setState(s => ({ ...s, users: [...s.users, { id: crypto.randomUUID(), name, email, role, status: "Invitation pending", clients: role === "Advisor" ? 0 : undefined }] })); setName(""); setEmail(""); setShow(false); };
  return <><AdminHeader eyebrow="USERS / ADVISORS" title="Manage firm access.">Add firm administrators and advisors. This prototype records an invitation state without sending email.</AdminHeader><div className="admin-actions"><label className="admin-search"><Search size={16}/><span className="sr-only">Search users</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search people, roles, or status"/></label><button className="button" onClick={() => setShow(!show)}>{show ? "Close invitation" : "Invite user"} <UsersRound size={17}/></button></div>{show && <form className="admin-card invite-form" onSubmit={submit}><label>Full name<input required value={name} onChange={e => setName(e.target.value)} /></label><label>Email address<input type="email" required value={email} onChange={e => setEmail(e.target.value)} /></label><label>Role<select value={role} onChange={e => setRole(e.target.value as AdminUser["role"])}><option>Advisor</option><option>Firm administrator</option></select></label><button className="button" type="submit">Create demo invitation <Check size={17}/></button></form>}<section className="admin-card admin-table" aria-label="Firm users"><div className="admin-table-head"><span>Person</span><span>Role</span><span>Status</span><span>Clients</span></div>{visible.map(user => <div className="admin-table-row" key={user.id}><div><strong>{user.name}</strong><small>{user.email}</small></div><span>{user.role}</span><span><i className={user.status === "Active" ? "status-active" : "status-pending"}/>{user.status}</span><span>{user.role === "Advisor" ? user.clients : "—"}</span></div>)}</section><p className="admin-help">{visible.length} of {state.users.length} people shown. Client access still requires an active same-tenant advisor assignment.</p></>;
}

function Features({ state, setState }: { state: AdminState; setState: React.Dispatch<React.SetStateAction<AdminState>> }) { const items: { key: keyof AdminState["features"]; title: string; text: string }[] = [{ key: "planning", title: "Planning Updates", text: "Lightweight client change-checks with defined material-change review." }, { key: "assessments", title: "Approved assessments", text: "Select from RetirementTrack-maintained, versioned assessments." }, { key: "education", title: "Learning library", text: "Choose approved platform-curated educational content." }, { key: "benchmarking", title: "Benchmark context", text: "Enable only after source, methodology, and usage are validated." }, { key: "reminders", title: "Reminders", text: "Platform-led email and in-app reminders for supported activities." }]; return <><AdminHeader eyebrow="FEATURE CONTROLS" title="Choose the enabled MVP capabilities.">Firm-disabled features do not appear in a client experience. Changes are local to this prototype.</AdminHeader><section className="admin-setting-list">{items.map(item => <label className="admin-toggle" key={item.key}><div><strong>{item.title}</strong><span>{item.text}</span></div><input aria-label={`Enable ${item.title}`} type="checkbox" checked={state.features[item.key]} onChange={() => setState(s => ({ ...s, features: { ...s.features, [item.key]: !s.features[item.key] } }))}/><i/></label>)}</section></> }

function Communications({ state, setState }: { state: AdminState; setState: React.Dispatch<React.SetStateAction<AdminState>> }) { const modes: { value: AdminState["communicationMode"]; title: string; text: string }[] = [{ value: "Automatic", title: "Automatic", text: "A supported email or in-app reminder can be released without advisor approval." }, { value: "Advisor approval", title: "Advisor approval", text: "Supported reminders require an advisor review step before release." }, { value: "Off", title: "Off", text: "No communications are released by RetirementTrack." }]; return <><AdminHeader eyebrow="COMMUNICATION MODES" title="Set a practical default.">This applies to supported email and in-app communication scenarios. No messages are sent by this prototype.</AdminHeader><section className="admin-setting-list">{modes.map(mode => <label className="admin-radio" key={mode.value}><input type="radio" name="communication" checked={state.communicationMode === mode.value} onChange={() => setState(s => ({ ...s, communicationMode: mode.value }))}/><div><strong>{mode.title}</strong><span>{mode.text}</span></div></label>)}</section><section className="admin-note"><Mail size={20}/><div><strong>Current mode: {state.communicationMode}</strong><p>Production communication requires approved templates, consent, delivery history, and provider configuration.</p></div></section></> }

function Content({ state, setState }: { state: AdminState; setState: React.Dispatch<React.SetStateAction<AdminState>> }) { return <><AdminHeader eyebrow="CONTENT AVAILABILITY" title="Choose approved learning resources.">Control the platform-provided resource groups available to your client experience. This does not create a CMS.</AdminHeader><section className="admin-setting-list">{state.content.map(item => <label className="admin-toggle" key={item.id}><div><strong>{item.title}</strong><span>Platform-provided educational content.</span></div><input aria-label={`Enable ${item.title}`} type="checkbox" checked={item.enabled} onChange={() => setState(s => ({ ...s, content: s.content.map(x => x.id === item.id ? { ...x, enabled: !x.enabled } : x) }))}/><i/></label>)}</section></> }

function Governance({ state, setState }: { state: AdminState; setState: React.Dispatch<React.SetStateAction<AdminState>> }) { return <><AdminHeader eyebrow="ADVISOR / CLIENT GOVERNANCE" title="Visibility without unnecessary access.">Firm administration controls relationships and policy. It does not automatically expose client financial, assessment, or Planning Update details.</AdminHeader><section className="admin-governance-grid"><article className="admin-card governance-summary"><ShieldCheck/><div><span>ADVISOR ACCESS</span><h2>Assigned clients only</h2><p>Access requires the same tenant, an active advisor role, and an active advisor-client assignment. Reassignment ends the previous authorization period without erasing history.</p></div></article><article className="admin-card governance-summary"><UsersRound/><div><span>ADVISOR DASHBOARD</span><h2>Three separate signals</h2><p>Client accomplishments, outstanding client items, and true advisor-attention exceptions remain structurally distinct.</p></div></article></section><section className="admin-card governance-card"><h2>Client contact</h2><fieldset>{(["Display contact details", "Platform messages"] as const).map(value => <label className="admin-radio" key={value}><input type="radio" name="contact" checked={state.clientContact === value} onChange={() => setState(s => ({ ...s, clientContact: value }))}/><div><strong>{value}</strong><span>{value === "Display contact details" ? "MVP default: show authorized email or phone details for client-initiated contact." : "Requires communication workflows and retention decisions."}</span></div></label>)}</fieldset></section><section className="admin-note"><ShieldCheck size={20}/><div><strong>Least-privilege boundary</strong><p>Administrative access manages users, assignments, configuration, content, and communications. Sensitive client detail requires a separate authorized relationship.</p></div></section></> }

function DataPrivacy({state,setState}:{state:AdminState;setState:React.Dispatch<React.SetStateAction<AdminState>>}){return <><AdminHeader eyebrow="HOUSEHOLD & DATA PRIVACY" title="Shared household by default, private when needed.">Keep separate user identities while allowing authorized household participants to share the household planning experience after acknowledgment.</AdminHeader><section className="admin-setting-list"><label className="admin-toggle"><div><strong>Shared household experience</strong><span>Require an acknowledgment that household information is visible to authorized household participants.</span></div><input type="checkbox" checked={state.householdSharing} onChange={()=>setState(s=>({...s,householdSharing:!s.householdSharing}))}/><i/></label><label className="admin-toggle"><div><strong>Individual/private classification</strong><span>Allow appropriate records to remain outside shared household visibility without creating a complex spouse-permission engine.</span></div><input type="checkbox" checked={state.privateRecords} onChange={()=>setState(s=>({...s,privateRecords:!s.privateRecords}))}/><i/></label><label className="admin-toggle"><div><strong>High-level financial information</strong><span>Allow account type, ownership, approximate/current balance, and high-level income, savings, or net worth.</span></div><input type="checkbox" checked={state.highLevelFinancialData} onChange={()=>setState(s=>({...s,highLevelFinancialData:!s.highLevelFinancialData}))}/><i/></label></section><section className="admin-boundary-grid"><article><Database/><h2>May be collected</h2><p>Account type, ownership, approximate/current balance, retirement timing, and planning context.</p></article><article><LockKeyhole/><h2>Always out of scope</h2><p>Account numbers, credentials, holdings, transactions, brokerage statements, and aggregation feeds.</p></article></section><section className="admin-note"><BadgeCheck size={20}/><div><strong>Data lifecycle readiness</strong><p>The architecture supports tenant-scoped export, retention, portability, and deletion workflows. Exact firm policies remain subject to business and legal review.</p></div></section></>}
