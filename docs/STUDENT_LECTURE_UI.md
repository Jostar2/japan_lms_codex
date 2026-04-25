# Student Lecture UI Migration

`src/student/lecture/StudentLectureRoute.tsx` is the first React route migrated from the prototype. It uses `src/student/lecture/view-model.ts` and keeps the original LMS density and Claritas/XAI visual language instead of introducing a new design.

## Migrated Surface

- Page header with lecture metadata and Quick 5-minute action.
- Video player frame paired with a recommended recovery path, so the page reads as a learning workspace rather than a passive media screen.
- Segment callout linked to `seg-22pct`.
- Compact resource strip for textbook, captions, and assignment linkage.
- Summary and transcript panels.
- Metacognition check linked to `metacog-check-3`.
- Cohort bridge linked to `instructor.dashboard` / `decision-w7-cocreation`.
- Route-specific right AI panel with heatmap, prerequisite, confirmation, peer cluster, and companion prompts.

## Product Standard

The student lecture route should keep the core sequence visible above the fold on desktop: current segment, video, recovery path, and evidence callout. AI support must be framed as private learning recovery first; cohort signals may appear only as anonymized guidance.

## Verification

Run:

```bash
npm run verify:app-shell
```

The smoke check renders `app.html`, verifies the student lecture UI, checks the 8/9 student/instructor route split, switches to the instructor surface, and runs axe accessibility checks on both surfaces.
