# RetirementTrack — Client UX Workflow &amp; Design System

This document is the UI/UX specification for the **client-facing** experience of RetirementTrack (Harbor Wealth). It complements [`IMPLEMENTATION_CONTEXT.md`](./IMPLEMENTATION_CONTEXT.md) (which covers product intent, routes, and state behavior for all four roles) by focusing specifically on the **visual design system and end‑to‑end client workflow**: login → onboarding → dashboard → every related page.

It reflects the implementation in `src/main.tsx`, `src/styles.css`, and `src/theme.css`.

---

## 1. Design theme: "Calm Financial Confidence"

Retirement planning is emotional as much as it is financial. The interface should feel like a **trusted advisor's office, not a trading terminal**: warm competence, unhurried pacing, and total clarity about what needs attention right now versus what can wait.

Three design principles drive every screen:

1. **Calm before density.** Never show a client a wall of numbers. Every page leads with a plain-language sentence, then progressively reveals detail.
2. **Action over status.** Cards say what to *do* ("Start Planning Update"), not just what *is* ("Planning Update: Pending").
3. **Always know the next step.** A visible progress indicator and a "what's coming next" panel appear on nearly every screen so the client never feels lost in a multi-step journey.

### 1.1 Color palette (calming, trustworthy)

Defined as semantic tokens in `src/theme.css` so the palette can be retargeted without touching components. **v3 update:** deepened and enriched from the original, paler sky-blue set — moved toward a private-banking navy for more visual weight and confidence, while staying in the same blue family.

| Token | Hex | Usage |
| --- | --- | --- |
| `--brand-navy-deep` | `#14304A` | Headings, deep accents |
| `--brand-primary` | `#1F4E79` | Primary actions, links, focus |
| `--brand-primary-strong` | `#123350` | Hover/active states, sidebar text on light |
| `--brand-primary-soft` | `#DCE7F1` | Selected states, soft panels |
| `--brand-accent` | `#4F82AF` | Secondary highlights, icons |
| `--brand-gold` | `#A9812F` | Reserved milestone/achievement accent (used sparingly) |
| `--brand-ink` | `#122740` | Primary text |
| `--brand-muted` | `#526B84` | Secondary text |
| `--brand-border` | `#C2D4E2` | Card and input borders |
| `--brand-canvas` | `#F2F6FA` | Page background |
| `--brand-surface` | `#FFFFFF` | Card/panel background |
| `--brand-success` | `#276B5A` | Completed states |
| `--brand-warning` | `#8C6220` | Due-soon / attention states |
| `--brand-danger` | `#A23A32` | Errors, overdue |

Deep, richer blues dominate (trust, calm, stability, gravitas); gold is a rare accent for milestones/achievements only, never for errors or routine UI — this keeps "attention" cues meaningful rather than noisy.

### 1.2 Typography

**Google Font: Nunito Sans** (400 / 500 / 600 / 700), loaded via `index.html` and set as the single `--font-family-base` for the entire application (client, advisor, admin, platform all inherit from `body`). Nunito Sans' rounded, warm letterforms read as approachable and calm while staying highly legible at both small (12px table/label) and large (44px hero) sizes, and its wide weight range keeps the product accessible.

A single type scale (see §3) is applied everywhere: page titles, section headings, card titles, body copy, buttons, form labels, navigation, tables, and captions. No page defines its own one-off font size — every size is a token.

### 1.3 Spacing, radius, and containers

A 4px‑based spacing scale, a 3‑step radius scale, and one shared max content width keep every card, form, and page edge visually related instead of arbitrary (see §3.2–3.4).

---

## 2. End‑to‑end client workflow

