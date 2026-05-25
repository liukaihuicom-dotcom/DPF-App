# Product Modules / Product Brain

## Product Positioning

Dupoin MVP is a mobile-first Expo SDK 54 app for simulated FX/CFD trading, account asset review, IB/Partner growth, product discovery, and local product operations. It is a demo product surface, not a live broker integration.

Runtime baseline: Expo SDK 54, Expo Router 6, React 19.1.0, React Native 0.81, React Native Web 0.21.0, and Node.js 20.19.x or newer.

## Product Brain Map

| Product Area | Primary Purpose | Primary Routes | Primary Roles | Current Runtime Source |
|---|---|---|---|---|
| Auth & Onboarding | Local sign-in, registration, password reset, first-week activation, risk acknowledgement | `/auth`, `/auth/register`, `/auth/register-email-code`, `/auth/register-phone`, `/auth/register-phone-code`, `/auth/register-password`, `/auth/pin-setup`, `/auth/forgot-password`, `/auth/onboarding` | guest, trader, partner | `ProductSettingsProvider`, local form state |
| Markets & Instruments | Watchlists, quote display, market brief, instrument detail, bid/ask trade entry | `/`, `/markets`, `/instrument/[id]` | trader, partner | `instruments`, quote proxy, `BrokerStore` |
| Trading Workspace | Order ticket, simulated order placement, open positions, pending orders, history, close/modify/delete demo actions | `/order/[id]`, `/trade`, `/portfolio` | trader | `orders`, `positions`, trading helpers |
| Account Assets | Demo balance, equity, margin, account profiles, account detail analytics, transaction preview | `/accounts`, `/account`, `/account-details/[id]`, `/account-basic/[id]`, `/account-balance/[id]`, `/account-orders/[id]` | trader, partner | `initialAccount`, `buildTradingAccountProfiles` |
| Funding | Demo deposit, withdrawal, transfer, and funding record review for trading accounts | `/funding`, `/funding/deposit`, `/funding/withdrawal`, `/funding/transfer`, `/funding/transactions`, `/funding/transactions/[id]` | trader | funding mocks, `services/fundingApi` |
| Discover & Growth | Function center, selected module status, copy signal preview, academy/challenge/support/reward placeholders | `/discover`, `/quick`, `/discover-entry/[id]`, `/discover-layout` | guest, trader, partner | `dupoinMvp`, selected discover module settings, `discoverEntryDefinitions` |
| Partner Tools | IB funnel, client profile, commission preview, upgrade request review and approval | `/partner-tools`, `/client/[id]` | partner | `partnerClients`, `partnerMetrics`, `commissions`, `upgradeRequest` |
| Product Console | Local role, auth, language, theme, account scenario, usage status controls | global web overlay | internal operator | `ProductControlPanel`, `ProductSettingsProvider` |

## Roles

| Role | Product Meaning | Main Capabilities | Current Boundary |
|---|---|---|---|
| guest | Visitor or unauthenticated demo user | View onboarding, login, register, forgot password, limited discovery entry | Guest order placement must redirect or be blocked before production |
| trader | Simulated trading user | View markets, open order tickets, place demo orders, review positions, manage demo accounts | Trading is local simulation only |
| partner | IB or partner user | Review client funnel, commission preview, Partner workspace, upgrade approvals | Client data and approvals are mock/local state |
| internal operator | Local product reviewer | Switch role, auth status, theme, language, account state scenario, usage override | Web-only development overlay, not customer-facing |

## Core Business Objects

