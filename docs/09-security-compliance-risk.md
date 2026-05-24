# Security, Compliance, and Risk

## Sensitive Data Rules

- Do not store card, bank, KYC, document, password, access token, or live trading credentials in localStorage or sessionStorage.
- Do not log order payloads that contain future real account identifiers.
- Do not add real payment, deposit, withdrawal, or KYC integrations without API contract, audit logging, and risk review.

## Financial Operation Rules

| Operation | Required Rule |
|---|---|
| Demo order | Validate lots, margin, instrument, and quote freshness |
| Future live order | Require risk warning, confirmation, audit log, and idempotency key |
| Deposit or withdrawal | Require KYC, ownership check, review state, and error code mapping |
| Partner upgrade | Require permission, status transition log, and rejection reason |

## Copy Rules

- Always label the current product as simulated where trading or account funds are discussed.
- Do not describe demo balances as withdrawable funds.
- Do not present educational content as investment advice.