```
/login  or  /activate
      │
      ▼
/onboarding/profile  (first-time only)
      │
      ▼
/client/dashboard  ───────────────┬──────────────┬───────────────┬───────────────┐
      │                           │              │               │               │
      ▼                           ▼              ▼               ▼               ▼
/client/planning-update   /client/assessments  /client/education  /client/messages  /client/profile
      │                           │                                   
      ▼                           ▼                                   
/…/review                 /…/risk → /…/result

/client/progress  ·  /client/benchmarking  ·  Contact-advisor dialog (available from every screen)
```

Every authenticated screen shares the same shell: a persistent left **sidebar** (brand, primary navigation, advisor mini-card, "Contact Advisor") and a **topbar** (breadcrumb, notifications icon, profile avatar). Only `/login`, `/activate`, and the first-run `/onboarding/profile` render outside the shell, using a focused two-pane "auth" layout instead.

### 2.1 Login & authentication — `/login`

**Purpose:** Reassure a returning client and get them into their plan in one action.

**Layout:** Two-pane split.
- **Left pane (brand panel, `--brand-primary` background):** Compass logomark, eyebrow "WELCOME TO RETIREMENTTRACK", a short emotional headline ("A clearer view of what's ahead."), one supporting sentence, and a thin divider rule above "PERSONAL GUIDANCE. EVERY STEP." This pane exists purely to set tone — no functional controls.
- **Right pane (white card, centered):** Brand mark, a "demo" pill (prototype-only affordance), page heading "Welcome back.", and a two-field form: email, password (both pre-filled for demo purposes), a primary "Sign in" button with an arrow icon, and a muted note clarifying no password is stored.
- **Footer link:** "Have an invitation? Activate your account" → `/activate`.

**States:** default, focused input (visible focus ring using `--brand-focus`), disabled submit while incomplete (native required validation), and a demo-only privacy note in place of real error/lockout states.

### 2.2 Account activation — `/activate`

Same two-pane shell as login, but the copy reframes the moment as an invitation: eyebrow "INVITED BY HARBOR WEALTH", headline "Your next chapter starts here.", and body copy naming the advisor who invited them (Michael Carter). The form adds:
- "Create a password" instead of "Demo password".
- A required consent checkbox acknowledging the prototype/demo nature of the data.

Successful submission routes to `/onboarding/profile` — activation never drops a client directly into the dashboard, because the app has no personalization yet to show them.

### 2.3 Onboarding / welcome flow — `/onboarding/profile`

**Purpose:** Capture the minimum information needed to personalize the dashboard, framed as a single short step rather than a multi-page wizard.

