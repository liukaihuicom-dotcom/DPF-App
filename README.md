# Dupoin MVP

Production-oriented Expo SDK 54 app scaffold for a simulated FX/CFD broker experience.

## Runtime

| Area | Version |
|---|---|
| Expo SDK | 54 |
| Expo Router | 6 |
| React | 19.1 |
| React Native | 0.81 |
| React Native Web | 0.21 |

Expo SDK 54 requires Node.js 20.19.x or newer in the SDK reference.

## Directory Map

| Path | Purpose |
|---|---|
| `app/` | Expo Router screens and route groups |
| `src/` | Production app source: components, domain, state, i18n, theme, feedback |
| `assets/` | Runtime app assets referenced by Expo config |
| `docs/` | Product delivery model, roles, rules, state, routing, risk, release notes |
| `design-system/` | Token, component, business component, pattern, platform, and quality governance |
| `api-contracts/` | OpenAPI scaffold, JSON schemas, error codes, mocks, API mapping |
| `handoff/` | Page delivery templates and future page-specific handoff packages |
| `qa/` | QA gate metadata and visual verification artifacts |
| `scripts/dev/` | Local development utilities |
| `scripts/qa/` | Executable production delivery checks |
| `tests/` | Test strategy and future automated tests |
| `archive/` | Deprecated or legacy assets excluded from runtime builds |

## Commands

```sh
pnpm start
pnpm start:expo
pnpm quote-proxy
pnpm qa:all
pnpm exec tsc --noEmit
```

## Production Delivery Rule

Before adding a new production page, create a handoff package from `handoff/templates/`, map it to `docs/`, `design-system/`, and `api-contracts/`, then run `pnpm qa:all`.
