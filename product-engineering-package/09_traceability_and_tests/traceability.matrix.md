# Traceability Matrix

| Goal / Rule | Page Contract | API Contract | Error Codes | Test Cases |
|---|---|---|---|---|
| Guest cannot access funding (`BR-FUND-001`) | App funding pages | All `/funding/*` | `FUNDING_PERMISSION_DENIED` | `TC-PERM-001` |
| Trader own-account scope (`BR-FUND-002`) | Deposit, withdrawal, transfer forms | `POST /funding/*` | `FUNDING_PERMISSION_DENIED` | `TC-PERM-002` |
| Partner cannot initiate funding (`BR-FUND-003`) | App funding pages | `POST /funding/*` | `FUNDING_PERMISSION_DENIED` | `TC-PERM-003` |
| KYC required for withdrawal/transfer (`BR-FUND-004`) | Withdrawal, transfer forms | `POST /funding/withdrawals`, `POST /funding/transfers` | `FUNDING_KYC_REQUIRED` | `TC-KYC-001`, `TC-KYC-002` |
| Deposit can be submitted before KYC with restrictions (`BR-FUND-005`) | Deposit form/detail | `POST /funding/deposits` | Review/status codes | `TC-KYC-003` |
| Active account required (`BR-FUND-006`) | All funding forms | `GET /trading-accounts`, `POST /funding/*` | `FUNDING_ACCOUNT_NOT_ACTIVE` | `TC-ACCOUNT-001` |
| Same-owner transfer (`BR-FUND-007`) | Transfer form/detail | `POST /funding/transfers` | `TRANSFER_OWNER_MISMATCH`, `TRANSFER_SAME_ACCOUNT_NOT_ALLOWED` | `TC-TRANSFER-001`, `TC-TRANSFER-003` |
| Method availability (`BR-FUND-008`) | Deposit/withdrawal forms | `GET /funding/payment-methods` | `FUNDING_METHOD_UNAVAILABLE` | `TC-DEPOSIT-002`, `TC-WITHDRAW-001` |
| Limits and fees (`BR-FUND-009`) | All forms | `GET /funding/rules` | `FUNDING_LIMIT_EXCEEDED`, `FEE_RULE_MISSING` | `TC-LIMIT-001`, `TC-FEE-001` |
| FX quote required (`BR-FUND-010`) | Deposit/withdrawal forms/details | `GET /funding/rules`, mutation APIs | `FX_QUOTE_EXPIRED`, `FX_RATE_UNAVAILABLE` | `TC-FX-001`, `TC-FX-002` |
| Manual review (`BR-FUND-011`) | Admin review pages | Admin review APIs | Review-required operation codes | `TC-REVIEW-001` |
| Audit required (`BR-FUND-012`) | Admin review/detail | All mutation APIs | N/A | `TC-AUDIT-001` |
| Mutation metadata (`BR-FUND-013`) | All submit pages | All mutation APIs | Validation error | `TC-API-001` |
| Demo funds not withdrawable (`BR-FUND-014`) | Existing account assets and future funding entry | `GET /trading-accounts` | `FUNDING_ACCOUNT_NOT_ACTIVE` | `TC-REG-001` |