**Layout:** Centered form page (no sidebar yet — the client hasn't "arrived" in the product). Eyebrow "GETTING TO KNOW YOU · STEP 1 OF 1", headline "A few details. A more personal experience.", one supporting sentence.

**Form (two-column grid on desktop, one column on mobile):**
- Preferred name
- Date of birth
- Life stage (Approaching retirement / Building toward retirement / Already retired)
- Target retirement age
- Household relationship (Married / partnered, Single, Prefer not to say)
- Conditional: partner's first name, shown only when "Married / partnered" is selected — a small progressive-disclosure touch that avoids asking irrelevant questions.

A reassurance note ("Household context helps personalize your planning. It does not grant access to another person's account.") sits above the actions. Two exits: "Do this later" (skips to dashboard with profile incomplete) and "Go to my dashboard" (primary, saves and completes the profile). Onboarding is explicitly **skippable** — the dashboard's "What deserves your attention" list simply keeps a "Complete profile" card visible until it's finished, so nothing blocks a client from exploring.

### 2.4 Main dashboard — `/client/dashboard`

**Purpose:** One glance answers five feelings, not just three questions — *I understand where I am. I know what I should do next. I can easily understand my plan. My advisor is helping me. I feel confident about my future.* The redesign (v2) reorganizes the same content/data into an information hierarchy built explicitly around those outcomes, rather than a flat stack of equal-weight cards.

**Structure, top to bottom:**

1. **Heading row:** Personalized greeting ("Good morning, Sarah." → "Welcome back, Sarah." once any activity is complete) + eyebrow "YOUR NEXT CHAPTER, ONE STEP AT A TIME" + today's date, right-aligned. *(Answers "where am I", orientation.)*
2. **Hero status panel** (`.hero-status`, full-width, soft-blue card): life-stage badge, an encouraging headline ("Your future is taking shape."), and a link into the full progress view on the left; on the right, a **circular completion ring** (`.status-ring`, an accessible `role="progressbar"` built with `conic-gradient`, replacing the old linear bar) showing the same "`n` of 3 activities complete" figure at a glance, paired with the existing three-dot step tracker (Profile → Planning Update → Assessment). Still explicitly labeled *"Activity completion, not a retirement‑readiness score."* The ring is reused verbatim on the Planning Journey page (`/client/progress`) so the "where am I" visual language is consistent everywhere progress is shown. *(Answers "where am I".)*
3. **Advisor spotlight banner** (`.advisor-spotlight`, full-width, promoted out of the sidebar/right-rail and placed right under the hero): advisor photo/initials, name & credentials, firm, the same reassurance line ("Questions, changes, or just a little perspective."), and a "Contact Advisor" action — always visible, never buried. *(Answers "my advisor is helping me".)*
4. **"What deserves your attention"** — no longer an equal 3-up grid. The single highest-priority open activity (Profile → Planning Update → Assessment, in that order) renders as one large **featured card** (`.attention-item.featured`); any other open activities and already-completed activities render as a compact secondary list (`.attention-item.compact` / `.attention-item.done`) beside it, so there is always exactly one obvious next action instead of three competing ones. When every activity is complete, the featured slot disappears and only the compact "done" confirmations remain. *(Answers "what should I do next".)*
5. **"Selected for your next chapter"** — two personalized education cards with a `recommendation-reason` line explaining *why* each was chosen (age, stage, upcoming milestone), plus a "View library" link.
6. **"New for you" / "Continue exploring" return-engagement strip** — a single highlighted row encouraging the client to come back to unfinished or new content; text adapts based on read history.
7. **Right column (desktop only, becomes stacked content on mobile):**
   - **"What's coming next" timeline** — upcoming check-in, retirement-horizon target age (linking to profile), and the next personal milestone (e.g., "Prepare for your age 65 conversation"), now with a continuous connecting line through the timeline dots. *(Answers "I can easily understand my plan".)*
   - **Benchmark teaser card** — intentionally states comparison data isn't available yet rather than showing a fabricated number.

**Notification affordances on every page (topbar):** a message icon linking to `/client/messages`, and an avatar linking to `/client/profile`.

**Sidebar (every client page):** below the brand, a persistent **profile chip** (`.sidebar-profile`) shows the client's own name and life stage for constant orientation; navigation icons sit in rounded tiles (`.nav-icon`) for a more tactile, premium feel; the advisor mini-card and "Contact Advisor" button are grouped into one bordered card (`.sidebar-advisor-card`) at the bottom instead of floating loosely.

All of the above is a **visual/structural reorganization of existing copy and data only** — no new text, fields, routes, or features were introduced; every string, link destination, and conditional matches the pre-redesign behavior exactly.

### 2.5 Notifications / alerts — `/client/messages`

**Purpose:** One place for everything time-sensitive, without needing email/SMS.

**Layout:** Page heading "The latest on your planning." followed by a vertical stack of notification cards, each a horizontal row: icon chip, badge (category: PLANNING REMINDER / UPCOMING MILESTONE / RECOMMENDED FOR YOU / ASSESSMENT), a one-line title, a one-sentence explanation whose copy reacts to actual state (e.g., "Completed · this reminder has stopped." once the Planning Update is done), and a right-aligned action link.

A closing note card clarifies these are **in-app** reminders only — no email/SMS delivery is implied, keeping expectations honest. The same message icon persists in the topbar on every authenticated page so alerts are never more than one click away.

### 2.6 Settings & profile management — `/client/profile`

**Purpose:** Let the client see and correct the handful of fields that personalize their experience — deliberately not a sprawling "Settings" page, because this prototype's personalization surface is small by design.

**Layout:** Same form-page pattern as onboarding, but framed as editable: eyebrow "YOUR INFORMATION", headline "Your profile", reusing the identical field set (name, DOB, life stage, target retirement age, household relationship, partner name). Actions are "Cancel" (returns to dashboard) and "Save profile" (primary). Because it's the same component as onboarding (`<Profile edit />`), the client learns the pattern once and reuses it everywhere the app asks about them — a deliberate consistency choice.

*Note:* production settings (notification channel preferences, communication consent, security/password management) are named as open decisions in `IMPLEMENTATION_CONTEXT.md` and are out of scope for this prototype; the profile page is intentionally the seed of a future "Settings" area rather than a stand‑in for it.

### 2.7 Additional relevant pages

- **Planning Update — `/client/planning-update` → `/client/planning-update/review`.** A short stepper flow (target retirement age → employment status → household changes → "anything on your mind"), each step showing the client's *previously shared* answer for context before asking them to confirm or change it. The review screen summarizes every change before submission; unchanged answers create no advisor follow-up, changed ones do — the UI marks changed rows so the client understands what they're sending forward.
- **Assessments — `/client/assessments` → `/…/risk` → `/…/risk/result`.** An intro page frames the *why* (understanding investment comfort) before the four-question flow; the result page presents a friendly labeled outcome (Cautious / Balanced / Growth‑oriented) as a **conversation starter with the advisor**, not a financial recommendation — copy and hierarchy repeatedly reinforce this boundary.
- **Learning Library — `/client/education` and `/client/education/:id`.** A searchable, filterable grid of articles/videos/guides/infographics with format-based filter pills, a running "showing n of m" summary, and per-card recommendation reasoning on the dashboard. Reading an item marks it read and feeds the dashboard's "Continue exploring" state, rewarding engagement without gamifying it.
- **My Progress — `/client/progress`.** A plain-language recap of the same 3-activity completion measure, a history list of completed activities with dates, an advisor-follow-up count, and (clearly labeled) prototype-only reset controls tucked inside a `<details>` disclosure so they never look like a real user-facing feature.
- **Benchmarking — `/client/benchmarking`.** Deliberately shows an honest "not available yet" state explaining *why* (no validated methodology or data), rather than a placeholder chart — protecting client trust by never fabricating a comparison.
- **Contact Advisor — modal, available from the sidebar on every page.** Advisor name/credentials/firm, and both email and phone as `mailto:`/`tel:` links; copy clarifies no message is actually sent in the prototype. Kept conservative on purpose — no scheduling/calendar promise until that's product-confirmed.
- **Sign out.** A persistent footer link ("Demo data only · Sign out") on every client page returns to `/login`.

---

## 3. Shared UI system (implemented as CSS design tokens)

All tokens live in `src/styles.css` (`:root`) and are consumed by `src/theme.css` and the base stylesheet; the advisor/admin/platform experiences inherit the same font and container scale automatically because they share `body`.

### 3.1 Typography scale

| Token | Value | Used for |
| --- | --- | --- |
| `--font-family-base` | `"Nunito Sans", "Segoe UI", system-ui, Arial, sans-serif` | Every element in the app |
| `--fs-hero` | `clamp(2.375rem, 4vw, 3.75rem)` (38–60px) | Login/activation marketing headline |
| `--fs-h1` | `clamp(2rem, 3vw, 2.75rem)` (32–44px) | Page titles (`<h1>` in every `Header`) |
| `--fs-h2` | `1.5rem` (24px) | Section headings ("What deserves your attention") |
| `--fs-h3` | `1.125rem` (18px) | Card titles |
| `--fs-body` | `1rem` (16px) | Ledes, long-form copy, form paragraph text |
| `--fs-body-sm` | `0.875rem` (14px) | Buttons, nav links, form fields, table rows |
| `--fs-small` | `0.75rem` (12px) | Eyebrows, captions, meta text, badges |
| `--fs-micro` | `0.6875rem` (11px) | Timestamps, fine print |
| `--lh-heading` | `1.2` | All headings |
| `--lh-body` | `1.6` | All body/paragraph text |

Font weights: 400 (body), 500 (labels/nav/emphasis), 600 (secondary emphasis on role headers and stat numbers), 700 (headings/buttons/badges). Only these four weights are loaded, keeping the type system deliberately small.

### 3.2 Spacing scale (4px base unit)

| Token | Value |
| --- | --- |
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-5` | 20px |
| `--space-6` | 24px |
| `--space-7` | 32px |
| `--space-8` | 40px |
| `--space-9` | 48px |

Card interiors use `--space-6` (24px) by default, `--space-7` (32px) for hero/form cards. Page gutters use `--space-8` (40px) on desktop, collapsing to `--space-5`–`--space-4` on tablet/mobile.

### 3.3 Radius scale

| Token | Value | Used for |
| --- | --- | --- |
| `--radius-sm` | 8px | Icon chips, pills, buttons, inputs |
| `--radius-md` | 12px | Standard cards (attention tiles, form cards, articles, notification rows) |
| `--radius-lg` | 16px | Hero/journey panel, login card |
| `--radius-pill` | 999px | Badges, filter chips |

### 3.4 Layout & containers

| Token | Value | Used for |
| --- | --- | --- |
| `--container-max` | 1280px | Max width of `main` content across client, advisor, admin, and platform workspaces |
| `--sidebar-width` | 272px | Client sidebar (76px collapsed) |
| `--content-padding-x` | 40px desktop / 24px tablet / 16px mobile | Horizontal page padding |

A single shared container width means a client's dashboard and an advisor's or administrator's workspace align to the same visual rhythm — the whole product feels like one system, not four separate builds.

### 3.5 Components covered by the scale

Every one of the following consumes the tokens above rather than a one-off value: page `<h1>`–`<h3>`, body/lede paragraphs, `.button` (primary/secondary/disabled), `.field` labels and inputs, sidebar and topbar navigation links, cards (`.card`, `.form-card`, `.attention-item` (featured/compact/done), `.article`, `.notification-card`, `.advisor-spotlight`, `.next`), the `.status-ring` completion indicator, table-like rows (`.review-row`, `.timeline-row`, admin/advisor/platform tables), badges/pills, and the auth/onboarding forms.

### 3.6 Accessibility notes carried into this system

- All interactive elements keep a ≥44px touch target and a visible `--brand-focus` outline on `:focus-visible`.
- Color is never the only signal — badges pair color with text, and completion state pairs color with a checkmark icon.
- Headings receive programmatic focus after route changes so screen-reader and keyboard users always land on the new page title.
- `prefers-reduced-motion` disables transitions app-wide.

---

## 4. Responsive behavior

| Breakpoint | Sidebar | Container | Cards |
| --- | --- | --- | --- |
| ≥1200px (desktop) | Fixed, expanded (272px) | `--container-max` centered, 40px gutter | Featured + secondary attention layout (1.3fr / 1fr) |
| 701–1200px (tablet) | Fixed, narrower (230px) or collapsed | Full width, 28px gutter | Featured card stacks above secondary list |
| ≤700px (mobile) | Off-canvas, toggled by topbar menu button | Full width, 16–19px gutter | 1-column, stacked cards |

---

## 5. Open decisions (carried from `IMPLEMENTATION_CONTEXT.md`)

This workflow intentionally does not invent answers to product questions still marked open in the implementation context: production settings/notification channels, scheduling/calendar integration, benchmarking methodology, and full content publishing rules. Where the UI touches these, it says so honestly (e.g., benchmarking's "not available yet" card) rather than mocking a false capability.
