# Account Assets State Spec

| State | Trigger | UI Behavior | User Action | System Response | API / Data | Error Handling |
|---|---|---|---|---|---|---|
| default | Signed-in trader opens `/accounts` with no live account list | Show exactly one demo trading account and include it in tradable activity count | Open account or switch account | Navigate to demo account detail; account switcher lists Demo only | `buildTradingAccountProfiles(account, positions)` defaults to local demo account | Keep local mock data visible; no network dependency |
| loading | Future account API request is pending | Keep the page structure stable with account placeholders | Wait or leave page | Replace placeholders with accounts | Future account list endpoint | Preserve previous local demo data until live data succeeds |
| empty | Account API returns no live accounts | Show demo account instead of an empty dead end | Open demo account | Demo account remains usable for simulated flows | Local `initialAccount` fallback | Log integration issue when live endpoint is available |
| error | Account API or parsing fails | Show recoverable error copy while keeping demo fallback available | Retry or use demo account | Retry live fetch; demo data remains local | Future account list endpoint plus local fallback | Do not hide demo fallback |
| disabled | Account status is disabled | Show disabled badge and exclude from tradable count | View details | Actions remain blocked when live actions are wired | Account status from API or state analysis fixture | Explain disabled reason when API provides one |
| permission-denied | Guest opens account assets | Redirect to auth/onboarding or show restricted account copy | Sign in | Return to account assets after auth | Product auth status | Avoid exposing account balances to guests |
| restricted | KYC, risk, or compliance block applies | Keep account visible with restricted next step | Start required review step | Route to verification/review once implemented | Compliance status from future API | Do not enable deposit/withdraw/trade actions |
