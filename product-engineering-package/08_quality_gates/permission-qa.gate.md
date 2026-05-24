# Permission QA Gate

Decision: `contract_ready`

| Gate | Status | Notes |
|---|---|---|
| Guest blocked | Pass | RBAC and rules block guest funding. |
| Trader own-account scope | Pass | Own verified trading accounts only. |
| Partner mutation blocked | Pass | Partner cannot initiate client funding in V1. |
| Admin review scoped | Pass | Funding reviewer/risk roles only. |
| Data scope defined | Pass | Bank, payout, KYC, audit data scopes documented. |

