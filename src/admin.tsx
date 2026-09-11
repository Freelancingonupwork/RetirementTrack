import React, { useEffect, useState } from "react";
import { Link, NavLink, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { BadgeCheck, BellRing, BookOpen, Building2, Check, ChevronRight, CircleUserRound, ClipboardCheck, Mail, Palette, PanelTop, Settings2, ShieldCheck, SlidersHorizontal, UsersRound } from "lucide-react";

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
};

const initial: AdminState = {
  firmName: "Harbor Wealth",
  displayName: "Harbor Wealth",
  accent: "#226c6b",
  features: { planning: true, assessments: true, education: true, benchmarking: false, reminders: true },
  communicationMode: "Advisor approval",
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
};

const adminNav = [
  ["overview", "Administration overview", Building2],
  ["branding", "Basic branding", Palette],
  ["users", "Users & advisors", UsersRound],
  ["features", "Feature controls", SlidersHorizontal],
  ["communications", "Communication modes", Mail],
  ["content", "Content availability", BookOpen],
  ["governance", "Advisor & client governance", ShieldCheck],
] as const;

function AdminHeader({ eyebrow, title, children }: { eyebrow: string; title: string; children?: React.ReactNode }) {
  return <header className="admin-heading"><p>{eyebrow}</p><h1 tabIndex={-1}>{title}</h1>{children && <div>{children}</div>}</header>;
}

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
    <div className="admin-grid"> <AdminTile to="branding" icon={<Palette/>} title="Basic branding" detail="Firm name, display name, and controlled accent color." state="Configured"/><AdminTile to="users" icon={<UsersRound/>} title="Users & advisors" detail={`${state.users.length} active team members · ${state.users.filter(x => x.role === "Advisor").length} advisors`} state="Manage"/><AdminTile to="features" icon={<SlidersHorizontal/>} title="Feature controls" detail={`${enabled} of 5 MVP capabilities enabled.`} state="Review"/><AdminTile to="communications" icon={<Mail/>} title="Communication modes" detail={`${state.communicationMode} for supported reminders.`} state="Configured"/><AdminTile to="content" icon={<BookOpen/>} title="Content availability" detail={`${state.content.filter(x => x.enabled).length} of ${state.content.length} resource groups available.`} state="Review"/><AdminTile to="governance" icon={<ShieldCheck/>} title="Advisor / client governance" detail={state.advisorVisibility} state="Review"/></div>
    <section className="admin-note"><BellRing size={20}/><div><strong>What this prototype controls</strong><p>Configuration is saved only in this browser. Invitations, communications, identities, and permission enforcement are not connected to production systems.</p></div></section></>;
}

function AdminTile({ to, icon, title, detail, state }: { to: string; icon: React.ReactNode; title: string; detail: string; state: string }) { return <Link className="admin-tile" to={`/admin/${to}`}><div className="admin-tile-icon">{icon}</div><div><span>{state}</span><h2>{title}</h2><p>{detail}</p><b>Open settings <ChevronRight size={15}/></b></div></Link>; }

function Branding({ state, setState }: { state: AdminState; setState: React.Dispatch<React.SetStateAction<AdminState>> }) {
  const [draft, setDraft] = useState({ firmName: state.firmName, displayName: state.displayName, accent: state.accent }); const [saved, setSaved] = useState(false);
  return <><AdminHeader eyebrow="BASIC BRANDING" title="Recognizable to your clients.">Keep the first-build brand controls disciplined: firm identity and one controlled accent.</AdminHeader><form className="admin-card admin-form" onSubmit={e => { e.preventDefault(); setState(s => ({ ...s, ...draft })); setSaved(true); }}><div className="admin-preview" style={{ "--admin-accent": draft.accent } as React.CSSProperties}><Building2/><strong>{draft.displayName || "Your firm"}</strong><span>RetirementTrack client portal</span></div><label>Legal firm name<input required value={draft.firmName} onChange={e => setDraft({ ...draft, firmName: e.target.value })}/></label><label>Client-facing display name<input required value={draft.displayName} onChange={e => setDraft({ ...draft, displayName: e.target.value })}/></label><label>Controlled accent color<input type="color" value={draft.accent} onChange={e => setDraft({ ...draft, accent: e.target.value })}/></label><p className="admin-help">Logo upload, custom domains, and full theme design are outside this MVP prototype.</p><button className="button" type="submit">Save basic branding <Check size={17}/></button>{saved && <span className="admin-saved" role="status">Saved in this demo</span>}</form></>;
}

function Users({ state, setState }: { state: AdminState; setState: React.Dispatch<React.SetStateAction<AdminState>> }) {
  const [show, setShow] = useState(false); const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [role, setRole] = useState<AdminUser["role"]>("Advisor");
  const submit = (e: React.FormEvent) => { e.preventDefault(); setState(s => ({ ...s, users: [...s.users, { id: crypto.randomUUID(), name, email, role, status: "Invitation pending", clients: role === "Advisor" ? 0 : undefined }] })); setName(""); setEmail(""); setShow(false); };
  return <><AdminHeader eyebrow="USERS / ADVISORS" title="Manage firm access.">Add firm administrators and advisors. This prototype records an invitation state without sending email.</AdminHeader><div className="admin-actions"><span>{state.users.length} people configured</span><button className="button" onClick={() => setShow(!show)}>{show ? "Close invitation" : "Invite user"} <UsersRound size={17}/></button></div>{show && <form className="admin-card invite-form" onSubmit={submit}><label>Full name<input required value={name} onChange={e => setName(e.target.value)} /></label><label>Email address<input type="email" required value={email} onChange={e => setEmail(e.target.value)} /></label><label>Role<select value={role} onChange={e => setRole(e.target.value as AdminUser["role"])}><option>Advisor</option><option>Firm administrator</option></select></label><button className="button" type="submit">Create demo invitation <Check size={17}/></button></form>}<section className="admin-card admin-table" aria-label="Firm users"><div className="admin-table-head"><span>Person</span><span>Role</span><span>Status</span><span>Clients</span></div>{state.users.map(user => <div className="admin-table-row" key={user.id}><div><strong>{user.name}</strong><small>{user.email}</small></div><span>{user.role}</span><span><i className={user.status === "Active" ? "status-active" : "status-pending"}/>{user.status}</span><span>{user.role === "Advisor" ? user.clients : "—"}</span></div>)}</section><p className="admin-help">Client assignments and role enforcement are shown under governance; real identity access is not implemented.</p></>;
}

