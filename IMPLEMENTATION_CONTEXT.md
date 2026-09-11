# RetirementTrack Prototype — Implementation Context

## Product intent

RetirementTrack is a Harbor Wealth retirement-planning experience designed around **Calm Financial Confidence**. It helps clients understand what is current, what deserves attention, what is approaching, and when their advisor should become involved.

The Discovery prototype covers four connected experiences:

1. Client experience
2. Advisor workspace
3. Firm administration
4. Platform administration

It demonstrates product flows and realistic state changes. It is not a production financial, identity, messaging, or tenant-management system.

## Technology

- React 19
- TypeScript
- Vite
- React Router
- Lucide React icons
- CSS design tokens and reusable component styles
- Browser `localStorage` for persistent demonstration state

Run locally:

```bash
npm install
npm run dev
```

Validation commands:

```bash
npm run build
npm test
```

## Entry points

| Experience | Entry route | Purpose |
| --- | --- | --- |
| Login | `/login` | Demo sign-in and links to each role preview |
| Account activation | `/activate` | Invitation acceptance and demo consent |
| Client | `/client/dashboard` | Client planning, education, milestones, and progress |
| Advisor | `/advisor/dashboard` | Exception-led client review and follow-up |
| Firm administrator | `/admin/overview` | Firm configuration and governance |
| Platform administrator | `/platform/dashboard` | Tenant setup, defaults, lifecycle, and oversight |

Unknown routes redirect to the appropriate dashboard or login.

## Shared visual system

The interface uses a cool, restrained financial-services palette defined in `src/theme.css`. All significant colors are semantic variables so the theme can be changed centrally.

Current direction:

- Dark slate-blue navigation for trust and stability
- Mid-blue primary actions
- Light blue panels and selected states
- Cool blue-gray page canvas
- White cards with subtle blue-gray borders
- Dark blue-gray text with muted secondary copy
- Visible keyboard focus indicators

The prototype uses a sans-serif type system, rounded cards, consistent spacing, restrained shadows, and responsive layouts. Primary actions remain visually clear without making every surface bright blue.

## Shared client domain model

`src/domain.ts` contains the client demo state and state transitions.

The sample relationship is tenant-scoped:

- Firm tenant: Harbor Wealth
- Client: Sarah Smith
- Primary advisor: Michael Carter, CFP®
- Household context: married/partnered, with James recorded as partner

The state contains:

- Account activation and consent status
- Minimum client profile
- Prior and draft planning snapshots
- Versioned Planning Update assignment and completion state
- Versioned assessment answers and result
- Advisor exceptions linked to their source activity
- Client activity history
- Read educational-resource IDs

Client state is stored under `retirementtrack-demo-v1`. Passwords are not stored.

### State transitions

Submitting a Planning Update compares the new answers with the prior snapshot. Changed fields create a source-linked advisor exception; an unchanged submission creates no exception. The submission also updates the profile retirement age, activity history, and dashboard completion state.

Submitting the four-question Investment & Risk Assessment creates a demonstration result of Cautious, Balanced, or Growth-oriented. Completion creates an advisor review cue and updates the client dashboard and history.

The dashboard completion percentage measures three activities only:

1. Profile
2. Planning Update
3. Assessment

It is explicitly not a retirement-readiness score.

## Client experience

### Authentication and onboarding

Routes:

- `/login`
- `/activate`
- `/onboarding/profile`

The login page presents the RetirementTrack value proposition and a professional sign-in card. It supports demo navigation only. Account activation records invitation acceptance and the demo notice, then the minimum-profile flow captures enough information to personalize the experience.

No real authentication, password recovery, identity verification, or invitation delivery is implemented.

### Dashboard

Route: `/client/dashboard`

The dashboard provides:

- Personalized greeting and retirement stage
- Profile and planning activity completion
- Clear next actions
- Planning Update due/completed state
- Assessment available/completed state
- Advisor contact by email or phone
- Upcoming check-ins and retirement milestones
- Personalized educational recommendations
- “New for you” and “Continue exploring” return-engagement states
- Recent progress and activity cues after completion

The dashboard is intentionally action-oriented and avoids presenting dense financial figures.

### Planning Update

Routes:

- `/client/planning-update`
- `/client/planning-update/review`

The client confirms or updates:

- Target retirement age
- Employment status
- Household changes
- Anything currently on their mind

Previously shared values are shown for context. The review screen summarizes changes before submission. Submission changes the returning dashboard and can feed the advisor exception queue.

### Assessment

Routes:

- `/client/assessments`
- `/client/assessments/risk`
- `/client/assessments/risk/result`

The flow introduces the Investment & Risk Assessment, captures four answers, calculates a demonstration result, and presents a client-friendly explanation. The result is a conversation aid rather than financial advice or a final investment recommendation.

### Learning Library

Routes:

- `/client/education`
- `/client/education/:id`

The library anticipates education as a substantial long-term engagement channel. It currently includes representative videos, guides, one-pagers, infographics, and articles. Clients can search and filter by resource format.

Dashboard recommendations explain why a resource is relevant using known context such as age, retirement stage, current activities, or upcoming milestones. Opening a resource and marking it as read changes the dashboard to a “Continue exploring” state.