| Object | Product Meaning | Current Source | Production Gap |
|---|---|---|---|
| `Instrument` | Tradable FX, metals, futures, and stock CFD contract with bid/ask, spread, leverage, trading hours, sparkline | `src/domain/mockData.ts`, quote proxy updates | Live instrument API, quote freshness, market session rules |
| `Order` | Simulated market or limit order | `BrokerStore.placeOrder`, `src/domain/trading.ts` | Server-side order validation, idempotency, audit IDs |
| `Position` | Local position created from filled market orders | `createPosition`, `refreshPositions` | Real position endpoints, lifecycle reconciliation |
| `Account` | Demo balance, equity, credit, margin, transactions | `initialAccount`, `recalculateAccount` | Real account API, payment ledger, custody and compliance checks |
| `Transaction` | Demo deposit, withdrawal, or adjustment record | `initialAccount.transactions` | Real deposit/withdrawal/payment workflows |
| `PartnerClient` | Mock IB client profile and activation status | `partnerClients` | Real partner client API, privacy controls, permissions |
| `UpgradeRequest` | Trader-to-partner upgrade application and review thread | local state plus web `localStorage` persistence | Workflow audit trail, notification, server persistence |
| `Commission` | Partner commission preview by client, symbol, volume, rate, status | `commissions` mock data | Settlement, statement, tax/reporting integration |
| `ProductSettings` | Local product state for auth, role, locale, theme, selected module, account scenario | `ProductSettingsProvider` plus web `localStorage` | Production auth/session and feature flag service |

## Module Details

### Auth & Onboarding

- Target users: guest, trader, partner.
- Entry routes: `/auth/onboarding`, `/auth`, `/auth/register`, `/auth/register-email-code`, `/auth/register-phone`, `/auth/register-phone-code`, `/auth/register-password`, `/auth/pin-setup`, `/auth/forgot-password`; `/auth/verify` is deprecated compatibility only.
- Implemented functions: onboarding path, trader/partner choice cards, first-week activation preview, login validation, email capture, local email OTP verification, phone capture, local phone OTP verification, password rules, local PIN setup/unlock, password reset sent state, local auth status switch to `signedIn`.
- Core actions: start onboarding, register, confirm email, verify email OTP, confirm phone, verify phone OTP, create password, set or unlock PIN, log in, request reset, return to login.
- State source: local React form state, route params, and `ProductSettingsProvider.authStatus`.
- Current gaps: no real identity provider, email/SMS/MFA provider, session token, password email, suitability review, native secure storage, or live KYC.

### Markets & Instruments

- Target users: trader, partner.
- Entry routes: `/`, `/markets`, `/instrument/[id]`.
- Implemented functions: Dupoin market hero, account strip, top movers, favorite watchlist, copy signal preview, market brief cards, quote connection status, instrument detail, bid/ask display, sparkline, spread/leverage/day range/contract size/margin sample, buy/sell sticky trade entry.
- Core actions: open instrument detail, open buy or sell order ticket, jump to discovery or market shortcuts.
- State source: `instruments` mock data, WebSocket quote proxy on port `8091`, `applyQuote`, `getDisplayChange`.
- Current gaps: no production instrument catalog, no exchange/session calendar, no quote entitlement, no CMS-backed market content.

### Trading Workspace

- Target users: trader.
- Entry routes: `/trade`, `/portfolio`, `/order/[id]`.
- Implemented functions: order side selector, market/limit selector, lot input and presets, notional and margin estimate, insufficient-margin validation, local order submit, filled market order creates position, limit order enters pending state, positions tab, pending tab, history tab, close position confirmation, pending order modify/delete, demo position detail and action sheets.
- Core actions: place demo order, inspect position, close position, inspect pending order, modify pending order, delete pending order, review historical demo records.
- State source: `orders`, `positions`, `account`, `placeOrder`, `modifyOrder`, `deleteOrder`, `closePosition`, `refreshPositions`.
- Current gaps: no live execution, no server-side margin validation, no SL/TP editing, no quote freshness gate, no order audit trail, no real order history endpoint.

### Account Assets

