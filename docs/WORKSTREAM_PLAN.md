# Workstream Plan

This plan keeps the student and instructor experiences separate while preserving shared LMS behavior and visual consistency.

## Track 0: Reference And Verification

Goal: make the current prototype measurable before replacing implementation.

- Keep `xAI_LMS_Prototype.html` as the main visual reference.
- Capture all route screenshots before migration.
- Record console errors and page errors per route.
- Add route inventory for student and instructor surfaces.
- Treat large unintended visual diffs as regressions.

Deliverables:

- Golden screenshots for all current routes.
- Route inventory with owner surface, status, and known risks.
- Verification scripts callable through npm.

## Track 1: Shared Platform Shell

Goal: create service-ready structure without changing the visual direction.

- App shell: topbar, nav, main region, right AI/context panel.
- Shared route model.
- Shared layout states: nav collapsed, AI expanded, focus mode.
- Design tokens extracted from current CSS.
- Accessibility primitives for focus, buttons, tabs, menus, and panels.

Verification:

- `npm run verify:app-shell`
- Desktop visual parity first.
- Keyboard traversal of shell controls.
- No console/page errors.

## Track 2: Student Surface

Goal: migrate learner workflows one route at a time.

Priority order:

1. `student.lecture`
2. `student.dashboard`
3. `student.assignment`
4. `student.feedback`
5. `student.insight-me`
6. `student.companion`
7. `student.explore`
8. `student.today`

Initial focus:

- Preserve student guidance flow.
- Fix learning recommendation affordances.
- Make AI evidence and action states consistent.
- Ensure stuck/recovery moments are easy to scan.

## Track 3: Instructor Surface

Goal: migrate teaching workflows one route at a time.

Priority order:

1. `instructor.dashboard`
2. `instructor.cocreation`
3. `instructor.grading`
4. `instructor.classhealth`
5. `instructor.intervention`
6. `instructor.insights`
7. `instructor.rubric`
8. `instructor.design`
9. `instructor.today`

Initial focus:

- Preserve operational density.
- Improve decision, evidence, approval, and measurement hierarchy.
- Make audit and policy trace visible without visual noise.
- Keep class-level and individual-level navigation clearly separate.

## Track 4: XAI Contract

Goal: make AI explanation cards consistent across both surfaces.

Required fields:

- Intent
- Evidence
- Model/version
- Confidence or uncertainty
- Recommended action
- Human approval state
- Measurement plan
- Follow-up result

Rules:

- Student-facing language must explain impact and next action.
- Instructor-facing language must expose evidence quality, uncertainty, and audit trail.
- Every AI recommendation must have a reversible or reviewable action path.

## Track 5: Pilot Readiness

Goal: unblock real institutional pilot conversations.

Documents to prepare:

- Decision Brief
- NetLearning/LTI integration fit
- APPI/IRB/data readiness
- Pilot measurement protocol
- Japanese native UX review checklist

These documents are not secondary. For an LMS pilot, they are product requirements.
