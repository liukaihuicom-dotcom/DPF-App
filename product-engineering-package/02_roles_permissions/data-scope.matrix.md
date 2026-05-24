# Data Scope Matrix

| Data Object | Trader | Partner | Funding Reviewer | Risk Compliance | Internal Operator |
|---|---|---|---|---|---|
| Own trading account id | own | authorized summary only | review context | risk context | masked |
| Bank / payout account | own masked | no | masked unless review requires | masked/full by approval | no |
| E-wallet identifier | own masked | no | masked unless review requires | masked/full by approval | no |
| KYC status | own status only | no | status only | status and risk reason | no |
| Funding transaction | own | authorized summary only | review queue | full risk/audit | operational metadata |
| FX/fee config | read result | no | read result | configure/approve | operational read/update by permission |
| Audit log | own user-visible events | no | review-related | full | config-related |