- Target users: trader, partner.
- Entry routes: `/accounts`, `/account`, `/account-details/[id]`, `/account-basic/[id]`, `/account-balance/[id]`, `/account-orders/[id]`.
- Implemented functions: account overview, trading account profile groups, active/read-only/disabled/demo/archived scenarios, total equity/free margin/used margin/realized and floating PnL, account detail metrics, margin safety gauge, action tiles, account menu, position preview, closed PnL chart, PnL calendar, demo transactions.
- Partner behavior: `/accounts` renders commission workspace when role is `partner`.
- Core actions: open account detail, switch account scenario through product console, inspect account menu, view commission records as partner.
- State source: `initialAccount`, `buildTradingAccountProfiles`, `tradingAccountScenario`, `positions`.
- Current gaps: no real multi-account API, no live payment/deposit/withdrawal, no leverage change workflow, no bank/KYC data, no account archival or password mutation.

### Funding

- Target users: trader.
- Entry routes: `/funding`, `/funding/deposit`, `/funding/withdrawal`, `/funding/transfer`, `/funding/transactions`, `/funding/transactions/[id]`.
- Implemented functions: funding overview, eligible trading account selection, deposit/withdrawal/transfer demo forms, risk acknowledgement, transaction filters, transaction timeline and support reference display.
- Core actions: open funding home, submit demo deposit, submit demo withdrawal, submit demo transfer, inspect funding transaction detail.
- State source: funding mocks and local form state through `src/screens/funding/FundingScreens.tsx` and `src/services/fundingApi.ts`.
- Current gaps: no payment provider, payout provider, KYC provider, ledger service, provider reconciliation, or live mutation endpoint.

### Discover & Growth

- Target users: trader, partner.
- Entry routes: `/discover`, `/quick`, `/discover-entry/[id]`, `/discover-layout`.
- Implemented functions: function entry grid, selected module status, copy signal cards, follow placeholder, Dupoin Academy card, demo challenge card, support desk card, risk controls card, Partner preview stats, market brief cards, placeholder/demo entry preview, persistent selected module per role.
- Core actions: select discover module, jump to markets/order/accounts/onboarding/partner tools, preview unavailable modules through `/discover-entry/[id]` or toast.
- State source: `dupoinMvp` static content, `discoverEntryDefinitions`, and `selectedDiscoverModuleByRole`.
- Current gaps: no real copy-trading execution, no education CMS, no support backend, no rewards ledger, no community system.

### Partner Tools

- Target users: partner.
- Entry routes: `/partner-tools`, `/client/[id]`; partner role also changes `/trade` and `/accounts` behavior.
- Implemented functions: function center for growth/account/trading/service groups, partner client list through role-specific trade workspace, commission summary and details, client profile, upgrade request chat preview, approve pending upgrade request, role switch to partner after approval.
- Core actions: open client profile, approve upgrade request, inspect commission, switch selected module, navigate to partner-related shortcuts.
- State source: `partnerClients`, `partnerMetrics`, `commissions`, `upgradeRequest`, web `localStorage` for upgrade state.
- Current gaps: no production permission service, no client PII controls, no approval audit log, no settlement system, no Partner reporting API.

### Product Console

- Target users: internal operator.
- Entry surface: global web overlay inside root layout.
- Implemented functions: auth status control, role control, theme control, language control, account scenario control, trading usage status override, quote/account/order/position usage summary, guest shortcut to onboarding.
- Core actions: change demo state for QA and product review.
- State source: `ProductSettingsProvider`, `BrokerStore`, web `localStorage`.
- Current gaps: must remain non-production; production feature flags, admin permissions, and monitoring are not connected.

## Production Guardrails

- The app is currently an MVP simulation. No real trading, payment, KYC, account opening, commission settlement, or investment service is connected.
- All financial actions must keep demo/local-state wording until live APIs, auth, quote freshness, audit IDs, server-side risk checks, and compliance gates exist.
- New production pages must start from a page spec, state matrix, API contract or mock source, i18n list, accessibility notes, security/risk notes, and acceptance criteria.
