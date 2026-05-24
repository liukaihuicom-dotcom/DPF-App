# Event Tracking Schema

| Event | Required Properties |
|---|---|
| `funding_viewed` | `role`, `accountStatus`, `kycStatus` |
| `funding_deposit_started` | `tradingAccountId`, `methodType`, `kycStatus` |
| `funding_deposit_submitted` | `transactionId`, `amountBucket`, `methodType`, `reviewRequired` |
| `funding_withdrawal_started` | `tradingAccountId`, `kycStatus`, `payoutVerified` |
| `funding_withdrawal_submitted` | `transactionId`, `amountBucket`, `reviewRequired` |
| `funding_transfer_started` | `sourceAccountStatus`, `targetAccountStatus`, `kycStatus` |
| `funding_transfer_submitted` | `transactionId`, `amountBucket`, `reviewRequired` |
| `funding_error_shown` | `errorCode`, `operation`, `status`, `role` |
| `admin_funding_review_decided` | `reviewId`, `decision`, `riskFlags`, `reviewerRole` |

Do not track raw bank account numbers, e-wallet identifiers, documents, passwords, or full personal identifiers.

