# RetirementTrack Client UI Validation

## Conclusion

The current client prototype now covers the core MVP journey and proves the main product loop, but it does not yet cover every screen and behavior in Grant's broader product vision. The most important core flows work: activation, minimum profile, first dashboard, Planning Update, assessment, changed dashboard state, education, reminders, progress, and advisor contact.

## Minimal gap closure implemented

The following Discovery gaps were closed with focused extensions to the existing workflow and visual components:

- Dashboard education cards now display why each resource is relevant.
- The age-65 prompt now opens a focused milestone page with context, a checklist, related resources, and conservative advisor contact.
- Planning Update review now explains whether changes were found, and the existing review page becomes the completion-confirmation state after submission.
- The Assessment flow now includes an answer-review and explicit submit step.
- The illustrative Assessment rule creates advisor work only for Cautious or Growth-oriented results; a Balanced result is recorded without an exception.
- My Progress now groups current work under Completed, In progress, and Upcoming while preserving activity history.
- Notifications now expose completed reminder history when activities are finished.
- Content details now include related-resource and advisor-discussion pathways.
- Benchmarking now shows the intended static information structure without inventing values, rankings, or validated methodology.

The invitation, password, and prototype consent steps remain combined on one activation screen. This is the recommended minimal-flow treatment until production notice and invitation rules are confirmed.

The remaining gaps are concentrated in richer milestone journeys, benchmark presentation, content pathways, explicit completion screens, and a few product-rule details. These should be resolved before calling the client-side prototype fully complete for Discovery validation.

## Validation basis

This review compared the running application with the available Discovery conversation, the referenced workflow and reminder requirements, the Task 4 domain direction, and the implementation context. The browser journey was tested from `/activate` through onboarding, first dashboard, Planning Update, assessment result, returning dashboard, progress, notifications, Learning Library, profile, and benchmarking.

Status meanings:

- **Implemented**: present and functional in the current prototype.
- **Partial**: direction is present, but one or more expected screens, states, or behaviors are missing.
- **Missing**: no meaningful prototype experience exists yet.
- **Intentionally deferred**: the product decision is not confirmed or production data is unavailable.

## Suggested requirement verification

| Requirement | Status | Current behavior | Gap or action |
| --- | --- | --- | --- |
| Returning login | Implemented | Branded login with email/password demo form and clear product framing | Production authentication and recovery remain out of scope |
| Branded invitation acceptance | Partial | `/activate` identifies Harbor Wealth and Michael Carter | Invitation acceptance is combined with activation; firm/invitation validity is not visibly confirmed |
| Account activation and password creation | Implemented | Activation captures a demo password and records activated state | No password rules, confirmation field, expired invitation, or invalid invitation state |
| Required notices and consent | Partial | One required prototype-consent checkbox appears during activation | No separate notice/consent screen, document links, consent types, or withdrawal/preferences experience |
| Minimum profile | Implemented | Name, DOB, life stage, retirement age, household relationship, and optional partner name | Exact production minimum fields still require confirmation |
| Advisor assignment | Partial | Michael Carter is consistently shown as Sarah's advisor | Assignment is seeded, not shown as an onboarding confirmation or dynamically controlled |
| First-time dashboard | Implemented | Skipping profile produces a 0% dashboard with three clear actions; completing profile produces 33% | First visit is not explicitly labeled as a welcome state, and initial educational recommendations are mostly static |
| Returning dashboard | Implemented | Greeting, completion, open activities, completed states, content, and history change after submissions | Personalization is driven by a small set of fixed conditions rather than a broader rules model |
| Prioritized attention list | Implemented | Profile, Planning Update, and Assessment appear as actionable cards | All open cards have similar emphasis at common desktop widths; the UI does not always establish one dominant next action |
| Planning Update intro/due state | Partial | Dashboard due card leads directly to a clearly introduced four-step update | No separate intro screen explaining purpose, due date, data use, and expected outcome |
| Planning Update questions | Implemented | Four-step flow shows prior values and supports confirm/change choices | Business-approved questions and meaningful-change thresholds remain illustrative |
| Planning Update review | Implemented | Review shows all answers and labels changed versus unchanged | Pre-submit note says changes will be flagged even when nothing changed; wording should reflect the actual comparison |
| Meaningful-change handling | Implemented for Planning Update | Unchanged submission creates no exception; changed fields create one source-linked advisor exception | Every changed field is currently treated as meaningful; field-specific thresholds are not implemented |
| Planning Update completion | Partial | Submission returns to a changed dashboard with a completed card | No dedicated success/confirmation screen explaining what happens next |
| Assessment list | Implemented | Assessment landing page lists the available Investment & Risk Assessment | Only one assessment exists, which is acceptable for the current fixed-set MVP direction |
| Assessment intro | Implemented | Purpose, length, save/return claim, and non-advice disclaimer are shown | None material for the current scope |
| Assessment questions and resume | Implemented | Four questions persist immediately in browser state and resume at the first unanswered question | No explicit save confirmation or last-saved indicator |
| Assessment review/submit | Missing | The last answer submits immediately through “View my result” | Add an answer-review screen and explicit submit action if Grant expects review before finalization |
| Client-friendly assessment result | Implemented | Result is plain-language and clearly states it is not advice, suitability, or readiness | Add result-linked educational resources for stronger continuity |
| Advisor assessment exception rule | Gap | Every completed assessment creates an advisor exception | Grant's direction says advisor attention should occur only where needed; define and prototype the qualifying rule |
| Progress detail | Partial | Completion ring, activity history, and advisor-review count are present | Does not explicitly group Completed, In progress, Upcoming, and History; education/milestones are absent from progress history |
| Notifications/reminders | Partial | Planning, milestone, content, and assessment notification cards have contextual CTAs and completion-aware copy | No read/unread, dismiss, completed/dismissed archive, reminder preferences, or delivery history |
| Milestone detail | Partial | Age-65 dashboard and notification links open an age-65 one-pager | The destination is a generic resource pane rather than a milestone journey with why it matters, checklist, related media, advisor questions, and next steps |
| Benchmark detail | Intentionally deferred but incomplete for UI validation | `/client/benchmarking` explains why no comparison is shown | Grant's requested small benchmark example is not demonstrated; add a validated sample with measure, cohort, source, year, caveat, and plain-language context once approved |
| Learning Library | Implemented | Six resources across video, guide, one-pager, infographic, and article formats, with search and filters | Scale, content governance, topic filters, and firm/advisor content rules remain future work |
| Personalized content recommendations | Partial | Dashboard resource selection changes after assessment, and cards contain recommendation metadata | Dashboard cards do not currently display the stored “why this is relevant” reason; most rules are fixed rather than derived from dates and milestones |
| Content detail | Partial | Resource drawer shows type-specific placeholder media, approved-context warning, and mark-as-read state | No real video/document rendering, download action, related resources, follow-on checklist, or advisor discussion prompts |
| Return engagement | Implemented | “New for you” changes to “Continue exploring” after content is marked read | The continuation target is the last read item rather than a truly unfinished or newly recommended item |
| Advisor contact | Implemented | Contact dialog provides `mailto:` and `tel:` actions with no scheduling promise | Keep current conservative scope until messaging or scheduling is confirmed |
| Profile/household basics | Implemented | Editable profile and spouse/partner context are available | No separate household member account, shared activity, or consent model; those production rules remain open |
| Sign out | Implemented | Sign-out link returns to login | Demo state intentionally remains in localStorage |

