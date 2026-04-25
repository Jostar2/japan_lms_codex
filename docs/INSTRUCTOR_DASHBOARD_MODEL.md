# Instructor Dashboard View Model

`src/instructor/dashboard/view-model.ts` is the typed source for the first instructor route migration. It carries the W7/Lec2 student signal into the professor decision queue without exposing individual student identity.

## Covered State

- Hero copy for three pending decisions.
- Situation layer: risk, grading focus, rubric readiness.
- Four operational stats: active courses, progress, ungraded work, intervention count.
- Three decision cards: W7 Co-Creation, grading uncertainty, intervention review.
- Aside question trends, including `question-trend-gini`.
- Weekly sentiment signal with aggregate-only privacy copy.
- Two schedule items.
- Primary bridge from `student.lecture` to `instructor.dashboard` to `instructor.cocreation`.

## Verification

Run:

```bash
npm run verify:instructor-dashboard-model
```

The audit loads the TypeScript module through Vite SSR and checks route keys, decision targets, queue order, question trend metrics, privacy language, and measurement copy.
