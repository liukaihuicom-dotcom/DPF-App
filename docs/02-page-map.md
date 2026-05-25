# Page Map

This page is the implementation-facing index for the product brain in `docs/01-product-modules.md`. It maps each route to the current runtime component, user-facing capability, state source, and known product gap.

## Primary Pages

| Page | Route | Module | Runtime Component | Role Behavior | Main Capabilities | State Source | Current Gap |
|---|---|---|---|---|---|---|---|
| Brand Splash | `/brand-splash` | Auth & Onboarding | `app/brand-splash.tsx` | cold-start brand entry for guest, trader, and partner in local demo | Brand color background, centered white logo, restrained logo intro, automatic handoff to `/launch` | local animation timer | Release build required to verify native splash parity |
| Launch | `/launch` | Auth & Onboarding | `app/launch.tsx` | welcome and auth entry for guest, trader, and partner in local demo | Branded welcome page, login/register shortcuts, Apple sign-in unavailable feedback | static content, toast feedback | No production identity provider or Apple sign-in service |
| Home Markets | `/markets` | Markets & Instruments | `app/(tabs)/markets.tsx` | trader and partner see market context | Dupoin hero, quote status, account strip, top movers, copy signal preview, favorites, market brief | `BrokerStore`, `dupoinMvp` | No live CMS or production instrument service |
| Trade Workspace | `/trade` | Trading / Partner Tools | `app/(tabs)/trade.tsx` re-exports `app/(tabs)/portfolio.tsx` | trader sees positions/orders/history; partner sees client workspace | Position list, pending orders, history charts, close position, modify/delete pending order, Partner client list by role | `orders`, `positions`, `partnerClients` | No live execution, audit, or real client API |
| Account Workspace | `/accounts` | Account Assets / Partner Tools | `app/(tabs)/accounts.tsx` re-exports `app/(tabs)/account.tsx` | trader sees account list; partner sees commission workspace | Account overview, grouped account profiles, commission summary, commission details | `initialAccount`, `buildTradingAccountProfiles`, `commissions` | No real account, payment, or settlement API |
| Discover | `/discover` | Discover & Growth | `app/(tabs)/discover.tsx` | trader and partner share discovery surface; guest can browse public preview entries | Function entries, selected module state, copy signals, academy/challenge/support/risk cards, Partner preview | `dupoinMvp`, product settings, `discoverEntryDefinitions` | Placeholder modules are not backed by services |
| Instrument Detail | `/instrument/[id]` | Markets & Instruments | `app/instrument/[id].tsx` | trader and partner can inspect; trade buttons open ticket | Bid/ask, sparkline, day change, spread, leverage, margin sample, buy/sell footer | `findInstrument`, quote updates | No production quote freshness or session validation |
| Order Ticket | `/order/[id]` | Trading | `app/order/[id].tsx` | trader flow; guest/partner restrictions must be defined before production | Direction, order type, lot input, presets, notional/margin estimate, validation, local submit | `placeOrder`, `calculateMargin`, `calculateNotional` | No live order endpoint or server-side validation |
| Account Details | `/account-details/[id]` | Account Assets | `app/account-details/[id].tsx` | trader account drilldown; partner access must be scoped before production | Account metrics, margin gauge, action tiles, menu, position preview, closed PnL chart, PnL calendar | `buildTradingAccountProfiles`, `positions` | Actions are demo-only; no real ledger or mutation |
| Account Basic | `/account-basic/[id]` | Account Assets | `app/account-basic/[id].tsx` | trader account metadata drilldown | Trading account profile, identity/account details, status context | `buildTradingAccountProfiles` | No real KYC/account master data |
| Account Balance | `/account-balance/[id]` | Account Assets / Funding | `app/account-balance/[id].tsx` | trader balance drilldown | Balance overview, equity/free margin, funding trend | `buildTradingAccountProfiles`, demo funding data | No real ledger or cash movement |
| Account Orders | `/account-orders/[id]` | Account Assets / Trading | `app/account-orders/[id].tsx` | trader order history drilldown | Account-scoped order records | `orders`, account profile state | No production order history endpoint |
| Funding Home | `/funding` | Funding | `app/funding/index.tsx` | trader-only funding overview; guest redirects to auth | Eligible accounts, funding actions, recent records, demo risk banner | funding mocks, product settings | Funding is local simulation only |
| Funding Deposit | `/funding/deposit` | Funding | `app/funding/deposit.tsx` | trader-only demo deposit request | Account selection, IDR amount, method, FX/fee, acknowledgement | funding mocks, form state | No payment provider or ledger |
| Funding Withdrawal | `/funding/withdrawal` | Funding | `app/funding/withdrawal.tsx` | trader-only demo withdrawal request | Account selection, available balance, method, FX/fee, acknowledgement | funding mocks, form state | No payout/KYC provider |
| Funding Transfer | `/funding/transfer` | Funding | `app/funding/transfer.tsx` | trader-only demo transfer request | Source/target account, USD amount, ownership validation, acknowledgement | funding mocks, form state | No live internal ledger |
| Funding Transactions | `/funding/transactions` | Funding | `app/funding/transactions/index.tsx` | trader-only records list | Operation/status filters, account-scoped records, empty state | funding mocks | No transaction API |
| Funding Transaction Detail | `/funding/transactions/[id]` | Funding | `app/funding/transactions/[id].tsx` | trader-only transaction detail | Status timeline, amount, fee, FX, error/support reference | funding mocks | No provider reconciliation |
| Partner Tools | `/partner-tools` | Partner Tools / Discover & Growth | `app/(tabs)/partner-tools.tsx` | partner-focused function center, also accessible as hidden route | Growth/account/trading/service module grid, selected module summary, navigation shortcuts | selected discover module settings | No production permission or Partner service |
| Client Profile | `/client/[id]` | Partner Tools | `app/client/[id].tsx` | partner review page | Client status, role, net deposit, volume, open positions, upgrade request chat, approve action | `partnerClients`, `upgradeRequest` | No audit log, PII controls, or server persistence |
| Settings | `/settings` | Profile / Security | `app/settings/index.tsx` | signed-in user settings hub | Profile, appearance and security entry points | product settings | No production identity settings service |
| Security Login Log | `/settings/security-log` | Profile / Security | `app/settings/security-log.tsx` | signed-in user security visibility | Login devices, status and risk labels | local security log mocks | No real device/session audit endpoint |
| Appearance | `/appearance` | Profile / Settings | `app/appearance.tsx` | signed-in user visual preference | Theme and appearance selection | product settings | Local settings only |
| Discover Entry Preview | `/discover-entry/[id]` | Discover & Growth | `app/discover-entry/[id].tsx` | guest/trader/partner public preview route for configured entries | Placeholder/demo entry details, production note, return to discover | `discoverEntryDefinitions` | Not a live feature page |
| Onboarding | `/auth/onboarding` | Auth & Onboarding | `app/auth/onboarding.tsx` | guest entry; signed-in users can still view in local demo | Activation path, trader/partner choices, risk notice, register/login links | static onboarding content | No production onboarding/KYC workflow |
| Login | `/auth` | Auth & Onboarding | `app/auth/index.tsx` | guest sign-in page | Email/password validation, social unavailable toast, register/reset links | form state, route params | No real identity provider |
| Register Email | `/auth/register` | Auth & Onboarding | `app/auth/register.tsx` | guest account creation step 1 | Email validation, contact confirmation, email OTP handoff | form state, route params | No account creation API |
| Register Email Code | `/auth/register-email-code` | Auth & Onboarding | `app/auth/register-email-code.tsx` | guest account creation step 1 verification | Six-digit local email OTP, retry, resend countdown, change target | route params, local OTP state | No real email provider |
| Register Phone | `/auth/register-phone` | Auth & Onboarding | `app/auth/register-phone.tsx` | guest account creation step 2 | Country/phone capture, contact confirmation, leave-confirm recovery | route params, form state | No real SMS provider |
| Register Phone Code | `/auth/register-phone-code` | Auth & Onboarding | `app/auth/register-phone-code.tsx` | guest account creation step 2 verification | Six-digit local phone OTP, retry, resend countdown, change target | route params, local OTP state | No real SMS/MFA provider |
| Register Password | `/auth/register-password` | Auth & Onboarding | `app/auth/register-password.tsx` | guest account creation completion | Password rules, confirmation, local signed-in state | route params, product settings | No production account creation API or session token |
| PIN Setup / Unlock | `/auth/pin-setup` | Auth & Onboarding | `app/auth/pin-setup.tsx` | setup or unlock gate for local signed-in users | Local PIN create/confirm/unlock and skip path | product settings | Local-only PIN, not native secure storage |
| Forgot Password | `/auth/forgot-password` | Auth & Onboarding | `app/auth/forgot-password.tsx` | guest password help page | Email/account validation, reset sent state, back to login | form state | No reset email service |