## End-to-end loop validation

The prototype demonstrates most of Grant's intended engagement loop:

1. A Planning Update reminder appears.
2. The client returns and completes the update.
3. Answers are compared with the previous snapshot.
4. The dashboard changes to a completed state.
5. Relevant education and milestones remain available.
6. Advisor follow-up is created only when a Planning Update value changes.
7. The client receives another reason to return through new or continued education.

Two parts of this loop are not yet fully aligned:

- Assessment completion always creates advisor work, rather than only when an approved rule requires it.
- Milestone-to-education journeys stop at a generic resource preview instead of leading through a connected set of useful next steps.

## UX findings

### High priority

1. **Add a real milestone detail experience.** This is the clearest opportunity to demonstrate what makes RetirementTrack different. The age-65 example should combine timing, relevance, a checklist, educational resources, questions for Michael, and a clear next action.

2. **Resolve assessment follow-up rules.** The current implementation creates an advisor exception for every assessment. Confirm which results, answer patterns, or changes actually require advisor attention.

3. **Complete the benchmark concept or keep it explicitly out of the MVP demo.** The honest placeholder protects trust, but it does not validate Grant's requested benchmark experience. A demonstration should only be added when source, cohort, year, definitions, and caveats are approved.

4. **Show recommendation reasons on the dashboard.** The data already contains explanations such as age, stage, assessment activity, and upcoming milestones. Exposing one short reason under each resource would make personalization visible instead of implied.

### Medium priority

5. **Add Planning Update success feedback.** A short confirmation state should say whether changes were found, whether Michael may review them, and what the client can do next.

6. **Add assessment review before submission.** This gives clients a final chance to confirm answers and makes the transition to a result feel deliberate.

7. **Restructure My Progress.** Separate current activities into Completed, In progress, and Upcoming, then retain a chronological history below. Include meaningful content and milestone activity where appropriate.

8. **Expand notification states.** Add read/unread and dismissed/completed states in the prototype. Delivery preferences can remain deferred.

9. **Strengthen content pathways.** At least one RMD and one age-65 example should connect a video, guide, checklist, related item, and advisor discussion questions.

### Lower priority or product decision

10. **Decide whether activation needs separate invitation and consent screens.** The combined screen is efficient and adequate for a lean MVP, but it does not demonstrate the full multi-step journey described in the source workflow.

11. **Clarify dashboard action hierarchy.** On common desktop widths, open activities wrap into multiple equally weighted cards. Consider one featured next action with smaller secondary activities if Grant wants stronger prioritization.

12. **Define content completion semantics.** “Mark as read” works for every format, including videos and infographics. Production may need Viewed, Watched, Downloaded, Started, or Completed states by content type.

## Items to keep as they are

- Keep the progress measure explicitly labeled as activity completion, not retirement readiness.
- Keep the assessment result framed as a conversation aid rather than advice.
- Keep advisor contact limited to email and phone until messaging or scheduling is confirmed.
- Keep benchmark values hidden until the methodology is validated.
- Keep the Learning Library as a first-class client destination.
- Keep the dashboard focused on a small number of relevant next actions.
- Keep Planning Update follow-up exception-based rather than creating advisor work for every completion.

## Completion recommendation

The prototype is ready for a focused Discovery walkthrough of the core client journey. Before presenting it as the complete client experience, address these five items:

1. Milestone detail journey
2. Assessment exception rule
3. Dashboard recommendation reasons
4. Planning Update completion and Assessment review states
5. Progress and notification state depth

Benchmarking can remain explicitly deferred if the data and methodology are still unapproved. A separate invitation-acceptance screen is optional for a lean MVP, provided Grant agrees that combined activation and consent are sufficient.

## Technical validation

- Production build: passed
- TypeScript compilation: passed as part of the production build
- Domain transition tests: 5 passed, 0 failed
- Browser route and state-flow validation: passed for activation, onboarding, first dashboard, Planning Update, Assessment, returning dashboard, progress, notifications, content, profile, and benchmarking
- Formal WCAG audit with automated and manual assistive-technology testing: not yet completed
