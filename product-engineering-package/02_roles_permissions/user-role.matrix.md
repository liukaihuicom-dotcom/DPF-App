# User Role Matrix

| Role | Identity Source | Funding Use | Data Scope |
|---|---|---|---|
| Guest | No authenticated session | No funding access | None |
| Trader | Signed-in customer | Own deposit, withdrawal, transfer, and transaction history | Own verified trading accounts |
| Partner | Signed-in IB/partner | Summary only when explicitly authorized | No bank, KYC, or payout PII |
| Funding Reviewer | Admin permission service | Manual review decisions | Review queue assigned to reviewer/team |
| Risk Compliance | Admin permission service | Risk review, configuration approval, exception investigation | Funding/risk records required for duties |
| Internal Operator | Admin permission service | Channel maintenance operation only | Non-PII operational config |

