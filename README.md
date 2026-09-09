# RetirementTrack — Phase 1 client prototype

React + TypeScript + Vite + React Router. Run `npm install`, `npm run dev`; use `npm run build` for production and `npm test` for domain transition tests.

## Walkthrough

Open `/login`. Choose **Have an invitation?** to activate the fictional account, accept the demo notice, and complete the minimum profile. The dashboard offers a Planning Update and a four-question Investment & Risk Assessment. Change retirement age from 65 to 63, review and submit, then complete the assessment. Return to the dashboard to see completed actions, progress, new content, history, and advisor review cues. Sidebar pages and the contact dialog are functional. Reset from **My progress → Prototype controls**.

## Domain and boundaries

Based on the referenced Discovery plan and uploaded Task4_Domain_Data_Model.docx: tenant-scoped relationship and workflow IDs, versioned assignments/results, prior-state comparison, detected changes, source-linked advisor exceptions, activity history and client content state. Household context follows the later confirmation of spouse/partner support. No production authorization boundary is claimed.

Demo state is persisted under `retirementtrack-demo-v1` in browser localStorage. Passwords are never retained. Dates, contact details, reminder cadence, assessment questions, scoring and change-detection rules are illustrative pending product validation. All changed Planning Update fields create one source-linked exception; an unchanged submission creates none. Assessment completion creates a review cue. Submissions are idempotent. Completion stops the corresponding displayed reminder. The progress bar measures three activities, never readiness.

No real authentication, backend, production APIs, scheduling, calendar, SMS or outbound communication. Contact uses example.com and a fictional phone number. Benchmarking intentionally shows unavailable until methodology and data are validated. Sample articles require editorial approval. UI guidance was supplied as a standalone SKILL.md without its searchable data/scripts.

Responsive layout, semantic native forms, visible focus outlines, required field validation, reduced-motion support, skip link and native keyboard-trapping dialog are implemented. Automated domain tests and TypeScript/production build validation are included; browser interaction and visual accessibility auditing have not been performed.
`nOptional WebMCP progress reader is feature-detected. No supported validation context was available; registration has not been verified.
