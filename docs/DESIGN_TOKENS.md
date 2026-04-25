# Design Tokens

The visual source of truth is still `xAI_LMS_Prototype.html`.

The machine-readable token contract is:

`contracts/design-tokens.contract.json`

## Rule

Do not create a new palette during migration.

The contract preserves the current prototype's `:root` CSS variables and labels their product roles. Future React components should consume these tokens instead of inventing new local colors, shadows, radius values, or font stacks.

## Covered Token Groups

- Background and surface colors
- Text and border colors
- Claritas, student, instructor, status, and XAI accents
- Radius scale
- Shadow scale
- Motion easing
- Typography stacks

## Verification

Run:

```bash
npm run verify:design-tokens
```

This checks that every contracted root token still matches the prototype `:root`, and that the prototype does not introduce undocumented root variables.

The full gate remains:

```bash
npm run verify:prototype
```
