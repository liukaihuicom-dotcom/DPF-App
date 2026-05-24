# Domain Model

## Funding Domain

The funding domain controls money movement requests tied directly to trading accounts.

| Domain Object | Meaning | Primary Identifier | Notes |
|---|---|---|---|
| Trading Account | USD account used for trading and balance settlement | `tradingAccountId` | Demo/read-only/disabled/archived accounts cannot execute live funding mutations. |
| Deposit | IDR payment request credited as USD to a trading account | `depositId` | Requires payment method, FX quote, fee, and channel status. |
| Withdrawal | USD account debit paid out as IDR | `withdrawalId` | Requires approved KYC and verified payout ownership. |
| Internal Transfer | USD movement between same-owner trading accounts | `transferId` | Source and target account owners must match. |
| Payment Method | Configured funding rail | `paymentMethodId` | `bank_transfer`, `virtual_account`, or `e_wallet`. |
| FX Quote | Quote used to convert IDR and USD | `fxQuoteId` | Must expire and be refreshed before mutation if stale. |
| Funding Review | Manual review task for risk or operational exceptions | `reviewId` | Reviewer decision must be audited. |
| Ledger Entry | Immutable accounting movement record | `ledgerEntryId` | Must link to source transaction and account. |
| Audit Log | Immutable operation/state-change record | `auditLogId` | Required for every state transition. |

## Currency Model

- Customer-visible payment and payout amount: IDR.
- Trading account balance and ledger amount: USD.
- Conversion display must include rate, fee, expected USD amount, and final USD amount.
- If final provider or FX settlement differs from quoted amount, the transaction detail must expose the difference and reason code.

