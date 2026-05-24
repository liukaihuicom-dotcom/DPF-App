# Exception Paths

| Exception | Applies To | Required State | User / Admin Behavior |
|---|---|---|---|
| Amount mismatch | Deposit | `reviewing` | Hold credit; show pending review; admin compares provider amount and requested amount. |
| Name mismatch | Deposit, Withdrawal | `reviewing` or `rejected` | Require ownership check; reject if third-party funding is detected. |
| FX quote expired | Deposit, Withdrawal | `expired` or `failed` | Require refreshed quote before retry. |
| Limit exceeded | All | `rejected` or `reviewing` | Block or route to manual review based on configured rule. |
| KYC missing | Withdrawal, Transfer | `rejected` | Show KYC required next step. |
| Payout ownership unverified | Withdrawal | `rejected` | Require bank/e-wallet ownership verification. |
| Provider maintenance | Deposit, Withdrawal | `disabled` before submit | Disable method and show alternate available methods. |
| Ledger failure | All | `failed` | Prevent duplicate mutation; require reconciliation. |
| AML hit | All | `reviewing` | Risk Compliance decision required. |

