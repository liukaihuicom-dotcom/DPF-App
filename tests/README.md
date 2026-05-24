# Test Ownership Map

This project uses TypeScript plus production QA scripts as the current release gate. Focused automated tests should be added by ownership area as the product contracts grow.

## Current Gates

```sh
corepack enable
pnpm qa:all
pnpm exec tsc --noEmit
```

Fallback when pnpm is not available in the current shell:

```sh
node scripts/qa/qa-all.js
./node_modules/.bin/tsc --noEmit
```

## Ownership Areas

| Area | Source | Required coverage |
|---|---|---|
| Domain calculations | `src/domain/trading.ts`, `src/domain/funding.ts`, `src/domain/format.ts` | Numeric formatting, account totals, funding constraints, market direction |
| State transitions | `src/state/BrokerStore.tsx`, `src/auth/authFlow.ts` | Account selection, role state, auth progress, restricted states |
| Forms and validation | `src/screens/auth`, `src/screens/funding`, `src/components/TextField.tsx` | Required fields, invalid input, disabled submit, success and failure recovery |
| Permissions | `product-engineering-package/02_roles_permissions`, route files under `app/` | Role visibility, restricted access, data-scope boundaries |
| API contracts | `api-contracts/`, `product-engineering-package/05_api_contracts` | Schema compatibility, error mapping, mock contract stability |
| QA fixtures | `scripts/qa/` | Positive and negative fixtures for new delivery package checks |

## Release Rule

New production features should add the smallest focused tests needed for changed domain, state, permission, form, API, or QA behavior. Directory-only governance work may ship with QA and TypeScript evidence when runtime behavior is unchanged.
