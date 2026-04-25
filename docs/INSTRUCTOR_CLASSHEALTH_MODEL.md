# Instructor Class Health Route

`src/instructor/classhealth/view-model.ts` extracts the professor-side cohort health and impact-ledger state for the W7/Lec2 closed loop.

`src/instructor/classhealth/InstructorClassHealthRoute.tsx` renders it as a bespoke product screen instead of using the fallback route workspace.

## Covered State

- Five-step evidence-to-policy trace: detect, decide, deploy, measure, policy.
- CLO-3 mastery recovery after the Co-Creation intervention.
- Impact Ledger rows for W7 detection, dashboard decision, Variant B deployment, and 2026-04-24 measurement.
- Registered outcomes: rewatch rate, CLO-3 accuracy, duplicate question rate, and perceived surveillance guardrail.
- Cohort-level support actions before any individual student list is opened.
- Purpose-token gate and audit copy for individual student access.
- Risk model factor explanation in the right AI panel.

## UI Contract

- Class Health must default to cohort-level support and measurement, not individual student lists.
- `impact-ledger-entry` is the bridge target from `instructor.cocreation`.
- High-value controls carry `data-ai-target` so the AI panel can explain the selected ledger row, CLO trend, policy memo, support action, engagement anomaly, access gate, or model factor stack.
- Policy promotion must remain a professor-approved action and must keep next-semester revalidation visible.

## Verification

Run:

```bash
npm run verify:instructor-classhealth-model
npm run verify:app-shell
```

The model audit checks all Class Health targets and the app shell smoke check follows the route from Co-Creation into Class Health, switches AI contexts, and runs axe on the screen.