The current resources are illustrative and require editorial and compliance approval before production use.

### Progress, reminders, and supporting views

Routes:

- `/client/progress`
- `/client/messages`
- `/client/benchmarking`
- `/client/profile`

The progress view shows completed activities and includes prototype reset controls. Notifications combine incomplete activity reminders, milestone prompts, and relevant education. Benchmarking remains intentionally unavailable until its methodology and source data are validated. The profile view exposes the minimum personalization fields.

## Advisor workspace

Routes:

- `/advisor/dashboard`
- `/advisor/attention`
- `/advisor/planning`
- `/advisor/assessments`
- `/advisor/follow-ups`
- `/advisor/communications`
- `/advisor/activity`
- `/advisor/clients`

The advisor experience is exception-led. It prioritizes clients requiring a decision or conversation instead of treating every completed activity as a task.

Implemented capabilities:

- Needs-attention queue with reason and priority
- Planning Update queue
- Assessment review queue
- Focused follow-up queue
- Communication approval demonstration
- Recent client activity
- Assigned-client list
- Resolve and restore demo queue actions
- Refresh of Sarah’s current client prototype state

The advisor workspace reads Sarah’s client state from `retirementtrack-demo-v1`, so client Planning Update and Assessment completion can appear in advisor views. Advisor-only demo actions are stored under `retirementtrack-advisor-v1`.

No message is actually sent. Client access and the displayed client count are illustrative.

## Firm administration

Routes:

- `/admin/overview`
- `/admin/branding`
- `/admin/users`
- `/admin/features`
- `/admin/communications`
- `/admin/content`
- `/admin/governance`

Implemented capabilities:

- Administration overview
- Basic firm name, display name, and controlled accent
- Firm administrator and advisor list
- Demo user invitation state
- Feature controls for planning, assessments, education, benchmarking, and reminders
- Communication modes: Automatic, Advisor approval, or Off
- Content-category availability
- Advisor visibility defaults
- Client contact-mode defaults

Firm settings are stored under `retirementtrack-firm-admin-v1`.

Brand changes do not currently compile a new production theme, and firm feature settings do not dynamically reconfigure the separate client demo. These screens demonstrate the expected administration model and decision points.

## Platform administrator experience

Routes:

- `/platform/dashboard`
- `/platform/tenants`
- `/platform/create`
- `/platform/defaults`
- `/platform/oversight`

The implemented tenant lifecycle is:

1. Create tenant
2. Establish tenant status
3. Establish the initial firm administrator
4. Apply platform defaults and content
5. Allow firm self-configuration
6. Maintain platform operational oversight

Implemented capabilities:

- Tenant overview and lifecycle counts
- Create a demonstration firm tenant
- Draft, active, and suspended tenant states
- Activate, suspend, and reactivate actions
- Baseline feature and content defaults
- Apply defaults to pending tenants
- Tenant-level setup and operating-health view

Platform state is stored under `retirementtrack-platform-v1`.

The platform experience deliberately avoids routine access to client profiles, financial information, or assessment answers. Exceptional support access and audit rules remain future policy decisions.

## Accessibility and interaction behavior

The prototype includes:

- Semantic forms and native controls
- Keyboard-accessible links and buttons
- Visible focus outlines
- Skip links for major workspaces
- Focused page headings after route changes
- Required-field validation
- Clear selected, hover, active, and disabled states
- Dialog keyboard behavior
- Reduced-motion support
- Responsive desktop, tablet, and mobile layouts

A formal browser-based accessibility audit has not yet been completed.

## Prototype boundaries

The following are intentionally outside the implemented prototype:

- Production authentication and authorization
- Backend services and databases
- Real tenant isolation or permission enforcement
- Calendar and scheduling integration
- SMS, email delivery, or production messaging
- Financial account aggregation
- Production APIs
- Production assessment methodology
- Validated benchmarking
- Full content-management and publishing workflow
- Compliance approval and audit controls

Advisor contact remains conservative: email and telephone contact only. Scheduling should not be added until separately confirmed.

## Key files

| File | Responsibility |
| --- | --- |
| `src/main.tsx` | Login, activation, client shell, client routes, and client UI |
| `src/domain.ts` | Shared client state, change detection, assessment result, and progress logic |
| `src/domain.test.ts` | Domain transition tests |
| `src/advisor.tsx` | Advisor workspace and exception workflow |
| `src/admin.tsx` | Firm administration workflow |
| `src/platform.tsx` | Platform tenant-management workflow |
| `src/styles.css` | Base application and role-specific layout styles |
| `src/theme.css` | Shared semantic color tokens and final theme overrides |
| `src/webmcp.ts` | Optional feature-detected prototype progress reader |

## Recommended next decisions

Before production development, confirm:

- Which reminders and milestones belong in the MVP
- Content ownership, review, compliance, publishing, and personalization rules
- What creates an advisor exception and how it is resolved
- Communication consent, channels, sender identity, and retention
- Advisor-to-client and household assignment rules
- Firm and platform authorization boundaries
- Assessment ownership, scoring, versioning, and result language
- Benchmark definitions, methodology, data sources, and disclaimers
- Accessibility audit and supported browser requirements