function Features({ state, setState }: { state: AdminState; setState: React.Dispatch<React.SetStateAction<AdminState>> }) { const items: { key: keyof AdminState["features"]; title: string; text: string }[] = [{ key: "planning", title: "Planning Updates", text: "Recurring client updates with meaningful-change review." }, { key: "assessments", title: "Assessments", text: "Fixed Investment & Risk Assessment experience." }, { key: "education", title: "Learning library", text: "Firm-approved platform education." }, { key: "benchmarking", title: "Benchmark context", text: "Enable only after data and methodology are validated." }, { key: "reminders", title: "Reminders", text: "In-app reminder state for incomplete activities." }]; return <><AdminHeader eyebrow="FEATURE CONTROLS" title="Choose the enabled MVP capabilities.">Firm-disabled features do not appear in a client experience. Changes are local to this prototype.</AdminHeader><section className="admin-setting-list">{items.map(item => <label className="admin-toggle" key={item.key}><div><strong>{item.title}</strong><span>{item.text}</span></div><input aria-label={`Enable ${item.title}`} type="checkbox" checked={state.features[item.key]} onChange={() => setState(s => ({ ...s, features: { ...s.features, [item.key]: !s.features[item.key] } }))}/><i/></label>)}</section></> }

function Communications({ state, setState }: { state: AdminState; setState: React.Dispatch<React.SetStateAction<AdminState>> }) { const modes: { value: AdminState["communicationMode"]; title: string; text: string }[] = [{ value: "Automatic", title: "Automatic", text: "A supported reminder can be released without advisor approval." }, { value: "Advisor approval", title: "Advisor approval", text: "Supported reminders require an advisor review step before release." }, { value: "Off", title: "Off", text: "No communications are released by RetirementTrack." }]; return <><AdminHeader eyebrow="COMMUNICATION MODES" title="Set a practical default.">This applies to future supported communication scenarios. No emails, SMS, or platform messages are sent here.</AdminHeader><section className="admin-setting-list">{modes.map(mode => <label className="admin-radio" key={mode.value}><input type="radio" name="communication" checked={state.communicationMode === mode.value} onChange={() => setState(s => ({ ...s, communicationMode: mode.value }))}/><div><strong>{mode.title}</strong><span>{mode.text}</span></div></label>)}</section><section className="admin-note"><Mail size={20}/><div><strong>Current mode: {state.communicationMode}</strong><p>Sender identity, templates, channels, consent, and history remain later product decisions.</p></div></section></> }

function Content({ state, setState }: { state: AdminState; setState: React.Dispatch<React.SetStateAction<AdminState>> }) { return <><AdminHeader eyebrow="CONTENT AVAILABILITY" title="Choose approved learning resources.">Control the platform-provided resource groups available to your client experience. This does not create a CMS.</AdminHeader><section className="admin-setting-list">{state.content.map(item => <label className="admin-toggle" key={item.id}><div><strong>{item.title}</strong><span>Platform-provided educational content.</span></div><input aria-label={`Enable ${item.title}`} type="checkbox" checked={item.enabled} onChange={() => setState(s => ({ ...s, content: s.content.map(x => x.id === item.id ? { ...x, enabled: !x.enabled } : x) }))}/><i/></label>)}</section></> }

function Governance({ state, setState }: { state: AdminState; setState: React.Dispatch<React.SetStateAction<AdminState>> }) { return <><AdminHeader eyebrow="ADVISOR / CLIENT GOVERNANCE" title="Keep access intentional.">Use clear assignment and contact defaults without building a complex permission designer.</AdminHeader><section className="admin-card governance-card"><h2>Advisor visibility</h2><fieldset>{(["Assigned clients only", "All firm clients"] as const).map(value => <label className="admin-radio" key={value}><input type="radio" name="visibility" checked={state.advisorVisibility === value} onChange={() => setState(s => ({ ...s, advisorVisibility: value }))}/><div><strong>{value}</strong><span>{value === "Assigned clients only" ? "Recommended MVP default. Advisors view only actively assigned clients." : "Requires a future authorization policy review."}</span></div></label>)}</fieldset><h2>Client contact</h2><fieldset>{(["Display contact details", "Platform messages"] as const).map(value => <label className="admin-radio" key={value}><input type="radio" name="contact" checked={state.clientContact === value} onChange={() => setState(s => ({ ...s, clientContact: value }))}/><div><strong>{value}</strong><span>{value === "Display contact details" ? "Recommended MVP default: email or call links only." : "Requires communication workflows and retention decisions."}</span></div></label>)}</fieldset></section><section className="admin-note"><ShieldCheck size={20}/><div><strong>Governance boundary</strong><p>Primary advisor assignment, household relationships, reassignment rules, and sensitive-data visibility need confirmed business rules before production authorization is built.</p></div></section></> }