## Hidden Redirects And Compatibility Routes

| Route | Runtime Component | Redirect / Behavior | Product Purpose |
|---|---|---|---|
| `/` | `app/index.tsx` | redirects to `/brand-splash` | Default cold-start brand entry alias |
| `/portfolio` | `app/(tabs)/portfolio.tsx` | hidden tab route used by `/trade` export | Compatibility alias for trader portfolio workspace |
| `/account` | `app/(tabs)/account.tsx` | hidden tab route used by `/accounts` export | Compatibility alias for account workspace |
| `/quick` | `app/(tabs)/quick.tsx` | redirects to `/`; tab button is status-only and prevents tab press | Bottom-tab status slot, not a standalone feature page |
| `/partner-tools` | `app/(tabs)/partner-tools.tsx` | hidden tab route | Partner/function-center entry outside visible tab bar |
| `/auth/verify` | `app/auth/verify.tsx` | deprecated route redirects to `/auth?redirect=...`; self-redirects fall back to `/markets` | Backward compatibility for old OTP links |

## Page Delivery Notes

- Runtime components must match actual Expo Router files, including re-export files and redirects.
- Pages with role-dependent behavior must document both trader and partner behavior before production release.
- Guest access to trading, account, funding, and Partner data must define redirect, restricted, or disabled behavior in the page spec.
- Discover placeholder cards must route to `/discover-entry/[id]` or an implemented page; no card may point to an unimplemented top-level route.
- Demo-only action sheets and placeholders must stay labeled as local simulation until backed by APIs.

## Required For New Pages

Each new production page must include:

- Page spec in `product-engineering-package/04_page_contracts/`.
- State spec with default, loading, empty, error, disabled, success, failed, permission, and restricted cases as applicable.
- Component usage mapping to `design-system-engineering/`.
- API contract or explicit local mock source.
- i18n key list.
- A11y, performance, security, and acceptance notes.
