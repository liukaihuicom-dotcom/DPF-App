# Release Decision Report

Decision: `conditional_allow_for_contract_review`

## Allowed Next Stage

- Product review.
- Backend/API architecture review.
- Risk and compliance review.
- Design System and UI Build planning.
- QA test-plan drafting.
- Production directory governance can enter next-stage review after `node scripts/qa/qa-all.js` and TypeScript checks pass.

## Blocked

- Production release.
- Live payment provider integration.
- Live payout provider integration.
- Live funding UI marked production-ready.
- Any flow that treats demo balances as withdrawable funds.

## Required Human Review

- Indonesia compliance and legal review.
- AML threshold and manual review policy.
- Provider contract and SLA review.
- Finance/accounting ledger and reconciliation review.
- Native-language and compliance copy review before UI release.

## Validation Gate

- Standard command: `corepack enable && pnpm qa:all`
- Direct fallback: `node scripts/qa/qa-all.js`
- TypeScript gate: `pnpm exec tsc --noEmit` or `./node_modules/.bin/tsc --noEmit`
- Validation ownership map: `product-engineering-package/11_validation_scripts/README.md`
