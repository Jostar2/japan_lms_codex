# Production App Shell

`app.html` is the React + TypeScript migration entry point. It does not replace `xAI_LMS_Prototype.html` as the visual source of truth yet. The prototype remains the reference for density, color, tone, and route parity.

## Boundaries

- `src/app/App.tsx` owns route state and wires shared contracts into the shell.
- `src/app/AppShell.tsx` owns the topbar, surface switch, left navigation, and main region boundary.
- `src/app/RouteWorkspace.tsx` renders product-facing fallback workspaces for routes that have not been migrated into bespoke React screens yet. It must not expose internal route ids, contract names, or migration scaffolding as visible UI.
- `src/app/AiContextPanel.tsx` renders route-aware evidence and privacy boundaries from `contracts/university-lms.contract.json`.
- `src/app/app-shell.css` uses design tokens extracted from the prototype instead of introducing a new palette.

## Verification

Run:

```bash
npm run verify:app-shell
```

The smoke check starts Vite, opens `app.html`, verifies the default learner route, switches to the instructor surface, checks the 8/9 route split, and confirms the shared W7 closed-loop bridge remains visible.

The full gate is still:

```bash
npm run verify:prototype
```

That gate includes the app shell smoke test plus the existing prototype route, interaction, accessibility, and screenshot checks.
