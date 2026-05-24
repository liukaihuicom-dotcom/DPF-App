# API Contract Rules

- All mutation endpoints require `idempotencyKey`, `clientRequestId`, `riskAcknowledged`, and `auditContext`.
- All list and detail endpoints must respect role and data-scope permissions.
- Error responses must use stable error codes from `error-codes.json`.
- API responses must not expose full bank, e-wallet, KYC document, or sensitive identity data to App/H5.
- Admin APIs must include audit records for review decisions and configuration changes.
- Provider callbacks are out of scope for this contract but must be added before live payment integration.

