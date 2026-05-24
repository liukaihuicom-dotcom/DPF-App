# AI Usage Rules

Codex must read these assets before creating or changing production UI:

1. `docs/01-product-modules.md`
2. `docs/02-page-map.md`
3. `docs/06-state-machine.md`
4. `design-system/01-tokens/token-architecture.md`
5. Relevant component docs in `design-system/03-components/`
6. Relevant business component docs in `design-system/04-business-components/`
7. Relevant pattern docs in `design-system/05-patterns/`

## Forbidden

- Do not create a page from visual taste alone.
- Do not add hardcoded colors outside token source files.
- Do not create one-off duplicated buttons, cards, sheets, lists, or status blocks.
- Do not ship a normal state without loading, empty, error, disabled, success, and failed coverage where applicable.
- Do not store sensitive finance, KYC, bank, card, password, or live token data in localStorage.

## Required Output For New UI Work

- UI DNA analysis from existing app or reference.
- Token mapping.
- Component usage mapping.
- State coverage.
- Visual QA report.
- Pattern extraction notes.

