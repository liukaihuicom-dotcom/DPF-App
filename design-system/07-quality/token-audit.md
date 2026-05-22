# Token Audit

| Token Category | Status | Notes |
|---|---|---|
| Color | Exists | Runtime palette has semantic fields |
| Typography | Runtime export exists | `src/theme/tokens.ts` maps documented type scale for `AppText` and exceptional quote numbers |
| Spacing | Runtime export exists | `src/theme/tokens.ts` maps app spacing scale and layout defaults |
| Radius | Runtime export exists | `src/theme/tokens.ts` maps card, compact, sheet, and full radius |
| Shadow | Exists | `shadows.panel` only |
| Motion | Documented | Not centralized yet |
| Z-index | Documented | Not centralized yet |
| Breakpoint | Documented | Not centralized yet |

## QA Gate

- `qa:style` fails on raw color syntax outside token sources.
- `qa:style` fails on page/component typography literals outside `src/theme/tokens.ts` and `AppText`.
- `qa:style` fails on direct `TextInput` usage outside shared input wrappers.
