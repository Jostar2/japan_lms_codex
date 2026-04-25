# Instructor Dashboard UI Migration

`src/instructor/dashboard/InstructorDashboardRoute.tsx` migrates the first instructor route into React. It preserves the prototype's operational LMS structure: situation layer, metrics, decision queue, and right-side AI summary.

## Migrated Surface

- Hero for three pending decisions.
- Situation layer with risk, grading, and rubric readiness signals.
- Four operating stats.
- Decision queue with W7 Co-Creation, grading uncertainty, and intervention review.
- Right-side question trend card, sentiment signal, and schedule.
- Primary action from `decision-w7-cocreation` to `instructor.cocreation`.

## Verification

Run:

```bash
npm run verify:app-shell
```

The smoke check now validates both migrated routes: `student.lecture` and `instructor.dashboard`. It also runs axe accessibility checks before navigating from the instructor decision queue into `instructor.cocreation`.
