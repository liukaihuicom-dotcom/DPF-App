# Validation Scripts Mapping

The product engineering package keeps validation ownership here and executes the shared project QA scripts from the repository root.

## Execution Entry

```sh
corepack enable
pnpm qa:all
```

Fallback for environments where pnpm is not yet available:

```sh
node scripts/qa/qa-all.js
```

## Script Map

| Product L5 validation area | Root script |
|---|---|
| Product kernel and delivery package presence | `scripts/qa/check-page-delivery.js` |
| Module and page contract coverage | `scripts/qa/check-page-delivery.js` |
| Business state coverage | `scripts/qa/check-state-coverage.js` |
| RBAC and security baseline | `scripts/qa/check-security-rules.js` |
| API contract coverage | `scripts/qa/check-api-contract.js` |
| Traceability and handoff readiness | `scripts/qa/check-handoff-docs.js` |
| Design system token and style governance | `scripts/qa/check-hardcoded-style.js` |
| Component manifest governance | `scripts/qa/check-component-manifest.js` |
| Icon registry governance | `scripts/qa/check-icons.js` |
| Localization key governance | `scripts/qa/check-i18n-keys.js` |
| Accessibility baseline | `scripts/qa/check-accessibility-baseline.js` |
| Release version record | `scripts/qa/check-version-record.js` |

## Ownership Rule

Do not duplicate executable QA scripts inside this package. Add or update checks in `scripts/qa/`, then update this mapping so Product, Design System, UI Build, and QA all consume the same release gate.
