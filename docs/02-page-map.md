# Page Map

This page is the implementation-facing index for the product brain in `docs/01-product-modules.md`. It maps each route to the current runtime component, user-facing capability, state source, and known product gap.

## Primary Pages

| Page | Route | Module | Runtime Component | Role Behavior | Main Capabilities | State Source | Current Gap |
|---|---|---|---|---|---|---|---|
| Launch | `/launch` | Auth & Onboarding | `app/launch.tsx` | default app entry for guest, trader, and partner in local demo | Branded welcome page, login/register shortcuts, Apple sign-in unavailable feedback | static content, toast feedback | No production identity provider or Apple sign-in service |
| Home Markets | `/markets` | Markets & Instruments | `app/(tabs)/markets.tsx` | trader and partner see market context | Dupoin hero, quote status, account strip, top movers, copy signal preview, favorites, market brief | `BrokerStore`, `dupoinMvp` | No live CMS or production instrument service |
| Trade Workspace | `/trade` | Trading / Partner Tools | `app/(tabs)/trade.tsx` re-exports `app/(tabs)/portfolio.tsx` | trader sees positions/orders/history; partner sees client workspace | Position list, pending orders, history charts, close position, modify/delete pending order, Partner client list by role | `orders`, `positions`, `partnerClients` | No live execution, audit, or real client API |
| Account Workspace | `/accounts` | Account Assets / Partner Tools | `app/(tabs)/accounts.tsx` re-exports `app/(tabs)/account.tsx` | trader sees account list; partner sees commission workspace | Account overview, grouped account profiles, commission summary, commission details | `initialAccount`, `buildTradingAccountProfiles`, `commissions` | No real account, payment, or settlement API |
| Discover | `/discover` | Discover & Growth | `app/(tabs)/discover.tsx` | trader and partner share discovery surface | Function entries, selected module state, copy signals, academy/challenge/support/risk cards, Partner preview | `dupoinMvp`, product settings | Placeholder modules are not backed by services |
| Instrument Detail | `/instrument/[id]` | Markets & Instruments | `app/instrument/[id].tsx` | trader and partner can inspect; trade buttons open ticket | Bid/ask, sparkline, day change, spread, leverage, margin sample, buy/sell footer | `findInstrument`, quote updates | No production quote freshness or session validation |
| Order Ticket | `/order/[id]` | Trading | `app/order/[id].tsx` | trader flow; guest/partner restrictions must be defined before production | Direction, order type, lot input, presets, notional/margin estimate, validation, local submit | `placeOrder`, `calculateMargin`, `calculateNotional` | No live order endpoint or server-side validation |
| Account Details | `/account-details/[id]` | Account Assets | `app/account-details/[id].tsx` | trader account drilldown; partner access must be scoped before production | Account metrics, margin gauge, action tiles, menu, position preview, closed PnL chart, PnL calendar | `buildTradingAccountProfiles`, `positions` | Actions are demo-only; no real ledger or mutation |
| Partner Tools | `/partner-tools` | Partner Tools / Discover & Growth | `app/(tabs)/partner-tools.tsx` | partner-focused function center, also accessible as hidden route | Growth/account/trading/service module grid, selected module summary, navigation shortcuts | selected discover module settings | No production permission or Partner service |
| Client Profile | `/client/[id]` | Partner Tools | `app/client/[id].tsx` | partner review page | Client status, role, net deposit, volume, open positions, upgrade request chat, approve action | `partnerClients`, `upgradeRequest` | No audit log, PII controls, or server persistence |
| Onboarding | `/auth/onboarding` | Auth & Onboarding | `app/auth/onboarding.tsx` | guest entry; signed-in users can still view in local demo | Activation path, trader/partner choices, risk notice, register/login links | static onboarding content | No production onboarding/KYC workflow |
| Login | `/auth` | Auth & Onboarding | `app/auth/index.tsx` | guest sign-in page | Email/password validation, verification handoff, social unavailable toast, register/reset links | form state, verify route params | No real identity provider |
| Register | `/auth/register` | Auth & Onboarding | `app/auth/register.tsx` | guest account creation page | Email/password/confirm validation, invite code, risk checkbox, verification handoff | form state, verify route params | No account creation API or risk record |
| Auth Verification | `/auth/verify` | Auth & Onboarding | `app/auth/verify.tsx` | guest login/register verification step | Six-digit local OTP, retry, resend countdown, login or account-review routing | route params, local code state, `setAuthStatus` | No real email/SMS/MFA provider |
| Account Review | `/auth/account-review` | Auth & Onboarding | `app/auth/account-review.tsx` | guest account-opening confirmation | Email verified state, risk confirmation, KYC placeholder, activate demo account | route params, `setAuthStatus` | No real KYC, suitability, or account-opening service |
| Forgot Password | `/auth/forgot-password` | Auth & Onboarding | `app/auth/forgot-password.tsx` | guest password help page | Email validation, reset sent state, back to login | form state | No reset email service |

## Hidden Redirects And Compatibility Routes

| Route | Runtime Component | Redirect / Behavior | Product Purpose |
|---|---|---|---|
| `/` | `app/(tabs)/index.tsx` | redirects to `/launch` | Default app entry alias |
| `/portfolio` | `app/(tabs)/portfolio.tsx` | hidden tab route used by `/trade` export | Compatibility alias for trader portfolio workspace |
| `/account` | `app/(tabs)/account.tsx` | hidden tab route used by `/accounts` export | Compatibility alias for account workspace |
| `/quick` | `app/(tabs)/quick.tsx` | redirects to `/`; tab button is status-only and prevents tab press | Bottom-tab status slot, not a standalone feature page |
| `/partner-tools` | `app/(tabs)/partner-tools.tsx` | hidden tab route | Partner/function-center entry outside visible tab bar |

## Page Delivery Notes

- Runtime components must match actual Expo Router files, including re-export files and redirects.
- Pages with role-dependent behavior must document both trader and partner behavior before production release.
- Guest access to trading, account, and Partner data must define redirect, restricted, or disabled behavior in the page spec.
- Demo-only action sheets and placeholders must stay labeled as local simulation until backed by APIs.

## Required For New Pages

Each new production page must include:

- Page spec in `handoff/`.
- State spec with default, loading, empty, error, disabled, success, failed, permission, and restricted cases as applicable.
- Component usage mapping to `design-system/`.
- API contract or explicit local mock source.
- i18n key list.
- A11y, performance, security, and acceptance notes.
