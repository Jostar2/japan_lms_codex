# Surface Contracts

The machine-readable source for product surface boundaries is:

`contracts/university-lms.contract.json`

This contract exists so productization work cannot accidentally turn the student and instructor experiences into unrelated prototypes.

## What It Locks

- Student route ownership and privacy boundary
- Instructor route ownership and privacy boundary
- Shared academic entities
- XAI evidence fields required across both surfaces
- Closed-loop incident flow from student signal to instructor action and measurement

## Current Contracted Loop

`w7-gini-entropy-incident`

1. `student.lecture` detects the `seg-22pct` struggle segment.
2. `instructor.dashboard` receives it as `decision-w7-cocreation`.
3. `instructor.cocreation` turns it into an approved teaching-material intervention.
4. `instructor.classhealth` records `impact-ledger-entry` as measured outcome.

This is the first product-grade linkage model. Future student and instructor work should extend this pattern instead of inventing page-only links.

## Verification

Run:

```bash
npm run verify:contracts
```

The contract check verifies:

- Contract routes match the prototype routes.
- Contract routes exist in `PAGES`.
- Contract routes have `FOCUS_CONTEXT`.
- Closed-loop targets exist in the declared route context.
- Contract entity references are valid shared LMS entities.
