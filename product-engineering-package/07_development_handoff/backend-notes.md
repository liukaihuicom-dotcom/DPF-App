# Backend Notes

- Treat this contract as draft until provider, ledger, KYC, and compliance integrations are confirmed.
- Do not allow live mutation without idempotency persistence.
- Apply state-machine transition checks server-side.
- Ensure audit logs cannot be edited or deleted by normal admin users.
- Reconciliation must detect provider amount mismatch, FX mismatch, and ledger mismatch.

