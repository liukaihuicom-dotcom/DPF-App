# Entity Model

## FundingTransaction

| Field | Type | Required | Notes |
|---|---|---:|---|
| `id` | string | yes | Stable transaction id. |
| `operation` | enum | yes | `deposit`, `withdrawal`, `internal_transfer`. |
| `status` | enum | yes | Operation-specific state machine status. |
| `tradingAccountId` | string | conditional | Required for deposit and withdrawal. |
| `sourceTradingAccountId` | string | conditional | Required for transfer. |
| `targetTradingAccountId` | string | conditional | Required for deposit and transfer. |
| `customerId` | string | yes | Verified platform user id. |
| `paymentMethodId` | string | conditional | Required for deposit and withdrawal. |
| `requestedIdrAmount` | decimal | conditional | Required for deposit and withdrawal. |
| `requestedUsdAmount` | decimal | conditional | Required for transfer and available for withdrawal calculation. |
| `fee` | object | yes | Config-derived fee snapshot. |
| `fxQuote` | object | conditional | Required when IDR/USD conversion is involved. |
| `reviewRequired` | boolean | yes | True when manual review is needed. |
| `riskFlags` | array | yes | AML, limit, ownership, provider, or velocity flags. |
| `idempotencyKey` | string | yes for mutation | Required for API mutation requests. |
| `clientRequestId` | string | yes for mutation | Client correlation id. |
| `createdAt` | datetime | yes | ISO 8601. |
| `updatedAt` | datetime | yes | ISO 8601. |

## FundingRuleConfig

| Field | Type | Required | Notes |
|---|---|---:|---|
| `operation` | enum | yes | `deposit`, `withdrawal`, `internal_transfer`. |
| `paymentMethodType` | enum | conditional | Not required for internal transfer. |
| `minAmount` | decimal | yes | Config value TBD. |
| `maxAmount` | decimal | yes | Config value TBD. |
| `dailyLimit` | decimal | yes | Config value TBD. |
| `monthlyLimit` | decimal | yes | Config value TBD. |
| `feeType` | enum | yes | `fixed`, `percentage`, `fixed_plus_percentage`, `none`. |
| `feeAmount` | decimal | yes | Config value TBD. |
| `fxRateSource` | string | conditional | Required for IDR/USD conversion. |
| `maintenanceStatus` | enum | yes | `available`, `degraded`, `maintenance`, `disabled`. |

## AuditLog

| Field | Type | Required |
|---|---|---:|
| `actor` | string | yes |
| `actorRole` | string | yes |
| `reason` | string | yes |
| `previousStatus` | string | yes |
| `nextStatus` | string | yes |
| `timestamp` | datetime | yes |
| `requestId` | string | yes |

