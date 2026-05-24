# Business Rules

## Trading Rules

| Rule | Source | UI Implication |
|---|---|---|
| Order lots must be greater than 0 | `app/order/[id].tsx`, `src/domain/trading.ts` | Disable submit and show validation copy |
| Market order fills at current ask for buy and bid for sell | `getTradePrice` | Display fill price and margin before submit |
| Limit order is pending in local simulation | `createOrder` | Show pending state and allow modify or delete |
| Margin required equals notional divided by leverage | `calculateMargin` | Show estimated margin and insufficient margin state |
| Position PnL refreshes from latest quote | `refreshPositions` | Position lists must tolerate connecting, connected, failed quote states |
| Closing a position realizes current unrealized PnL into balance | `closePosition` | Require confirmation for future real-money mode |

## Account Rules

- Account equity equals balance plus credit plus unrealized PnL.
- Free margin equals equity minus used margin.
- Margin level is 0 when no margin is used.
- Demo transactions can be completed, reviewing, or rejected.

## Partner Rules

- Upgrade request can be none, pending, approved, or rejected.
- A pending upgrade request cannot be resubmitted.
- Partner approval and rejection actions must be auditable before live integration.

