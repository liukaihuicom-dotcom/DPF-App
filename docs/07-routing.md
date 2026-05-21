# Routing

## Runtime

- Router: Expo Router 6.
- Entry: `expo-router/entry`.
- Root stack: `app/_layout.tsx`.
- Tab stack: `app/(tabs)/_layout.tsx`.
- Runtime baseline follows Expo SDK 54.

## Route Groups

| Group | Routes | Purpose |
|---|---|---|
| Root stack | `auth/onboarding`, `auth/index`, `auth/register`, `auth/forgot-password`, `instrument/[id]`, `order/[id]`, `client/[id]`, `account-details/[id]` | Page-level screens outside persistent tab navigation |
| Visible tabs | `index`, `trade`, `accounts`, `discover`, `quick` | Primary mobile navigation and status slot |
| Hidden tab routes | `markets`, `portfolio`, `account`, `partner-tools` | Compatibility aliases and role-specific entry points |

## Route Map

| Route | Runtime File | Navigation Behavior |
|---|---|---|
| `/` | `app/(tabs)/index.tsx` | Market home tab |
| `/trade` | `app/(tabs)/trade.tsx` -> `app/(tabs)/portfolio.tsx` | Trader portfolio workspace or partner client workspace by role |
| `/accounts` | `app/(tabs)/accounts.tsx` -> `app/(tabs)/account.tsx` | Trader account workspace or partner commission workspace by role |
| `/discover` | `app/(tabs)/discover.tsx` | Discover and growth tab |
| `/quick` | `app/(tabs)/quick.tsx` | Redirects to `/`; visible tab button is a non-navigating status indicator |
| `/markets` | `app/(tabs)/markets.tsx` | Redirects to `/` |
| `/portfolio` | `app/(tabs)/portfolio.tsx` | Hidden direct route for the portfolio implementation |
| `/account` | `app/(tabs)/account.tsx` | Hidden direct route for the account implementation |
| `/partner-tools` | `app/(tabs)/partner-tools.tsx` | Hidden direct route for the Partner/function-center implementation |
| `/instrument/[id]` | `app/instrument/[id].tsx` | Root stack detail page with invalid-id fallback |
| `/order/[id]` | `app/order/[id].tsx` | Root stack order ticket with optional `direction` query param and invalid-id fallback |
| `/account-details/[id]` | `app/account-details/[id].tsx` | Root stack account detail page |
| `/client/[id]` | `app/client/[id].tsx` | Root stack Partner client profile with invalid-id fallback |
| `/auth/onboarding` | `app/auth/onboarding.tsx` | Root stack onboarding flow |
| `/auth` | `app/auth/index.tsx` | Root stack login page |
| `/auth/register` | `app/auth/register.tsx` | Root stack registration page |
| `/auth/forgot-password` | `app/auth/forgot-password.tsx` | Root stack password reset page |

## Role Switching Behavior

- `/trade` renders `TraderPortfolioScreen` for `role=trader` and `PartnerClientsScreen` for `role=partner`.
- `/accounts` renders `TraderAccountsScreen` for `role=trader` and `CommissionScreen` for `role=partner`.
- Product console role changes are local development controls. Production role switching must come from authenticated permissions.
- Partner routes must not expose real client data until production permission checks, privacy rules, and audit logging exist.

## Route Rules

- New routes must be added to the root stack or tab layout deliberately.
- Protected routes must define guest behavior in page spec.
- Deep links into order or client pages must handle invalid IDs.
- Back behavior must use Expo Router and preserve mobile expectations.
- Hidden routes must remain documented in `docs/02-page-map.md` so aliases and redirects do not become accidental product surfaces.
