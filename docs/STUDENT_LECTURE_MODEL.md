# Student Lecture View Model

`src/student/lecture/view-model.ts` is the typed source for the first student route migration. It extracts the non-visual state from `xAI_LMS_Prototype.html` before moving the UI into React.

## Covered State

- Lecture page copy, player title, current time, duration, and 22% progress.
- Five progress cues: start, 22% Gini/Entropy, definition boundary, application, recovery.
- Five AI summary bullets.
- Four transcript rows with the active `18:12` row linked to `transcript-18m12`.
- Metacognition check state linked to `metacog-check-3`.
- Aside heatmap, prerequisite card, confirmation question card, peer hint cluster, and companion prompts.
- Instructor bridge to `instructor.dashboard` / `decision-w7-cocreation` with privacy copy.

## Verification

Run:

```bash
npm run verify:student-lecture-model
```

This loads the TypeScript module through Vite SSR and checks the route key, player state, cue count, transcript state, XAI target coverage, peer cluster metrics, and instructor bridge.
