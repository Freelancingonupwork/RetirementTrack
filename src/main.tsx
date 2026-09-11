import { registerProgressReader } from "./webmcp";
import React, {
  useEffect,
  useRef,
  useState,
  createContext,
  useContext,
} from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  Link,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle2,
  LayoutDashboard,
  ClipboardList,
  BookOpen,
  ChartNoAxesCombined,
  MessageSquare,
  UserRound,
  LogOut,
  ShieldCheck,
  Compass,
  ChevronRight,
  Mail,
  Phone,
  X,
  Menu,
  Clock,
  CalendarDays,
  Target,
  PlayCircle,
  FileText,
  Image as ImageIcon,
  Lightbulb,
  Search,
  Sparkles,
} from "lucide-react";
import {
  initialState,
  submitPlanning,
  submitAssessment,
  progress,
  firm,
  advisor,
  type State,
  type Snapshot,
} from "./domain";
import "./styles.css";
import "./admin.css";
import "./advisor.css";
import "./platform.css";
import "./theme.css";
import { FirmAdministration } from "./admin";
import { AdvisorWorkspace } from "./advisor";
import { PlatformWorkspace } from "./platform";
import michaelCarterAvatar from "./assets/michael-carter-avatar.png";
const Context = createContext<{
  s: State;
  set: React.Dispatch<React.SetStateAction<State>>;
}>({ s: initialState(), set: () => {} });
const useStore = () => useContext(Context);
const Button = ({
  children,
  ...p
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button {...p} className={`button ${p.className || ""}`}>
    {children}
  </button>
);
const Go = ({
  to,
  children,
  secondary = false,
}: {
  to: string;
  children: React.ReactNode;
  secondary?: boolean;
}) => (
  <Link className={`button ${secondary ? "secondary" : ""}`} to={to}>
    {children}
    <ArrowRight size={17} />
  </Link>
);
const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="badge">{children}</span>
);
function Header({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="page-heading">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1 tabIndex={-1}>{title}</h1>
      {children && <p className="lede">{children}</p>}
    </header>
  );
}
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}
function Brand() {
  return (
    <Link to="/client/dashboard" className="brand">
      <Compass size={32} />
      <span>
        Retirement<span className="brand-light">Track</span>
        <small>BY HARBOR WEALTH</small>
      </span>
    </Link>
  );
}
function Contact({ close }: { close: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const prev = document.activeElement as HTMLElement;
    ref.current?.showModal();
    return () => prev?.focus();
  }, []);
  return (
    <dialog ref={ref} onCancel={close}>
      <button
        className="icon close"
        aria-label="Close advisor contact"
        onClick={close}
      >
        <X />
      </button>
      <div className="avatar large">MC</div>
      <h2>Contact your advisor</h2>
      <p>
        {advisor.name}, {advisor.credentials}
        <br />
        {firm.name}
      </p>
      <p className="muted">
        Demo contact details. No message is sent by this prototype.
      </p>
      <a className="contact-link" href={`mailto:${advisor.email}`}>
        <Mail size={20} />
        {advisor.email}
      </a>
      <a className="contact-link" href={`tel:${advisor.phone}`}>
        <Phone size={20} />
        {advisor.phone}
      </a>
      <Button className="secondary full" onClick={close}>
        Close
      </Button>
    </dialog>
  );
}
const navigation = [
  ["dashboard", "Overview", LayoutDashboard],
  ["planning-update", "Planning Update", ClipboardList],
  ["assessments", "Assessments", ShieldCheck],
  ["education", "Learning library", BookOpen],
  ["progress", "My progress", ChartNoAxesCombined],
  ["messages", "Notifications", MessageSquare],
] as const;
function Shell() {
  const { s } = useStore();
  const [contact, setContact] = useState(false);
  const [menu, setMenu] = useState(false);
  const location = useLocation();
  useEffect(() => {
    setMenu(false);
    document.querySelector<HTMLHeadingElement>("h1")?.focus();
    window.scrollTo(0, 0);
  }, [location.pathname]);
  return (
    <div className="app">
      <a className="skip" href="#main">
        Skip to content
      </a>
      <aside className={`sidebar ${menu ? "open" : ""}`}>
        <Brand />
        <nav aria-label="Main navigation">
          {navigation.map(([path, label, Icon]) => (
            <NavLink key={path} to={`/client/${path}`}>
              <span className="nav-icon">
                <Icon size={18} />
              </span>
              {label}
              {path === "planning-update" && s.planning.status === "Due" && (
                <span className="nav-dot" />
              )}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-advisor-card">
            <div className="advisor-mini">
              <img
                className="avatar advisor-photo"
                src={michaelCarterAvatar}
                alt="Michael Carter"
              />
              <div>
                <strong>Michael Carter</strong>
                <small>Your advisor</small>
              </div>
            </div>
            <button className="sidebar-contact" onClick={() => setContact(true)}>
              Contact Advisor <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </aside>
      <div className="workspace">
        <div className="topbar">
          <button
            className="icon mobile-menu"
            aria-label="Toggle navigation"
            aria-expanded={menu}
            onClick={() => setMenu(!menu)}
          >
            <Menu />
          </button>
          <span className="breadcrumb">
            Client portal <ChevronRight size={14} />{" "}
            <strong>
              {navigation.find((n) => location.pathname.includes(n[0]))?.[1] ||
                "Your profile"}
            </strong>
          </span>
          <div className="top-actions">
            <span className="demo-pill">DISCOVERY PROTOTYPE</span>
            <Link
              aria-label="Open notifications"
              className="icon"
              to="/client/messages"
            >
              <MessageSquare size={20} />
            </Link>
            <Link
              className="avatar"
              aria-label="Open profile"
              to="/client/profile"
            >
              {s.profile.name.slice(0, 1)}S
            </Link>
          </div>
        </div>
        <main id="main">
          <Routes>
            <Route
              path="dashboard"
              element={<Dashboard contact={() => setContact(true)} />}
            />
            <Route path="planning-update" element={<Planning />} />
            <Route path="planning-update/review" element={<Review />} />
            <Route path="assessments" element={<AssessmentIntro />} />
            <Route path="assessments/risk" element={<Assessment />} />
            <Route path="assessments/risk/review" element={<AssessmentReview />} />
            <Route path="assessments/risk/result" element={<Result />} />
            <Route path="education" element={<Education />} />
            <Route path="education/:id" element={<Education />} />
            <Route path="milestones/age-65" element={<Age65Milestone />} />
            <Route path="progress" element={<Progress />} />
            <Route path="messages" element={<Messages />} />
            <Route path="benchmarking" element={<Benchmark />} />
            <Route path="profile" element={<Profile edit />} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Routes>
          <footer>
            <span>RetirementTrack · {firm.name}</span>
            <span>
              Demo data only · <Link to="/login">Sign out</Link>
            </span>
          </footer>
        </main>
      </div>
      {contact && <Contact close={() => setContact(false)} />}
    </div>
  );
}
function AttentionItem({
  variant,
  icon,
  badge,
  meta,
  title,
  action,
  children,
}: {
  variant: "featured" | "compact" | "done";
  icon: React.ReactNode;
  badge?: string;
  meta?: React.ReactNode;
  title: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className={`attention-item ${variant}`}>
      <div className="attention-item-icon">{icon}</div>
      <div className="attention-item-body">
        {(badge || meta) && (
          <div className="card-meta">
            {badge && <Badge>{badge}</Badge>}
            {meta}
          </div>
        )}
        <h3>{title}</h3>
        {children && <p>{children}</p>}
        {action}
      </div>
    </div>
  );
}
function Dashboard({ contact }: { contact: () => void }) {
  const { s } = useStore();
  const completed = s.planning.status === "Completed";
  const assessed = s.assessment.status === "Completed";
  const activitiesDone = [s.profileComplete, completed, assessed].filter(
    Boolean,
  ).length;

  const openItems: React.ReactNode[] = [];
  if (!s.profileComplete) {
    openItems.push(
      <AttentionItem
        key="profile"
        variant="compact"
        icon={<UserRound />}
        badge="START HERE"
        title="Make this space yours"
        action={<Go to="/onboarding/profile">Complete profile</Go>}
      />,
    );
  }
  if (!completed) {
    openItems.push(
      <AttentionItem
        key="planning"
        variant="compact"
        icon={<ClipboardList />}
        badge="UP NEXT"
        meta={
          <span>
            <Clock size={13} /> Due September 30
          </span>
        }
        title="Let’s catch up on what’s changed."
        action={
          <div className="action-line">
            <Go to="/client/planning-update">Start Planning Update</Go>
            <span>
              <Clock size={15} /> About 3 minutes
            </span>
          </div>
        }
      />,
    );
  }
  if (!assessed) {
    openItems.push(
      <AttentionItem
        key="assessment"
        variant="compact"
        icon={<ShieldCheck />}
        badge="RECOMMENDED"
        title="Get to know your investment comfort."
        action={
          <div className="action-line">
            <Go to="/client/assessments" secondary>
              Explore assessment
            </Go>
            <span>
              <Clock size={15} /> About 4 minutes
            </span>
          </div>
        }
      />,
    );
  }
  const doneItems: React.ReactNode[] = [];
  if (completed) {
    doneItems.push(
      <AttentionItem
        key="planning-done"
        variant="done"
        icon={<CheckCircle2 />}
        title="Planning Update complete"
        action={
          <Link to="/client/planning-update/review">
            View your update <ArrowRight size={15} />
          </Link>
        }
      />,
    );
  }
  if (assessed) {
    doneItems.push(
      <AttentionItem
        key="assessment-done"
        variant="done"
        icon={<CheckCircle2 />}
        title="Your assessment is complete"
        action={
          <Link to="/client/assessments/risk/result">
            View your result <ArrowRight size={15} />
          </Link>
        }
      />,
    );
  }

  return (
    <>
      <div className="heading-row">
        <Header
          title={`${completed || assessed ? "Welcome back" : "Good morning"}, ${s.profile.name}.`}
        />
        <button type="button" className="dashboard-advisor-cta" onClick={contact}>
          <img
            className="avatar advisor-photo advisor-avatar"
            src={michaelCarterAvatar}
            alt="Michael Carter"
          />
          <span>
            <small>{advisor.name}</small>
            <strong>Contact Advisor</strong>
          </span>
          <ArrowRight size={18} />
        </button>
      </div>
      <section className="hero-status">
        <div className="hero-status-left">
          <Badge>{s.profile.stage}</Badge>
          <div className="hero-status-copy">
            <strong>Profile & planning status</strong>
            <span>{activitiesDone} of 3 activities complete</span>
          </div>
        </div>
        <div className="hero-status-center">
          <div
            className="status-ring"
            role="progressbar"
            aria-valuenow={progress(s)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Profile and planning activity completion"
            style={{ "--ring-value": progress(s) } as React.CSSProperties}
          >
            <div className="status-ring-inner">
              <strong>{progress(s)}%</strong>
              <span>Complete</span>
            </div>
          </div>
          <div className="journey-steps hero-status-steps">
            {["Profile", "Planning Update", "Assessment"].map((x, i) => (
              <span key={x} className={[s.profileComplete, completed, assessed][i] ? "is-done" : ""}>
                <span
                  className={`step-dot ${[s.profileComplete, completed, assessed][i] ? "done" : ""}`}
                >
                  {[s.profileComplete, completed, assessed][i] ? (
                    <Check size={12} />
                  ) : (
                    i + 1
                  )}
                </span>
                {x}
              </span>
            ))}
          </div>
        </div>
        <Link className="hero-status-link" to="/client/progress">
          View journey <ArrowRight size={16} />
        </Link>
      </section>
      <div className="dashboard-grid">
        <div>
          <div className="section-heading">
            <h2>What deserves your attention</h2>
            <span>{openItems.length} open activities</span>
          </div>
          <div className="attention-layout equal">
            {openItems}
            {doneItems}
          </div>
          <div className="section-heading library-heading">
            <h2>Selected for your next chapter</h2>
            <Link to="/client/education">
              View library <ArrowRight size={16} />
            </Link>
          </div>
          <div className="article-grid">
            {(assessed ? [1, 2] : [0, 1]).map((i) => (
              <ArticleCard key={i} i={i} showReason />
            ))}
          </div>
          <section className="return-engagement">
            <div className="return-icon"><Sparkles size={21}/></div>
            <div>
              <p className="eyebrow">{s.read.length ? "CONTINUE EXPLORING" : "NEW FOR YOU"}</p>
              <h3>{s.read.length ? articles[Number(s.read.at(-1))]?.title || articles[3].title : articles[3].title}</h3>
            </div>
            <Link to={s.read.length ? `/client/education/${s.read.at(-1)}` : "/client/education/3"}>
              {s.read.length ? "Continue" : "Explore"}
              <ArrowRight size={16}/>
            </Link>
          </section>
        </div>
        <aside className="right-column">
          <section className="card next">
            <p className="eyebrow">LOOKING AHEAD</p>
            <h2>What’s coming next</h2>
            <div className="timeline-row">
              <span className="timeline-dot" />
              <div>
                <small>SEPTEMBER 2026</small>
                <h3>
                  {completed
                    ? "Planning Update received"
                    : "Your quarterly check-in"}
                </h3>
              </div>
            </div>
            <div className="timeline-row">
              <span className="timeline-dot hollow" />
              <div>
                <small>YOUR RETIREMENT HORIZON</small>
                <h3>Target age {s.profile.retirementAge}</h3>
                <Link to="/client/profile">
                  View profile <ArrowRight size={14} />
                </Link>
              </div>
            </div>
            <div className="timeline-row">
              <span className="timeline-dot hollow" />
              <div>
                <small>PERSONAL MILESTONE</small>
                <h3>Prepare for your age 65 conversation</h3>
                <Link to="/client/milestones/age-65">
                  Explore milestone <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </section>
          <section className="benchmark-card">
            <ChartNoAxesCombined size={23} />
            <h3>A little perspective</h3>
            <Link to="/client/benchmarking">
              Explore benchmarks <ArrowRight size={15} />
            </Link>
          </section>
        </aside>
      </div>
    </>
  );
}
function DashboardVariant({ contact }: { contact: () => void }) {
  const { s } = useStore();
  const completed = s.planning.status === "Completed";
  const assessed = s.assessment.status === "Completed";
  const openActivities =
    Number(!completed) + Number(!assessed) + Number(!s.profileComplete);
  return (
    <div className="dashboard-variant">
      <div className="variant-heading">
        <div>
          <p className="eyebrow">CLIENT OVERVIEW · SEPTEMBER 9, 2026</p>
          <Header
            eyebrow="YOUR NEXT CHAPTER"
            title={`${completed || assessed ? "Welcome back" : "Good morning"}, ${s.profile.name}.`}
          >
            A clear view of what is current, what needs attention, and what is
            coming next.
          </Header>
        </div>
        <div className="variant-profile">
          <div className="avatar large">{s.profile.name.slice(0, 1)}S</div>
          <div>
            <strong>{s.profile.stage}</strong>
            <span>{firm.name} · {advisor.name}</span>
          </div>
        </div>
      </div>
      <section className="variant-status">
        <div className="variant-status-copy">
          <Badge>{openActivities ? `${openActivities} open activities` : "All current activities complete"}</Badge>
          <h2>Your planning, at a glance.</h2>
          <p>Keep your details current and take the next small step when it feels right.</p>
        </div>
        <div className="variant-progress">
          <div><span>Activity completion</span><strong>{progress(s)}%</strong></div>
          <progress max={100} value={progress(s)} aria-label="Activity completion" />
          <small>Profile, Planning Update, and Assessment. Not a retirement-readiness score.</small>
        </div>
      </section>
      <div className="variant-layout">
        <div className="variant-main-column">
          <div className="variant-section-title">
            <div>
              <p className="eyebrow">PRIORITIES</p>
              <h2>What deserves your attention</h2>
            </div>
            <span>{openActivities} open</span>
          </div>
          <div className="variant-priority-list">
            {!s.profileComplete && (
              <div className="variant-priority priority-teal">
                <div className="variant-number">01</div>
                <UserRound />
                <div>
                  <Badge>START HERE</Badge>
                  <h3>Make this space yours</h3>
                  <p>Confirm a few details to personalize your experience.</p>
                  <Go to="/onboarding/profile">Complete profile</Go>
                </div>
              </div>
            )}
            {!completed && (
              <div className="variant-priority priority-blue">
                <div className="variant-number">{s.profileComplete ? "01" : "02"}</div>
                <ClipboardList />
                <div>
                  <div className="card-meta"><Badge>UP NEXT</Badge><span>Due September 30</span></div>
                  <h3>Let's catch up on what has changed.</h3>
                  <div className="action-line"><Go to="/client/planning-update">Start Planning Update</Go><span><Clock size={15} /> About 3 minutes</span></div>
                </div>
              </div>
            )}
            {!assessed && (
              <div className="variant-priority priority-sand">
                <div className="variant-number">{openActivities}</div>
                <ShieldCheck />
                <div>
                  <Badge>RECOMMENDED</Badge>
                  <h3>Get to know your investment comfort.</h3>
                  <p>A few questions about risk, time, and how you feel about market changes.</p>
                  <div className="action-line"><Go to="/client/assessments" secondary>Explore assessment</Go><span><Clock size={15} /> About 4 minutes</span></div>
                </div>
              </div>
            )}
            {completed && assessed && s.profileComplete && (
              <div className="variant-complete"><CheckCircle2 /><div><h3>Your current activities are complete</h3><p>Your latest information and assessment are ready for your next conversation with Michael.</p></div></div>
            )}
          </div>
          <div className="variant-section-title content-title">
            <div><h2>Relevant content</h2></div>
            <Link to="/client/education">View library <ArrowRight size={16} /></Link>
          </div>
          <div className="article-grid">{(assessed ? [1, 2] : [0, 1]).map((i) => <ArticleCard key={i} i={i} />)}</div>
        </div>
        <aside className="variant-rail">
          <section className="variant-rail-panel">
            <p className="eyebrow">LOOKING AHEAD</p>
            <h2>What's coming next</h2>
            <div className="variant-milestone"><CalendarDays /><div><small>SEPTEMBER 2026</small><strong>{completed ? "Planning Update received" : "Your quarterly check-in"}</strong><span>{completed ? "Next check-in: December 2026." : "A small check-in to keep your planning current."}</span></div></div>
            <div className="variant-milestone"><Target /><div><small>RETIREMENT HORIZON</small><strong>Target age {s.profile.retirementAge}</strong><Link to="/client/profile">View profile <ArrowRight size={14} /></Link></div></div>
          </section>
          <section className="variant-rail-panel advisor-variant">
            <p className="eyebrow">YOUR ADVISOR</p>
            <div className="advisor-identity"><div className="avatar large">MC</div><div><h3>{advisor.name}, {advisor.credentials}</h3><p>{firm.name}</p></div></div>
            <p>Questions, changes, or just a little perspective.</p>
            <Button className="full" onClick={contact}>Contact Advisor <ArrowRight size={16} /></Button>
          </section>
          <section className="variant-benchmark"><ChartNoAxesCombined size={22} /><div><strong>A little perspective</strong><p>Benchmark context is unavailable until validated inputs are connected.</p><Link to="/client/benchmarking">Learn more <ArrowRight size={14} /></Link></div></section>
        </aside>
      </div>
    </div>
  );
}
function Auth({ activate = false }: { activate?: boolean }) {
  const { s, set } = useStore();
  const nav = useNavigate();
  return (
    <div className="auth">
      <aside>
        <Brand />
        <div>
          <p className="eyebrow">YOUR NEXT CHAPTER</p>
          <h2>
            A clearer view
            <br />
            of what’s ahead.
          </h2>
          <p>
            Stay connected to your planning.
            <br />
            And the people helping you get there.
          </p>
          <ul className="auth-highlights">
            <li>
              <span className="auth-highlight-icon">
                <ClipboardList size={16} />
              </span>
              Keep your planning update current
            </li>
            <li>
              <span className="auth-highlight-icon">
                <ShieldCheck size={16} />
              </span>
              See where you stand, clearly
            </li>
            <li>
              <span className="auth-highlight-icon">
                <MessageSquare size={16} />
              </span>
              Stay in touch with your advisor
            </li>
          </ul>
          <div className="auth-line" />
          <span>PERSONAL GUIDANCE. EVERY STEP.</span>
        </div>
        <small>Harbor Wealth · RetirementTrack</small>
      </aside>
      <main>
        <span className="demo-pill">INTERACTIVE PROTOTYPE · MOCK ACCOUNTS</span>
        <Header
          eyebrow={
            activate ? "INVITED BY HARBOR WEALTH" : "WELCOME TO RETIREMENTTRACK"
          }
          title={activate ? "Your next chapter starts here." : "Welcome back."}
        >
          {activate
            ? "Michael Carter has invited you to your personal planning space."
            : "Sign in to continue your planning journey."}
        </Header>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (activate) {
              set({
                ...s,
                activated: true,
                consentAt: new Date().toISOString(),
              });
              nav("/onboarding/profile");
            } else
              nav(
                s.profileComplete ? "/client/dashboard" : "/onboarding/profile",
              );
          }}
        >
          <Field label="Email address">
            <input
              type="email"
              required
              defaultValue="sarah.smith@example.com"
              autoComplete="email"
            />
          </Field>
          <Field label={activate ? "Create a password" : "Demo password"}>
            <input
              type="password"
              minLength={8}
              required
              defaultValue="DemoOnly123"
              autoComplete={activate ? "new-password" : "current-password"}
            />
          </Field>
          {activate && (
            <label className="checkbox">
              <input type="checkbox" required />{" "}
              <span>
                I understand this is a prototype with fictional data and consent
                to continuing the demo. Production notices are pending
                confirmation.
              </span>
            </label>
          )}
          <Button className="full" type="submit">
            {activate ? "Activate account" : "Sign in"}
            <ArrowRight size={18} />
          </Button>
          <p className="muted">
            Use the prefilled demo details. No password is saved or sent.
          </p>
        </form>
        <div className="auth-links">
          {activate ? (
            <Link to="/login">Already activated? Sign in</Link>
          ) : (
            <Link to="/activate">
              Have an invitation? Activate your account
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}
function Profile({ edit = false }: { edit?: boolean }) {
  const { s, set } = useStore();
  const [p, update] = useState(s.profile);
  const nav = useNavigate();
  return (
    <div className="form-page">
      {!edit && <Brand />}
      <Header
        eyebrow={
          edit ? "YOUR INFORMATION" : "GETTING TO KNOW YOU · STEP 1 OF 1"
        }
        title={
          edit ? "Your profile" : "A few details. A more personal experience."
        }
      >
        Just the essentials to help keep your planning relevant.
      </Header>
      <form
        className="card form-card"
        onSubmit={(e) => {
          e.preventDefault();
          set({
            ...s,
            profile: p,
            profileComplete: true,
            baseline: { ...s.baseline, retirementAge: p.retirementAge },
            draft: { ...s.draft, retirementAge: p.retirementAge },
          });
          nav("/client/dashboard");
        }}
      >
        <div className="form-grid">
          <Field label="Preferred name">
            <input
              required
              maxLength={40}
              value={p.name}
              onChange={(e) => update({ ...p, name: e.target.value })}
            />
          </Field>
          <Field label="Date of birth">
            <input
              type="date"
              required
              min="1920-01-01"
              max="2008-09-09"
              value={p.dob}
              onChange={(e) => update({ ...p, dob: e.target.value })}
            />
          </Field>
          <Field label="Life stage">
            <select
              value={p.stage}
              onChange={(e) => update({ ...p, stage: e.target.value })}
            >
              <option>Approaching retirement</option>
              <option>Building toward retirement</option>
              <option>Already retired</option>
            </select>
          </Field>
          <Field label="Target retirement age">
            <input
              type="number"
              min={40}
              max={95}
              required
              value={p.retirementAge}
              onChange={(e) =>
                update({ ...p, retirementAge: Number(e.target.value) })
              }
            />
          </Field>
          <Field label="Household relationship">
            <select
              value={p.relationship}
              onChange={(e) => update({ ...p, relationship: e.target.value })}
            >
              <option>Married / partnered</option>
              <option>Single</option>
              <option>Prefer not to say</option>
            </select>
          </Field>
          {p.relationship === "Married / partnered" && (
            <Field label="Spouse / partner first name (optional)">
              <input
                value={p.partner}
                onChange={(e) => update({ ...p, partner: e.target.value })}
              />
            </Field>
          )}
        </div>
        <p className="note">
          <ShieldCheck size={20} /> Household context helps personalize your
          planning. It does not grant access to another person’s account.
        </p>
        <div className="form-actions">
          <Link to="/client/dashboard">
            {edit ? "Cancel" : "Do this later"}
          </Link>
          <Button type="submit">
            {edit ? "Save profile" : "Go to my dashboard"}
            <ArrowRight size={17} />
          </Button>
        </div>
      </form>
    </div>
  );
}
const labels: Record<keyof Snapshot, string> = {
  retirementAge: "Target retirement age",
  employment: "Employment",
  household: "Household changes",
  concern: "Anything on your mind",
};
function Planning() {
  const { s, set } = useStore();
  const [step, changeStep] = useState(0);
  const [changed, change] = useState(false);
  const nav = useNavigate();
  useEffect(() => {
    const field = (Object.keys(labels) as (keyof Snapshot)[])[step];
    change(String(s.draft[field]) !== String(s.baseline[field]));
  }, [step]);
  if (s.planning.status === "Completed")
    return <Navigate to="/client/planning-update/review" replace />;
  const keys = Object.keys(labels) as (keyof Snapshot)[];
  const key = keys[step];
  const save = (value: string) =>
    set((v) => ({
      ...v,
      draft: {
        ...v.draft,
        [key]: key === "retirementAge" ? Number(value) : value,
      },
    }));
  return (
    <div className="form-page">
      <Header
        eyebrow="YOUR SEPTEMBER PLANNING UPDATE"
        title="Life changes. Let’s keep up."
      >
        We’ve brought forward your information. Confirm what’s current and
        update what’s new.
      </Header>
      <div className="stepper">
        {keys.map((k, i) => (
          <span className={i === step ? "current" : ""} key={k}>
            <span>{i < step ? <Check size={14} /> : i + 1}</span>
            {labels[k]}
          </span>
        ))}
      </div>
      <form
        className="card form-card"
        onSubmit={(e) => {
          e.preventDefault();
          if (step < 3) {
            changeStep(step + 1);
            change(false);
          } else nav("/client/planning-update/review");
        }}
      >
        <p className="eyebrow">QUESTION {step + 1} OF 4</p>
        <h2>
          {key === "concern"
            ? "What else would you like Michael to know?"
            : `Has your ${labels[key].toLowerCase()} changed?`}
        </h2>
        <div className="prior">
          <span>PREVIOUSLY SHARED</span>
          <strong>{s.baseline[key] || "No additional concerns"}</strong>
        </div>
        {key !== "concern" && (
          <fieldset className="choices">
            <legend>Confirm or update</legend>
            <label>
              <input
                type="radio"
                name="change"
                checked={!changed}
                onChange={() => {
                  change(false);
                  save(String(s.baseline[key]));
                }}
              />
              Still the same
            </label>
            <label>
              <input
                type="radio"
                name="change"
                checked={changed}
                onChange={() => change(true)}
              />
              Something has changed
            </label>
          </fieldset>
        )}
        {(changed || key === "concern") && (
          <Field label={labels[key]}>
            {key === "retirementAge" ? (
              <input
                type="number"
                min={40}
                max={95}
                required
                value={s.draft[key]}
                onChange={(e) => save(e.target.value)}
              />
            ) : key === "employment" ? (
              <select
                value={s.draft[key]}
                onChange={(e) => save(e.target.value)}
              >
                {[
                  "Employed full-time",
                  "Employed part-time",
                  "Self-employed",
                  "Retired",
                  "Not currently employed",
                ].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            ) : (
              <textarea
                rows={4}
                maxLength={1000}
                value={s.draft[key]}
                onChange={(e) => save(e.target.value)}
                placeholder={
                  key === "concern"
                    ? "Optional: a question, goal, or upcoming change"
                    : ""
                }
              />
            )}
          </Field>
        )}
        <div className="form-actions">
          <Button
            type="button"
            className="secondary"
            onClick={() => {
              if (step) {
                changeStep(step - 1);
                change(false);
              } else nav("/client/dashboard");
            }}
          >
            <ArrowLeft size={16} />
            Back
          </Button>
          <Button type="submit">
            {step === 3 ? "Review update" : "Continue"}
            <ArrowRight size={16} />
          </Button>
        </div>
        <p className="muted">Your draft is saved on this device as you go.</p>
      </form>
    </div>
  );
}
function Review() {
  const { s, set } = useStore();
  const nav = useNavigate();
  const done = s.planning.status === "Completed";
  const pendingChanges = (Object.keys(labels) as (keyof Snapshot)[]).filter(
    (key) => String(s.baseline[key]) !== String(s.draft[key]),
  ).length;
  return (
    <div className="form-page">
      <Header
        eyebrow={done ? "PLANNING UPDATE · COMPLETE" : "ONE LAST LOOK"}
        title={done ? "You’re up to date." : "Does everything look right?"}
      >
        {done
          ? "Your update has been recorded in this demo."
          : "Review your information before completing your Planning Update."}
      </Header>
      <section className="card form-card">
        <Badge>{done ? "COMPLETED" : "READY FOR REVIEW"}</Badge>
        <h2>September Planning Update</h2>
        {(Object.keys(labels) as (keyof Snapshot)[]).map((k) => {
          const change = done
            ? s.planning.changes.find((c) => c.field === k)
            : String(s.baseline[k]) !== String(s.draft[k])
              ? {
                  before: String(s.baseline[k] || "None"),
                  after: String(s.draft[k] || "None"),
                }
              : undefined;
          return (
            <div className="review-row" key={k}>
              <strong>{labels[k]}</strong>
              <div>
                {change ? (
                  <>
                    <small>Previously: {change.before}</small>
                    <span>
                      {change.after} <Badge>CHANGED</Badge>
                    </span>
                  </>
                ) : (
                  <span>
                    {s.draft[k] || "No additional concerns"}{" "}
                    <small>Unchanged</small>
                  </span>
                )}
              </div>
            </div>
          );
        })}
        <p className="note">
          {done
            ? s.planning.changes.length
              ? "Changes have been flagged for your advisor’s review. No email has been sent."
              : "No changes reported. Your next check-in is in December."
            : pendingChanges
              ? `${pendingChanges} change${pendingChanges === 1 ? "" : "s"} will update your profile and be flagged for advisor review. This prototype does not send communications.`
              : "No changes were identified. Completing this update will not create advisor work."}
        </p>
        <div className="form-actions">
          {!done && <Link to="/client/planning-update">Edit answers</Link>}
          {done ? (
            <Go to="/client/dashboard">Back to dashboard</Go>
          ) : (
            <Button
              onClick={() => {
                set(submitPlanning(s));
                nav("/client/planning-update/review");
              }}
            >
              Complete Planning Update <Check size={17} />
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}
const questions = [
  {
    title: "When might you begin using these investments?",
    options: ["Within 3 years", "In 3–10 years", "More than 10 years from now"],
  },
  {
    title: "How would you feel if your investments fell 15%?",
    options: [
      "Very uncomfortable",
      "Concerned, but able to wait",
      "Comfortable with temporary changes",
    ],
  },
  {
    title: "Which trade-off feels closest to your preference?",
    options: [
      "More stability, even with lower growth",
      "A balance of stability and growth",
      "More growth potential, with larger fluctuations",
    ],
  },
  {
    title: "How familiar are you with investing?",
    options: [
      "I’m still learning the basics",
      "I have some experience",
      "I’m comfortable with market ups and downs",
    ],
  },
];
function AssessmentIntro() {
  const { s } = useStore();
  return (
    <div className="form-page">
      <Header
        eyebrow="YOUR ASSESSMENTS"
        title="Understand your investment comfort."
      >
        A starting point for a more informed conversation with your advisor.
      </Header>
      <section className="card form-card">
        <ShieldCheck className="feature-icon" size={40} />
        <Badge>{s.assessment.status}</Badge>
        <h2>Investment & Risk Assessment</h2>
        <p>
          Explore your time horizon, comfort with market changes, and investment
          experience.
        </p>
        <div className="facts">
          <span>4 questions</span>
          <span>About 4 minutes</span>
          <span>Save and return anytime</span>
        </div>
        <p className="note">
          Illustrative questions and scoring for Discovery. Results are not a
          validated risk profile or investment advice.
        </p>
        <Go
          to={
            s.assessment.status === "Completed"
              ? "/client/assessments/risk/result"
              : "/client/assessments/risk"
          }
        >
          {s.assessment.status === "Completed"
            ? "View result"
            : "Begin assessment"}
        </Go>
      </section>
    </div>
  );
}
function Assessment() {
  const { s, set } = useStore();
  const [step, next] = useState(() => {
    const firstUnanswered = s.assessment.answers.findIndex(
      (answer) => answer === undefined,
    );
    return firstUnanswered === -1 ? 0 : firstUnanswered;
  });
  const nav = useNavigate();
  if (s.assessment.status === "Completed")
    return <Navigate to="/client/assessments/risk/result" replace />;
  return (
    <div className="form-page">
      <Header
        eyebrow="INVESTMENT & RISK ASSESSMENT"
        title="Let’s start with your perspective."
      />
      <section className="card form-card">
        <p className="eyebrow">QUESTION {step + 1} OF 4</p>
        <progress
          max={4}
          value={step + 1}
          aria-label="Assessment question progress"
        />
        <h2>{questions[step].title}</h2>
        <fieldset className="choices vertical">
          <legend>Select the answer that feels closest</legend>
          {questions[step].options.map((x, i) => (
            <label key={x}>
              <input
                type="radio"
                name={`answer-${step}`}
                checked={s.assessment.answers[step] === i}
                onChange={() =>
                  set((v) => {
                    const answers = [...v.assessment.answers];
                    answers[step] = i;
                    return { ...v, assessment: { ...v.assessment, answers } };
                  })
                }
              />
              {x}
            </label>
          ))}
        </fieldset>
        <div className="form-actions">
          <Button
            className="secondary"
            onClick={() => (step ? next(step - 1) : nav("/client/assessments"))}
          >
            <ArrowLeft size={16} />
            Back
          </Button>
          <Button
            disabled={s.assessment.answers[step] === undefined}
            onClick={() => {
              if (step < 3) next(step + 1);
              else nav("/client/assessments/risk/review");
            }}
          >
            {step === 3 ? "Review answers" : "Continue"}
            <ArrowRight size={16} />
          </Button>
        </div>
      </section>
    </div>
  );
}
function AssessmentReview() {
  const { s, set } = useStore();
  const nav = useNavigate();
  if (s.assessment.status === "Completed")
    return <Navigate to="/client/assessments/risk/result" replace />;
  if (
    s.assessment.answers.length !== questions.length ||
    questions.some((_, index) => s.assessment.answers[index] === undefined)
  )
    return <Navigate to="/client/assessments/risk" replace />;
  return (
    <div className="form-page">
      <Header eyebrow="REVIEW YOUR RESPONSES" title="One last look.">
        Confirm your answers before recording this assessment.
      </Header>
      <section className="card form-card">
        <Badge>READY TO SUBMIT</Badge>
        <h2>Investment &amp; Risk Assessment</h2>
        {questions.map((question, index) => (
          <div className="review-row" key={question.title}>
            <strong>{question.title}</strong>
            <span>{question.options[s.assessment.answers[index]]}</span>
          </div>
        ))}
        <p className="note">
          This illustrative result supports a conversation with Michael. It is
          not financial advice or a suitability determination.
        </p>
        <div className="form-actions">
          <Link to="/client/assessments/risk">Edit answers</Link>
          <Button
            onClick={() => {
              set(submitAssessment(s));
              nav("/client/assessments/risk/result");
            }}
          >
            Submit assessment <Check size={17} />
          </Button>
        </div>
      </section>
    </div>
  );
}
function Result() {
  const { s } = useStore();
  if (!s.assessment.result)
    return <Navigate to="/client/assessments" replace />;
  return (
    <div className="form-page">
      <Header eyebrow="ASSESSMENT COMPLETE" title="A useful starting point.">
        Your responses add context to your next conversation with Michael.
      </Header>
      <section className="card form-card">
        <Badge>ILLUSTRATIVE RESULT</Badge>
        <h2 className="result-title">{s.assessment.result}</h2>
        <p>
          {s.assessment.result === "Cautious"
            ? "Your responses lean toward stability and limiting fluctuations."
            : s.assessment.result === "Balanced"
              ? "Your responses suggest a balance between stability and growth potential."
              : "Your responses indicate comfort with fluctuations in pursuit of longer-term growth."}
        </p>
        <p className="note">
          This demo uses a simple, unvalidated scoring rule. It is not a
          recommendation, suitability determination, or measure of retirement
          readiness.
        </p>
        <h3>Your responses</h3>
        {questions.map((q, i) => (
          <div className="review-row" key={q.title}>
            <strong>{q.title}</strong>
            <span>{q.options[s.assessment.answers[i]]}</span>
          </div>
        ))}
        <p>
          {s.exceptions.some((item) => item.sourceId === s.assessment.id)
            ? "Your responses created a review cue for Michael. No email has been sent."
            : "Your result has been recorded. No advisor follow-up was created from this illustrative result."}
        </p>
        <Go to="/client/dashboard">Return to my dashboard</Go>
      </section>
    </div>
  );
}
const articles = [
  {
    title: "What does your next chapter look like?",
    tag: "RETIREMENT LIFESTYLE",
    time: "5 min read",
    type: "Article",
    topic: "Lifestyle",
    reason: "Relevant because you are approaching retirement",
    isNew: false,
    body: "Make room to think about the everyday life you want in retirement. Consider the people, places, and activities that give your week meaning. Write down a few priorities and bring them to your next conversation with your advisor.",
  },
  {
    title: "Making the most of your planning check-in",
    tag: "PLANNING ESSENTIALS",
    time: "4 min read",
    type: "Guide",
    topic: "Planning",
    reason: "Helpful before your September Planning Update",
    isNew: false,
    body: "A useful check-in begins with what has changed. Think about work, household circumstances, and your retirement timeline. Capture your questions ahead of time so you can talk through them with your advisor.",
  },
  {
    title: "Putting investment risk into perspective",
    tag: "INVESTMENT BASICS",
    time: "6 min read",
    type: "Video",
    topic: "Investing",
    reason: "Selected from your assessment activity",
    isNew: false,
    body: "Comfort with uncertainty can change over time. Your time horizon, personal circumstances, and experience all contribute to a conversation about risk. An assessment offers context; it does not replace a discussion of your full situation.",
  },
  {
    title: "A practical introduction to required distributions",
    tag: "RETIREMENT INCOME",
    time: "7 min video",
    type: "Video",
    topic: "Income",
    reason: "For the retirement-income milestones ahead",
    isNew: true,
    body: "This short educational overview introduces required minimum distributions, why timing matters, and which questions may be useful to discuss with your advisor. Applicable rules and individual circumstances should always be confirmed before taking action.",
  },
  {
    title: "Your age 65 planning conversation",
    tag: "UPCOMING MILESTONES",
    time: "2-page one-pager",
    type: "One-pager",
    topic: "Milestones",
    reason: "Your profile includes a target retirement age of 65",
    isNew: true,
    body: "Use this one-page conversation guide to organize questions about healthcare, income, work, and the timing of retirement decisions as age 65 approaches.",
  },
  {
    title: "Five retirement facts worth revisiting",
    tag: "QUICK PERSPECTIVE",
    time: "3 min infographic",
    type: "Infographic",
    topic: "Planning",
    reason: "A quick perspective for your next chapter",
    isNew: true,
    body: "A concise visual summary of five retirement-planning ideas that often deserve another look as work, household priorities, markets, and retirement timing evolve.",
  },
];
const contentIcon = (type: string) => {
  if (type === "Video") return PlayCircle;
  if (type === "One-pager" || type === "Guide") return FileText;
  if (type === "Infographic") return ImageIcon;
  return BookOpen;
};
function ArticleCard({
  i,
  showReason = false,
  onOpen,
}: {
  i: number;
  showReason?: boolean;
  onOpen?: (index: number) => void;
}) {
  const { s } = useStore();
  const article = articles[i];
  const ContentIcon = contentIcon(article.type);
  const body = (
    <>
      <div className="article-top">
        <div className="article-icon">
          <ContentIcon size={19} />
        </div>
        <div className="content-card-labels">
          <small>{article.type.toUpperCase()}</small>
          {article.isNew && <span>NEW</span>}
        </div>
      </div>
      <div className="article-body">
        <p className="article-tag">{article.tag}</p>
        <h3>{article.title}</h3>
        {showReason && (
          <p className="recommendation-reason">
            <Sparkles size={14} />
            {article.reason}
          </p>
        )}
        <span>
          {s.read.includes(String(i)) ? "Viewed · Open again" : article.time}
          <ArrowRight size={17} />
        </span>
      </div>
    </>
  );
  if (onOpen) {
    return (
      <button
        type="button"
        className="article article-button"
        onClick={() => onOpen(i)}
      >
        {body}
      </button>
    );
  }
  return (
    <Link className="article" to={`/client/education/${i}`}>
      {body}
    </Link>
  );
}
function ResourcePane({
  index,
  onClose,
}: {
  index: number;
  onClose: () => void;
}) {
  const { s, set } = useStore();
  const article = articles[index];
  const ContentIcon = contentIcon(article.type);
  const id = String(index);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
      <aside className="library-pane library-pane-inline" aria-labelledby="library-pane-title">
        <header className="library-pane-header">
          <div>
            <p className="eyebrow">
              {article.type.toUpperCase()} · {article.topic.toUpperCase()}
            </p>
            <h2 id="library-pane-title">{article.title}</h2>
          </div>
          <button
            type="button"
            className="icon close"
            aria-label="Close"
            onClick={onClose}
          >
            <X />
          </button>
        </header>
        <div className="library-pane-media">
          {article.type === "Video" ? (
            <div className="library-media-video">
              <PlayCircle size={48} />
              <span>Sample video preview</span>
              <small>{article.time}</small>
            </div>
          ) : article.type === "Infographic" ? (
            <div className="library-media-image">
              <ImageIcon size={48} />
              <span>Sample infographic preview</span>
              <small>{article.time}</small>
            </div>
          ) : (
            <div className="library-media-doc">
              <ContentIcon size={36} />
              <span>{article.tag}</span>
              <small>{article.time}</small>
            </div>
          )}
        </div>
        <div className="library-pane-body">
          <p>{article.body}</p>
          <p className="muted">
            Sample educational copy for the prototype. Production content
            requires approval.
          </p>
          <section className="resource-next-steps">
            <h3>Continue from here</h3>
            <ul>
              <li>Note any questions that relate to your circumstances.</li>
              <li>Review the related resource for another perspective.</li>
              <li>Bring decisions or concerns to your advisor before acting.</li>
            </ul>
            <Link
              to={`/client/education/${index === 3 ? 4 : index === 4 ? 3 : 1}`}
              onClick={onClose}
            >
              View a related resource <ArrowRight size={15} />
            </Link>
          </section>
        </div>
        <footer className="library-pane-footer">
          {article.type !== "Video" && (
            <Button
              onClick={() =>
                set({ ...s, read: [...new Set([...s.read, id])] })
              }
            >
              {s.read.includes(id) ? "Marked as read" : "Mark as read"}
              <Check size={17} />
            </Button>
          )}
          <Button className="secondary" onClick={onClose}>
            Close
          </Button>
        </footer>
      </aside>
  );
}
function Education() {
  const { s } = useStore();
  const [contentType, setContentType] = useState("All");
  const [query, setQuery] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const loc = useLocation();
  const routeId = loc.pathname.split("/")[3];
  useEffect(() => {
    if (routeId !== undefined && routeId !== "" && !Number.isNaN(Number(routeId))) {
      setOpenIndex(Number(routeId));
    }
  }, [routeId]);
  const visibleArticles = articles
    .map((article, index) => ({ article, index }))
    .filter(
      ({ article }) =>
        (contentType === "All" || article.type === contentType) &&
        `${article.title} ${article.tag} ${article.topic}`
          .toLowerCase()
          .includes(query.toLowerCase()),
    );
  const unreadIndex = articles.findIndex(
    (_, index) => !s.read.includes(String(index)),
  );
  const featuredIndex = unreadIndex === -1 ? 0 : unreadIndex;
  return (
    <>
      <Header eyebrow="YOUR LEARNING LIBRARY" title="Learning library" />
      <section
        className="library-controls"
        aria-label="Filter learning resources"
      >
        <label className="library-search">
          <Search size={18} />
          <span className="sr-only">Search resources</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the library"
          />
        </label>
        <div className="library-filters" role="group" aria-label="Content type">
          {[
            "All",
            "Video",
            "Guide",
            "One-pager",
            "Infographic",
            "Article",
          ].map((type) => (
            <button
              type="button"
              className={contentType === type ? "active" : ""}
              onClick={() => setContentType(type)}
              key={type}
            >
              {type}
            </button>
          ))}
        </div>
      </section>
      <div className="library-browser">
        <section className="library-list" aria-label="Learning resources">
          <div className="library-list-heading">
            <strong>{visibleArticles.length} resources</strong>
            <span>Select an item to preview</span>
          </div>
          {visibleArticles.map(({ article, index }) => {
            const ContentIcon = contentIcon(article.type);
            const selected = openIndex === index;
            return (
              <button
                key={index}
                type="button"
                className={`library-list-item ${selected ? "selected" : ""}`}
                aria-pressed={selected}
                onClick={() => setOpenIndex(index)}
              >
                <span className="library-list-icon"><ContentIcon size={19} /></span>
                <span className="library-list-copy">
                  <span className="library-list-meta">{article.type} · {article.topic}</span>
                  <strong>{article.title}</strong>
                  <small>{article.reason}</small>
                </span>
                <span className="library-list-time">
                  {s.read.includes(String(index)) ? "Viewed" : article.time}
                  <ChevronRight size={17} />
                </span>
              </button>
            );
          })}
          {!visibleArticles.length && (
            <div className="library-list-empty">
              <Lightbulb />
              <strong>No matching resources</strong>
              <span>Try another content type or search term.</span>
            </div>
          )}
        </section>
        {openIndex !== null ? (
          <ResourcePane index={openIndex} onClose={() => setOpenIndex(null)} />
        ) : (
          <aside className="library-preview-empty">
            <BookOpen size={34} />
            <h2>Choose a resource</h2>
            <p>Select an item from the list to view its content here.</p>
            <button type="button" onClick={() => setOpenIndex(featuredIndex)}>
              Open recommended resource <ArrowRight size={16} />
            </button>
          </aside>
        )}
      </div>
    </>
  );
}
function Progress() {
  const { s, set } = useStore();
  return (
    <>
      <Header
        eyebrow="YOUR PLANNING JOURNEY"
        title="Small steps, visible progress."
      />
      <section className="card form-card progress-overview">
        <div
          className="status-ring"
          role="progressbar"
          aria-valuenow={progress(s)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Activities complete"
          style={{ "--ring-value": progress(s) } as React.CSSProperties}
        >
          <div className="status-ring-inner">
            <strong>{progress(s)}%</strong>
            <span>Complete</span>
          </div>
        </div>
        <div>
          <h2>{progress(s)}% of current activities complete</h2>
          <p>
            Profile, Planning Update, and assessment completion. This does not
            measure retirement readiness.
          </p>
        </div>
      </section>
      <section className="journey-status-grid" aria-label="Current planning status">
        <article className="card journey-status-card">
          <p className="eyebrow">COMPLETED</p>
          {[
            s.profileComplete && "Profile",
            s.planning.status === "Completed" && "Planning Update",
            s.assessment.status === "Completed" && "Investment & Risk Assessment",
          ]
            .filter(Boolean)
            .map((item) => (
              <span key={String(item)}><CheckCircle2 size={16}/>{item}</span>
            ))}
          {!progress(s) && <p>No current activities completed yet.</p>}
        </article>
        <article className="card journey-status-card">
          <p className="eyebrow">IN PROGRESS</p>
          {!s.profileComplete && <Link to="/onboarding/profile">Complete profile <ArrowRight size={14}/></Link>}
          {s.planning.status !== "Completed" && <Link to="/client/planning-update">September Planning Update <ArrowRight size={14}/></Link>}
          {s.assessment.status !== "Completed" && <Link to="/client/assessments">Investment &amp; Risk Assessment <ArrowRight size={14}/></Link>}
          {progress(s) === 100 && <p>No current activities outstanding.</p>}
        </article>
        <article className="card journey-status-card">
          <p className="eyebrow">UPCOMING</p>
          <Link to="/client/milestones/age-65">Age 65 planning conversation <ArrowRight size={14}/></Link>
          <span><CalendarDays size={16}/>Next quarterly check-in · December 2026</span>
        </article>
      </section>
      <section className="card form-card">
        <h3>Activity history</h3>
        {s.history.length ? (
          s.history.map((h) => (
            <div className="review-row" key={h.id}>
              <CheckCircle2 />
              <strong>{h.title}</strong>
              <span>{new Date(h.date).toLocaleDateString()}</span>
            </div>
          ))
        ) : (
          <p>Your completed activities will appear here.</p>
        )}
        <h3>Advisor follow-up</h3>
        <p>
          {s.exceptions.length
            ? `${s.exceptions.length} items recorded for advisor review.`
            : "No review items recorded yet."}
        </p>
        <details>
          <summary>Prototype controls</summary>
          <p>
            Restart with the fictional Sarah Smith profile and no completed
            activities.
          </p>
          <Button
            className="secondary"
            onClick={() => {
              if (window.confirm("Reset all demo progress on this device?"))
                set(initialState());
            }}
          >
            Reset demo progress
          </Button>
        </details>
      </section>
    </>
  );
}
function Messages() {
  const { s } = useStore();
  return (
    <>
      <Header eyebrow="NOTIFICATIONS" title="The latest on your planning." />
      <section className="notification-stack">
        <article className="card notification-card">
          <div className="notification-icon"><ClipboardList /></div>
          <div><Badge>PLANNING REMINDER</Badge><h2>September Planning Update</h2><p>{s.planning.status === "Completed" ? "Completed · this reminder has stopped." : "Due September 30, 2026 · confirm what is current and share anything new."}</p></div>
          <Link to="/client/planning-update">View <ArrowRight size={15}/></Link>
        </article>
        <article className="card notification-card">
          <div className="notification-icon"><Target /></div>
          <div><Badge>UPCOMING MILESTONE</Badge><h2>Your age 65 planning conversation</h2><p>A useful point to review healthcare, income, work, and retirement timing with your advisor.</p></div>
          <Link to="/client/milestones/age-65">View milestone <ArrowRight size={15}/></Link>
        </article>
        <article className="card notification-card">
          <div className="notification-icon"><PlayCircle /></div>
          <div><Badge>RECOMMENDED FOR YOU</Badge><h2>A practical introduction to required distributions</h2><p>Added to your library because retirement-income milestones are part of your next chapter.</p></div>
          <Link to="/client/education/3">Watch video <ArrowRight size={15}/></Link>
        </article>
        <article className="card notification-card">
          <div className="notification-icon"><ShieldCheck /></div>
          <div><Badge>ASSESSMENT</Badge><h2>Investment & Risk Assessment</h2><p>{s.assessment.status === "Completed" ? "Completed · your result is available for review." : "Available to complete · about four minutes."}</p></div>
          <Link to="/client/assessments">View <ArrowRight size={15}/></Link>
        </article>
      </section>
      {(s.planning.status === "Completed" || s.assessment.status === "Completed") && (
        <details className="card notification-history">
          <summary>Completed reminders</summary>
          {s.planning.status === "Completed" && <p><CheckCircle2 size={16}/> September Planning Update reminder completed</p>}
          {s.assessment.status === "Completed" && <p><CheckCircle2 size={16}/> Investment &amp; Risk Assessment reminder completed</p>}
        </details>
      )}
      <section className="card notification-note"><p>These are in-app prototype reminders. Email and SMS delivery, reminder preferences, and production milestone rules are not connected.</p></section>
    </>
  );
}
function Benchmark() {
  return (
    <div className="form-page">
      <Header
        eyebrow="BENCHMARK CONTEXT"
        title="Perspective, with the right context."
      />
      <section className="card form-card">
        <ChartNoAxesCombined size={36} />
        <Badge>ILLUSTRATIVE LAYOUT</Badge>
        <h2>How a household comparison could appear</h2>
        <p>
          This static example shows the information a client would receive once
          the measure, source, cohort, and household inputs are approved.
        </p>
        <div className="benchmark-example" aria-label="Illustrative benchmark structure">
          <div><span>Measure</span><strong>Household net worth</strong></div>
          <div><span>Your household</span><strong>Validated value required</strong></div>
          <div><span>Similar-age median</span><strong>Validated value required</strong></div>
          <div><span>Context</span><strong>Age cohort, source year, and definitions</strong></div>
        </div>
        <p className="note">
          No value, ranking, or retirement-readiness score has been calculated.
          Production presentation must name the source, data year, cohort, and
          methodology.
        </p>
        <Go to="/client/dashboard">Back to dashboard</Go>
      </section>
    </div>
  );
}
function Age65Milestone() {
  return (
    <div className="form-page milestone-page">
      <Header eyebrow="UPCOMING MILESTONE" title="Your age 65 planning conversation.">
        A focused place to understand what may deserve attention and prepare
        questions for Michael.
      </Header>
      <section className="card form-card">
        <Badge>PERSONAL MILESTONE</Badge>
        <h2>Why this matters</h2>
        <p>
          Around age 65, healthcare coverage, work decisions, retirement timing,
          and income planning may begin to overlap. The right timing depends on
          your circumstances.
        </p>
        <h3>What to review</h3>
        <ul className="milestone-checklist">
          <li><CheckCircle2 size={17}/>Your expected retirement and work timeline</li>
          <li><CheckCircle2 size={17}/>Current and future healthcare coverage</li>
          <li><CheckCircle2 size={17}/>Income sources and decisions approaching</li>
          <li><CheckCircle2 size={17}/>Questions you want to discuss with Michael</li>
        </ul>
        <h3>Recommended next steps</h3>
        <div className="milestone-actions">
          <Go to="/client/education/4">Open age 65 one-pager</Go>
          <Go to="/client/education/3" secondary>Watch retirement-income video</Go>
          <a className="button secondary" href={`mailto:${advisor.email}`}>Email Michael</a>
        </div>
        <p className="note">
          This is educational planning context, not advice about Medicare,
          benefits, taxes, or a specific financial decision.
        </p>
      </section>
    </div>
  );
}
function App() {
  const [s, set] = useState<State>(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("retirementtrack-demo-v1") || "null",
      );
      return saved?.version === 1 ? saved : initialState();
    } catch {
      return initialState();
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem("retirementtrack-demo-v1", JSON.stringify(s));
    } catch {
      /* Session remains usable if storage is unavailable. */
    }
  }, [s]);
  const current = useRef(s);
  current.current = s;
  useEffect(() => registerProgressReader(() => current.current), []);
  return (
    <Context.Provider value={{ s, set }}>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/login" element={<Auth />} />
          <Route path="/activate" element={<Auth activate />} />
          <Route path="/onboarding/profile" element={<Profile />} />
          <Route path="/client/*" element={<Shell />} />
          <Route path="/admin/*" element={<FirmAdministration />} />
          <Route path="/advisor/*" element={<AdvisorWorkspace />} />
          <Route path="/platform/*" element={<PlatformWorkspace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </Context.Provider>
  );
}
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
