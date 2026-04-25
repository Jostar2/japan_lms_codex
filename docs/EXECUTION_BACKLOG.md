# Execution Backlog

The machine-readable backlog is:

`contracts/productization-backlog.json`

This file is the working queue. It prevents long-term planning from becoming a loose document disconnected from code.

## Backlog Rules

- Every work unit has an id, phase, surface, kind, status, summary, gates, route keys, and dependencies.
- Route keys must exist in the LMS contract.
- Dependencies must point to valid work units.
- Student work should start with `student.lecture`.
- Instructor work should follow the closed loop through `instructor.dashboard`, `instructor.cocreation`, and `instructor.classhealth`.
- A work unit is not done unless its declared gates pass.

## Verification

Run:

```bash
npm run verify:backlog
```

The full gate is:

```bash
npm run verify:prototype
```

## Current Order

1. Keep `foundation.verify-gates` passing.
2. Add CI core checks.
3. Extract design tokens without changing the visual language.
4. Create the production app shell. Done: `app.html` renders the contract-backed React shell.
5. Migrate `student.lecture` view model before UI. Done: `npm run verify:student-lecture-model`.
6. Migrate `student.lecture` UI with visual parity. Done: rendered in `app.html` and covered by `verify:app-shell`.
7. Migrate `instructor.dashboard` view model. Done: `npm run verify:instructor-dashboard-model`.
8. Migrate `instructor.dashboard` UI with visual parity. Done: rendered in `app.html` and covered by `verify:app-shell`.
9. Migrate `instructor.cocreation` view model. Done: `npm run verify:instructor-cocreation-model`.
10. Render instructor co-creation and measurement flows. Current next unit.
