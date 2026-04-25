# Long-Term Productization Plan

This plan treats the current prototype as a visual/product reference and moves the project toward a real university LMS service. The product direction is not a redesign. It is a controlled migration from single-file prototype to service-grade architecture.

## Operating Principle

Design is conserved. Implementation is replaced.

- Preserve the current app shell, density, XAI flow, Japanese university tone, and student/instructor semantics.
- Separate student and instructor surfaces, but keep them connected through shared LMS domain entities.
- Move one bounded work unit at a time.
- Every phase must keep `npm run verify:prototype` passing.

## Phase 0: Repo And Verification Foundation

Status: done.

Goal: make the prototype measurable and prevent accidental design drift.

Deliverables:

- GitHub repo initialized and connected.
- Prototype route capture script.
- Route, interaction, accessibility, contract, and type checks.
- Machine-readable surface contract.
- Golden route screenshots.
- CI gate for core checks.

Exit criteria:

- `npm run verify:prototype` passes.
- Student 8 routes and instructor 9 routes are verified.
- Every `data-ai-target` resolves locally or through a declared cross-route link.
- The W7/Lec2 closed loop is contractually represented.

## Phase 1: Product Shell Without Redesign

Status: done.

Goal: create the production app shell while preserving the visual source of truth.

Deliverables:

- React + TypeScript app entry.
- Shared `AppShell`, `Topbar`, `LeftNav`, `MainRegion`, `AiContextPanel` boundaries.
- Design token extraction from the prototype.
- No route UI redesign yet.

Exit criteria:

- Shell can render student and instructor surfaces from the contract.
- `npm run verify:app-shell` checks route counts, surface switching, and the W7 closed loop.
- `npm run verify:prototype` remains passing.
- No new palette, layout model, or marketing-style surface is introduced.

## Phase 2: Student Surface Migration

Status: first route migrated.

Goal: migrate learner workflows one route at a time.

Order:

1. `student.lecture`
2. `student.dashboard`
3. `student.assignment`
4. `student.feedback`
5. `student.insight-me`
6. `student.companion`
7. `student.explore`
8. `student.today`

Exit criteria per route:

- Route reads from typed data models, not string-only templates.
- XAI evidence follows the shared contract.
- Keyboard and screen-reader affordances are verified.
- Student privacy boundary is respected.
- Visual comparison against prototype is reviewed.

## Phase 3: Instructor Surface Migration

Status: planned.

Goal: migrate teaching workflows one route at a time.

Order:

1. `instructor.dashboard`
2. `instructor.cocreation`
3. `instructor.grading`
4. `instructor.classhealth`
5. `instructor.intervention`
6. `instructor.insights`
7. `instructor.rubric`
8. `instructor.design`
9. `instructor.today`

Exit criteria per route:

- Decision, evidence, approval, and measurement hierarchy is preserved.
- Cohort-level and individual-level signals are separated.
- Instructor audit trail is visible.
- Student privacy boundary is not crossed.
- Visual comparison against prototype is reviewed.

## Phase 4: Shared Domain And API Boundary

Status: planned.

Goal: define service-grade data contracts before real backend implementation.

Deliverables:

- Course, section, enrollment, lecture, assignment, submission, rubric, feedback, intervention, measurement, and XAI evidence schemas.
- API boundary for student and instructor surfaces.
- Event contracts for learning signals and instructor actions.
- Seed data for W7/Lec2 incident.

Exit criteria:

- Student and instructor surfaces consume the same domain objects.
- No page depends on another page's DOM or internal route template.
- Closed-loop state can move from student signal to instructor decision to measurement result.

## Phase 5: LMS Integration And Institutional Readiness

Status: planned.

Goal: unblock real pilot conversations.

Deliverables:

- LTI/NetLearning integration fit.
- Identity and role mapping.
- APPI/IRB/data readiness.
- Pilot measurement protocol.
- Japanese native UX review checklist.
- Data retention and audit policy.

Exit criteria:

- Pilot can be discussed with an institution without relying on presentation-only claims.
- AI recommendations have review, override, and measurement paths.
- Privacy and consent language is ready for review.

## Phase 6: Production Readiness

Status: planned.

Goal: make the LMS operable.

Deliverables:

- Authentication and authorization model.
- Tenant/course/section isolation.
- Observability, error reporting, audit logs.
- Backup/restore and migration plan.
- Security review aligned to OWASP ASVS.
- Performance budgets and accessibility regression gates.

Exit criteria:

- Core pilot workflows are testable end to end.
- Operational risks are documented.
- Design, accessibility, privacy, and measurement gates are automated.

## Current Next Work

The next implementation track should start with `student.lecture` because it is the strongest student-side entry point into the shared LMS loop. It already links to `instructor.dashboard` through `decision-w7-cocreation`.

Immediate next units:

1. Render the instructor dashboard decision route in React.
2. Keep `student.lecture` to `instructor.dashboard` to `instructor.cocreation` contract-backed.
3. Add visual/smoke checks for the React instructor dashboard route.
4. Then continue to the Co-Creation and class health measurement loop.
