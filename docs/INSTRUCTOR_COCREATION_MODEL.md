# Instructor Co-Creation Route

`src/instructor/cocreation/view-model.ts` extracts the closed-loop Co-Creation Studio state from the prototype before rendering the route in React.

`src/instructor/cocreation/InstructorCocreationRoute.tsx` now renders that state as a bespoke product screen rather than falling back to the generic route workspace.

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

## UI Contract

- The main route must preserve the closed loop: student lecture signal, instructor dashboard decision, Co-Creation approval, and Class Health measurement.
- High-value controls carry `data-ai-target` so the right panel changes with the selected input, variant, rationale, governance gate, approval setting, measurement plan, or impact ledger.
- The AI panel is advisory only. It can explain evidence, compare alternatives, draft checks, and prepare measurement language, but publication remains a professor-approved action.
- The screen should stay dense and operational. It is a teaching-material workbench, not a marketing or demo page.

## Verification

Run:

```bash
npm run verify:instructor-cocreation-model
npm run verify:app-shell
```

The model audit loads the model through Vite SSR and checks all closed-loop targets from `step1-input` through `impact-ledger-entry`.

The app shell smoke check opens the Co-Creation route from the instructor dashboard, verifies the three generated variants, switches AI contexts through selected controls, and follows the Class Health bridge.
