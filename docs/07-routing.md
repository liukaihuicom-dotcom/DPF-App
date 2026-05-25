# Routing

## Runtime

- Router: Expo Router 6.
- Entry: `expo-router/entry`.
- Root stack: `app/_layout.tsx`, implemented by `src/screens/navigation/RootLayout.tsx`.
- Tab stack: `app/(tabs)/_layout.tsx`, implemented by `src/screens/navigation/TabLayout.tsx`.
- Runtime baseline follows Expo SDK 54.

Expo Router uses file-based routes under `app/`. The root `_layout.tsx` hosts the stack navigator, and `(tabs)/_layout.tsx` hosts the bottom tab navigator. Stack routes are registered deliberately so route governance, presentation options, and documentation remain aligned with the runtime file tree.

## Route Groups

| Group | Routes | Purpose |
|---|---|---|
| Root stack | `index`, `brand-splash`, `launch`, `auth/*`, `instrument/[id]`, `order/[id]`, `client/[id]`, `account-*/*`, `funding/*`, `settings/*`, `appearance`, `discover-entry/[id]`, `discover-layout` | Page-level screens outside persistent tab navigation |
| Visible tabs | `markets`, `trade`, `accounts`, `discover`, `quick` | Primary mobile navigation and status slot |
| Hidden tab routes | `portfolio`, `account`, `partner-tools` | Compatibility aliases and role-specific entry points |
| Deprecated compatibility | `auth/verify` | Redirects older verification deep links to `/auth` with a sanitized redirect |

## Route Map

| Route | Runtime File | Navigation Behavior |
|---|---|---|
| `/` | `app/index.tsx` | Redirects to `/brand-splash` |
| `/brand-splash` | `app/brand-splash.tsx` | Cold-start brand splash with centered white logo, then redirects to `/launch` |
| `/launch` | `app/launch.tsx` | Welcome entry with login, register, and Apple sign-in unavailable feedback |
| `/markets` | `app/(tabs)/markets.tsx` | Market home tab |
| `/trade` | `app/(tabs)/trade.tsx` -> `app/(tabs)/portfolio.tsx` | Trader portfolio workspace or partner client workspace by role |
| `/accounts` | `app/(tabs)/accounts.tsx` -> `app/(tabs)/account.tsx` | Trader account workspace or partner commission workspace by role |
| `/discover` | `app/(tabs)/discover.tsx` | Discover and growth tab |
| `/quick` | `app/(tabs)/quick.tsx` | Redirects to `/`; visible tab button is a non-navigating status indicator |
| `/portfolio` | `app/(tabs)/portfolio.tsx` | Hidden direct route for the portfolio implementation |
| `/account` | `app/(tabs)/account.tsx` | Hidden direct route for the account implementation |
| `/partner-tools` | `app/(tabs)/partner-tools.tsx` | Hidden direct route for the Partner/function-center implementation |
| `/instrument/[id]` | `app/instrument/[id].tsx` | Root stack detail page with invalid-id fallback |
| `/order/[id]` | `app/order/[id].tsx` | Root stack order ticket with optional `direction` query param and invalid-id fallback |
| `/account-details/[id]` | `app/account-details/[id].tsx` | Root stack account detail page |
| `/account-basic/[id]` | `app/account-basic/[id].tsx` | Root stack account basic information page |
| `/account-balance/[id]` | `app/account-balance/[id].tsx` | Root stack account balance and funding trend page |
| `/account-orders/[id]` | `app/account-orders/[id].tsx` | Root stack account order records page |
| `/funding` | `app/funding/index.tsx` | Root stack funding home with demo-only risk banner and recent records |
| `/funding/deposit` | `app/funding/deposit.tsx` | Root stack demo deposit request page |
| `/funding/withdrawal` | `app/funding/withdrawal.tsx` | Root stack demo withdrawal request page |
| `/funding/transfer` | `app/funding/transfer.tsx` | Root stack demo internal transfer request page |
| `/funding/transactions` | `app/funding/transactions/index.tsx` | Root stack funding records list with filters |
| `/funding/transactions/[id]` | `app/funding/transactions/[id].tsx` | Root stack funding transaction detail page |
| `/client/[id]` | `app/client/[id].tsx` | Root stack Partner client profile with invalid-id fallback |
| `/settings` | `app/settings/index.tsx` | Root stack settings profile and security entry |
| `/settings/security-log` | `app/settings/security-log.tsx` | Root stack security login log page |
| `/appearance` | `app/appearance.tsx` | Root stack appearance settings page |
| `/discover-entry/[id]` | `app/discover-entry/[id].tsx` | Root stack discover entry preview for placeholder/demo features |
| `/discover-layout` | `app/discover-layout.tsx` | Root stack visual layout preview modal |
| `/auth/onboarding` | `app/auth/onboarding.tsx` | Root stack onboarding flow |
| `/auth` | `app/auth/index.tsx` | Root stack login page |
| `/auth/register` | `app/auth/register.tsx` | Root stack email registration entry |
| `/auth/register-email-code` | `app/auth/register-email-code.tsx` | Root stack email OTP step |
| `/auth/register-phone` | `app/auth/register-phone.tsx` | Root stack phone collection step |
| `/auth/register-phone-code` | `app/auth/register-phone-code.tsx` | Root stack phone OTP step |
| `/auth/register-password` | `app/auth/register-password.tsx` | Root stack password setup and local sign-in completion |
| `/auth/pin-setup` | `app/auth/pin-setup.tsx` | Root stack local PIN setup or unlock gate |
| `/auth/forgot-password` | `app/auth/forgot-password.tsx` | Root stack password reset page |
| `/auth/verify` | `app/auth/verify.tsx` | Deprecated compatibility route; redirects to `/auth?redirect=...` |

## Role Switching Behavior

- `/trade` renders `TraderPortfolioScreen` for `role=trader` and `PartnerClientsScreen` for `role=partner`.
- `/accounts` renders `TraderAccountsScreen` for `role=trader` and `CommissionScreen` for `role=partner`.
- Product console role changes are local development controls. Production role switching must come from authenticated permissions.
- Partner routes must not expose real client data until production permission checks, privacy rules, and audit logging exist.

## Auth And Public Route Rules

- Guest users can access `/`, `/brand-splash`, `/launch`, `/discover`, `/discover-layout`, `/discover-entry/[id]`, `/auth`, and current auth child routes.
- Protected routes redirect guests to `/auth?redirect=<current path>`.
- `/auth/verify` exists only for old deep links and must not be used by new login or registration flows.
- Redirect parameters are sanitized by `safeRedirect`; deprecated `/auth/verify` redirects fall back to `/markets` to avoid route loops.

## Route Rules

- New routes must be added to the root stack or tab layout deliberately.
- Protected routes must define guest behavior in page spec.
- Deep links into dynamic detail pages must handle invalid IDs.
- Back behavior must use Expo Router and preserve mobile expectations.
- Hidden routes must remain documented in `docs/02-page-map.md` so aliases and redirects do not become accidental product surfaces.
