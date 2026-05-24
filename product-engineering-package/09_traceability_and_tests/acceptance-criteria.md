# Acceptance Criteria

- Funding contract includes kernel, module, RBAC, business rules, state machine, page contracts, API draft, error codes, QA gates, traceability, and test mapping.
- All requested mutation APIs require idempotency and audit metadata.
- Deposit, withdrawal, and transfer each have success and failure state coverage.
- Withdrawal and transfer require approved KYC.
- Internal transfer is same-owner only.
- Configurable limits, fees, FX source, and channel maintenance are represented without inventing unapproved values.
- Production release remains blocked until provider, ledger, KYC, compliance copy, UI, UX, and QA gates are complete.

