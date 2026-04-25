# Productization Guardrails

This project is moving from a presentation prototype toward a real LMS service. The current HTML prototype is a visual and product reference, not the implementation target.

## Core Decision

Preserve the visual direction. Replace the implementation structure.

- Do not redesign the LMS from scratch.
- Do not replace the current information density with a marketing-style or generic SaaS layout.
- Do not introduce a new palette, card language, navigation model, or AI panel model unless a specific usability, accessibility, or service requirement forces it.
- Treat the existing desktop prototype as the visual source of truth until a route has been intentionally redesigned and approved.

## Product Surfaces

The student and instructor experiences should be developed as separate service surfaces that share a platform core.

### Student Surface

Owns learner-facing workflows:

- Today dashboard and learning plan
- Lecture/player experience
- Assignments and submissions
- Feedback and grade explanations
- Personal insight and progress
- AI companion and learning recommendations
- Course exploration

Primary design concern: clarity, guidance, confidence, and low-friction recovery when the learner is stuck.

### Instructor Surface

Owns teaching-facing workflows:

- Teaching dashboard
- Course and session design
- Rubrics and grading
- Co-creation workflow
- Class health and intervention
- Student/group insight
- Evidence, measurement, and policy trace

Primary design concern: scanability, decision confidence, auditability, and low-cost intervention.

### Shared Platform Core

Shared code and contracts should live below the surfaces:

- Identity, role, tenant, course, enrollment
- LMS route shell and navigation primitives
- Design tokens
- XAI evidence schema
- Notification and task model
- Analytics/event contracts
- Accessibility and visual verification tools

Student and instructor screens may link to each other through shared entities such as course, lecture segment, assignment, rubric, intervention, and measurement result. They should not depend on each other's page internals.

## Design Preservation Rules

When migrating or improving UI:

- Preserve the current app-shell concept: topbar, left navigation, main work area, right AI/context panel.
- Preserve the student/instructor persona color semantics, but reduce inconsistency through tokens.
- Preserve the AI flow: signal, evidence, recommended action, human approval, effect measurement.
- Preserve the Japanese university LMS tone: work-focused, respectful, dense, institutional, not decorative.
- Preserve route-level information hierarchy before changing visual styling.

Allowed changes:

- Fix overflow, contrast, focus, keyboard, ARIA, and responsive failures.
- Normalize repeated button, badge, chip, card, metric, timeline, and XAI evidence components.
- Extract shared components without changing visual behavior.
- Adjust spacing or typography only when it improves scanability or prevents layout breakage.

Not allowed without explicit approval:

- Replacing the full palette.
- Replacing the app shell.
- Turning operational screens into landing-page or hero-style layouts.
- Removing dense operational information to make screens look simpler.
- Combining student and instructor experiences into a single mode-switch-first product.

## Work Unit Rule

Improve one bounded area at a time.

Each change should declare:

- Surface: student, instructor, shared, or reference.
- Route or component affected.
- Problem being fixed.
- Expected visual impact.
- Verification command or screenshot set.

Examples:

- `student.lecture`: fix AI target click conflict and keyboard access.
- `instructor.cocreation`: normalize XAI evidence cards.
- `shared.AppShell`: preserve desktop layout while adding responsive behavior.
- `shared.XaiCard`: enforce evidence/action/measurement schema.

## Migration Rule

The first production app should be a productization migration, not a redesign.

Recommended sequence:

1. Freeze the current prototype screenshots as golden references.
2. Split source ownership into `student`, `instructor`, and `shared` areas.
3. Extract design tokens from the current prototype.
4. Rebuild one surface route at a time in the production app.
5. Compare screenshots against the golden reference.
6. Only then apply targeted accessibility, responsive, and component-quality improvements.
