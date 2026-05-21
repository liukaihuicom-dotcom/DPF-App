# State Machine

## Global Required States

| State | Required | Trigger | UI Behavior |
|---|---:|---|---|
| default | yes | Data available and action allowed | Normal page layout |
| loading | yes | Initial async work or route transition | Skeleton or progress indicator |
| empty | yes for data pages | No matching data | Empty state with next action |
| error | yes | Fetch, parse, route, or validation failure | Recoverable message and retry/back action |
| disabled | yes for actions | Permission, validation, or busy state blocks action | Disabled control with reason when needed |
| inputting | yes for forms | User edits a field | Inline validation hints |
| validating | yes for forms | Field or submit validation is running | Preserve input and show progress |
| submitting | yes for forms | Submit is in progress | Disable duplicate submit and show busy state |
| success | yes | Operation completed | Toast, result block, or navigation |
| failed | yes | Operation attempted and failed | Error copy, retry, and support path |
| permission-denied | yes for protected pages | Role or auth status lacks permission | Redirect or restricted explanation |
| restricted | yes for risk pages | Risk, KYC, market, or compliance block | Explain restriction and next step |
| reviewing | yes for review pages | Withdrawal or upgrade review is pending | Status timeline and expected next step |
| expired | yes for time-sensitive pages | Quote/session/token/request expired | Refresh or restart action |
| timeout | yes for async operations | Network or quote timeout | Retry, use stale data disclaimer |

## Current Domain States

| Domain | States |
|---|---|
| Auth | guest, signedIn, validationError, socialUnavailable, resetSent |
| Quote stream | connecting, connected, failed |
| Order | inputting, validating, submitting, filled, pending, cancelled, closed, failed |
| Transaction | completed, reviewing, rejected |
| Trading account | demo, active, readOnly, disabled, archived |
| Upgrade request | none, pending, approved, rejected |
| Discover module | selected, unavailable, pending placeholder |

## Account Assets State Scenarios

| Scenario | Trigger | UI Behavior |
|---|---|---|
| default | Signed-in trader with no live account data | Provide one demo trading account from local mock account data and mark it as Demo. |
| active | Live or funded account is available | Show in the tradable account group and include it in account activity counts. |
| readOnly | Account is view-only due to platform or compliance limits | Keep account visible, show read-only status, and block mutation actions when wired. |
| disabled | Account is blocked from trading | Show disabled status and avoid presenting it as tradable. |
| archived | Account is historical | Keep detail access for audit/history but exclude it from tradable counts. |
