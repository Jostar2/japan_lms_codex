# Instructor Dashboard UI Migration

`src/instructor/dashboard/InstructorDashboardRoute.tsx` migrates the first instructor route into React. It preserves the prototype's operational LMS structure: situation layer, metrics, decision queue, and right-side AI summary.

## Migrated Surface

- Hero for three pending decisions.
- Operating command bar that makes auto-execution, pending approvals, and data scope visible before any action.
- Situation layer with risk, grading, and rubric readiness signals.
- AI governance panel for approval, evidence, and measurement rules.
- Four operating stats.
- Decision queue with W7 Co-Creation, grading uncertainty, and intervention review.
- Per-decision proof grid covering evidence, uncertainty, and measurement target.
- Right-side question trend card, sentiment signal, and schedule.
- Primary action from `decision-w7-cocreation` to `instructor.cocreation`.

## Product Standard

The instructor dashboard is an approval and measurement surface, not a generic analytics dashboard. AI recommendations must expose evidence quality, uncertainty, human approval state, and measurement intent in the decision card itself.

## Verification

Run:

```bash
npm run verify:app-shell
```

The smoke check now validates both migrated routes: `student.lecture` and `instructor.dashboard`. It also runs axe accessibility checks before navigating from the instructor decision queue into `instructor.cocreation`.
