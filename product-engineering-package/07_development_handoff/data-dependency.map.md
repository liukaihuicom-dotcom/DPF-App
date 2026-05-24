# Data Dependency Map

| Dependency | Required For | Status |
|---|---|---|
| Trading account API | Account selection and eligibility | Draft endpoint only |
| Payment method config | Deposit and withdrawal method availability | Provider TBD |
| Funding rule config | Limits, fees, FX policy | Values TBD |
| KYC status | Withdrawal and transfer eligibility | Provider TBD |
| Payout ownership verification | Withdrawal eligibility | Provider TBD |
| FX quote service | IDR/USD conversion | Source TBD |
| Ledger service | Final account debit/credit | Not implemented |
| Audit service | State transition traceability | Not implemented |
| Review service | Manual risk/ops review | Not implemented |

