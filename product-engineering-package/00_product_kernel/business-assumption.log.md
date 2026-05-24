# Business Assumption Log

| ID | Assumption | Owner | Risk | Status | Expiry / Review |
|---|---|---|---|---|---|
| ASM-FUND-001 | V1 uses direct-to-trading-account funding without wallet intermediary. | Product | High | Confirmed by plan | Recheck before wallet roadmap. |
| ASM-FUND-002 | Indonesia V1 includes Bank Transfer, Virtual Account, and E-wallet abstractions. | Product / Operations | Medium | Assumed | Confirm providers before API integration. |
| ASM-FUND-003 | Customer payment currency is IDR and trading account currency is USD. | Product / Finance | High | Confirmed by plan | Recheck when multi-currency account opens. |
| ASM-FUND-004 | Withdrawal and internal transfer require approved KYC; deposit may be submitted before KYC but resulting funds can be restricted. | Risk / Compliance | Critical | Assumed | Requires compliance sign-off. |
| ASM-FUND-005 | Limits, fees, FX source, AML thresholds, velocity rules, and channel maintenance state are configured by backend/admin. | Engineering / Risk | Critical | Assumed | Must be resolved before build. |
| ASM-FUND-006 | Partner cannot initiate funding on behalf of clients in V1. | Product | High | Confirmed by plan | Recheck before IB operations release. |
| ASM-FUND-007 | No live payment, payout, KYC, trading, or accounting provider is connected by this package. | Engineering | Critical | Confirmed | N/A |

