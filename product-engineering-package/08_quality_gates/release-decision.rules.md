# Release Decision Rules

- `allow`: only when provider, KYC, ledger, audit, permissions, UI/copy/UX gates, and all blocker/critical tests pass.
- `conditional_allow`: acceptable for contract review, backend spike, or UI planning with explicitly tracked blockers.
- `block`: required when live funds can move without idempotency, audit, KYC/ownership controls, or reconciliation.

Current package decision: `conditional_allow` for next-stage product/backend review, `block` for production release.

