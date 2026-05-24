# Scenario Coverage Report

| Scenario Group | Covered | Notes |
|---|---:|---|
| Permission | yes | Guest, trader, partner, admin roles mapped. |
| KYC | yes | Required for withdrawal and transfer; deposit restriction rule documented. |
| Deposit channels | yes | Bank Transfer, VA, E-wallet abstractions covered. |
| Withdrawal | yes | Balance, payout ownership, review, provider failure covered. |
| Internal transfer | yes | Same-owner active account rule covered. |
| FX and fee | yes | Fields and error codes covered; values TBD. |
| Audit | yes | State transition and review audit required. |
| Provider callback | no | Out of scope; blocker before production. |
| Ledger implementation | no | Out of scope; blocker before production. |

