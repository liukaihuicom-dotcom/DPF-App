# User Roles

| Role | Description | Entry Conditions | Primary Capabilities |
|---|---|---|---|
| guest | Visitor in local demo mode | `authStatus=guest` | View onboarding, login, register, password help, limited discovery |
| trader | Simulated trading user | `authStatus=signedIn`, `role=trader` | View markets, place demo orders, review margin, manage demo positions |
| partner | IB or partner user | `authStatus=signedIn`, `role=partner` | Review client funnel, commission, upgrade requests, partner tools |
| internal operator | Local product console user | Local dev overlay only | Change role, language, theme, auth status, selected discover module |

## Role Rules

- Guest access must never trigger simulated order placement.
- Trader flows must expose risk copy before order actions.
- Partner tools must not expose real personal, payment, KYC, or bank information in local storage.
- Internal operator controls are development controls and must not be treated as customer-facing features.

