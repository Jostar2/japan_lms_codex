# Instructor Co-Creation View Model

`src/instructor/cocreation/view-model.ts` extracts the closed-loop Co-Creation Studio state from the prototype before rendering the route in React.

## Covered State

- Step 1 incident input from `student.lecture` 22% / `instructor.dashboard` decision.
- Generation constraints: CASE, terminology consistency, source quality.
- Three AI variants: A metaphor, B example, C visualization.
- Variant B selection rationale.
- Draft editing state and governance gates.
- Step 4 approval / AB settings.
- Step 5 measured effect.
- Class health bridge to `impact-ledger-entry`.
- Teaching profile and XAI measurement plan in the right panel.

## Verification

Run:

```bash
npm run verify:instructor-cocreation-model
```

The audit loads the model through Vite SSR and checks all closed-loop targets from `step1-input` through `impact-ledger-entry`.
