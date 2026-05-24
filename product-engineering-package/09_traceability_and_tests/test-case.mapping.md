# Test Case Mapping

| Test ID | Scenario | Expected Result | Severity |
|---|---|---|---|
| `TC-PERM-001` | Guest opens funding page or calls funding API. | Redirect/reject with `FUNDING_PERMISSION_DENIED`. | Blocker |
| `TC-PERM-002` | Trader tries to fund another user's account. | Reject with permission error. | Critical |
| `TC-PERM-003` | Partner attempts client withdrawal or transfer. | Reject; partner can view only authorized summary. | Critical |
| `TC-KYC-001` | Non-KYC trader submits withdrawal. | Reject with `FUNDING_KYC_REQUIRED`. | Critical |
| `TC-KYC-002` | Non-KYC trader submits internal transfer. | Reject with `FUNDING_KYC_REQUIRED`. | Critical |
| `TC-KYC-003` | Non-KYC trader submits deposit. | Allow submission, mark resulting funds restricted by risk policy. | Major |
| `TC-ACCOUNT-001` | User tries funding mutation on demo/readOnly/disabled/archived account. | Reject with `FUNDING_ACCOUNT_NOT_ACTIVE`. | Blocker |
| `TC-DEPOSIT-001` | Deposit through bank transfer, VA, and e-wallet happy paths. | State reaches `completed`; audit log and ledger entry exist. | Critical |
| `TC-DEPOSIT-002` | Deposit method in maintenance. | Method disabled; mutation blocked with `FUNDING_METHOD_UNAVAILABLE`. | Major |
| `TC-DEPOSIT-003` | Deposit payment expires. | State becomes `expired`; retry requires new request/quote. | Major |
| `TC-DEPOSIT-004` | Provider amount mismatch. | State becomes `reviewing`; admin decision required. | Critical |
| `TC-DEPOSIT-005` | Provider name mismatch. | State becomes `reviewing` or `rejected` based on risk rule. | Critical |
| `TC-WITHDRAW-001` | Withdrawal payout method unavailable. | Block with `FUNDING_METHOD_UNAVAILABLE`. | Major |
| `TC-WITHDRAW-002` | Withdrawal balance insufficient. | Reject with `WITHDRAWAL_INSUFFICIENT_BALANCE`. | Critical |
| `TC-WITHDRAW-003` | Withdrawal bank account unverified. | Reject with `WITHDRAWAL_BANK_ACCOUNT_UNVERIFIED`. | Critical |
| `TC-WITHDRAW-004` | Withdrawal enters manual review and is approved. | State progresses to `processing`, `paid`, `completed`; audit includes reviewer reason. | Critical |
| `TC-TRANSFER-001` | Same-owner active account transfer succeeds. | State reaches `completed`; source debit and target credit recorded. | Critical |
| `TC-TRANSFER-002` | Source and target are the same account. | Reject with `TRANSFER_SAME_ACCOUNT_NOT_ALLOWED`. | Critical |
| `TC-TRANSFER-003` | Cross-owner transfer attempted. | Reject with `TRANSFER_OWNER_MISMATCH`. | Critical |
| `TC-TRANSFER-004` | Target account restricted. | Reject with `TRANSFER_TARGET_RESTRICTED`. | Critical |
| `TC-LIMIT-001` | Amount exceeds configured limit. | Reject or review based on config; never auto-complete silently. | Critical |
| `TC-FEE-001` | Fee rule missing. | Block submit with `FEE_RULE_MISSING`. | Critical |
| `TC-FX-001` | FX quote expired before submit. | Block submit with `FX_QUOTE_EXPIRED`. | Critical |
| `TC-FX-002` | FX source unavailable. | Block submit with `FX_RATE_UNAVAILABLE`. | Critical |
| `TC-REVIEW-001` | AML or velocity flag hit. | State becomes `reviewing`; Risk Compliance decision required. | Critical |
| `TC-AUDIT-001` | Any transition occurs. | Audit log contains actor, reason, previousStatus, nextStatus, timestamp, requestId. | Blocker |
| `TC-API-001` | Mutation request omits idempotency or audit metadata. | Reject request. | Blocker |
| `TC-REG-001` | Existing demo account balance is shown near funding entry. | Demo remains labeled non-withdrawable; live funding mutation disabled. | Blocker |

