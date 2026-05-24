# Field Spec Template

| Field | Type | Required | Source | Validation | Error Codes |
|---|---|---:|---|---|---|
| `tradingAccountId` | string | yes | `GET /trading-accounts` | Active, owner matches current user | `FUNDING_ACCOUNT_NOT_ACTIVE` |
| `paymentMethodId` | string | conditional | `GET /funding/payment-methods` | Available for operation | `FUNDING_METHOD_UNAVAILABLE` |
| `amount` | decimal | yes | User input | Config min/max/daily/monthly | `FUNDING_LIMIT_EXCEEDED` |
| `fxQuoteId` | string | conditional | `GET /funding/rules` or quote service | Not expired | `FX_QUOTE_EXPIRED` |
| `riskAcknowledged` | boolean | yes | User confirmation | Must be true for mutation | `FUNDING_PERMISSION_DENIED` |

