# Development Handoff Contract

## Backend

- Implement API contracts in `05_api_contracts/openapi.draft.yaml`.
- Enforce RBAC and data scope before returning funding data.
- Add idempotency, audit logs, stable error codes, and state-machine validation before live mutation.
- Provider callbacks, reconciliation, and accounting ledger are required before production integration.

## Frontend

- Do not implement funding UI until Design System, Financial Copy, UI Build, and UX Gate outputs exist.
- Do not represent demo balance as withdrawable money.
- Use stable error codes and i18n keys; do not hardcode financial risk copy.

## QA

- Use `09_traceability_and_tests/test-case.mapping.md` as the minimum coverage baseline.
- Block release if permission, KYC, account status, idempotency, audit, or demo regression tests fail.

