# Module Map

| Module | Purpose | Platforms | Primary Roles | Notes |
|---|---|---|---|---|
| Funding | Deposit, withdraw, transfer, review, ledger, and reconciliation contracts for trading accounts. | App, H5, Admin | Trader, Funding Reviewer, Risk Compliance | Product contract only. |
| Account Assets | Existing account overview and transaction preview surface. | App, H5 | Trader, Partner | Must remain demo-labeled until live funding is connected. |
| Auth / KYC | Eligibility gate for withdrawal and transfer. | App, H5, Admin | Trader, Risk Compliance | KYC provider not defined in this package. |
| Admin Operations | Review and configuration operations for funding. | Admin | Funding Reviewer, Risk Compliance, Internal Operator | Needs permission service before build. |

