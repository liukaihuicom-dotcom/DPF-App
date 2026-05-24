# Token Audit

| Token Category | Status | Notes |
|---|---|---|
| Color | Exists | Runtime palette has semantic fields |
| Typography | Runtime export exists | `src/theme/tokens.ts` maps documented type scale for `AppText` and exceptional quote numbers |
| Spacing | Runtime export exists | `src/theme/tokens.ts` maps app spacing scale and layout defaults |
| Size | Runtime export exists | `src/theme/tokens.ts` maps control, input, button, tag, tab, icon, touch, sheet, viewport, and surface dimensions |
| Line Width | Runtime export exists | `src/theme/tokens.ts` maps ordinary UI borders and dividers to 0.5px hairlines |
| Radius | Runtime export exists | `src/theme/tokens.ts` maps card, compact, sheet, and full radius |
| Shadow | Exists | `shadows.panel`, `shadows.dialog`, and `shadows.toast` |
| Motion | Documented | Not centralized yet |
| Z-index | Documented | Not centralized yet |
| Breakpoint | Documented | Not centralized yet |

## QA Gate

- `qa:style` fails on raw color syntax outside token sources.
- `qa:style` fails on page/component typography literals outside `src/theme/tokens.ts` and `AppText`.
- `qa:style` fails on direct `TextInput` usage outside shared input wrappers.
- `qa:style` fails on new page-level `AppText style.color` usage outside registered text color exception files.
- `qa:style` fails on new hardcoded `padding`, `margin`, or `gap` values outside registered spacing exception files and legacy migration baseline.
- `qa:style` fails on new hardcoded `height`, `width`, `minHeight`, `minWidth`, `maxHeight`, or `maxWidth` values outside registered size exception files and legacy migration baseline.
- `qa:style` fails on new hardcoded ordinary line widths such as `borderWidth: 1`, `borderBottomWidth: 1`, `height: 1`, or `width: 1` outside registered line-width exceptions and legacy migration baseline.
- Page text must use `AppText tone` for primary, secondary, tertiary, status, market, and informational colors.
- Status text color must map to a traceable business state; decorative use of `brand`, `amber`, `danger`, `up`, or `down` is a design-system QA failure.
- Inverse text is component-owned. Direct `palette.white` or `palette.panel` text in page code must be migrated into a shared component or documented exception.
- Page, component, sheet, form, list, card, footer, and operation-area spacing must resolve to `spacing` or `layout` tokens.
- Component height, width, min/max constraints, icon size, touch targets, sheet height, tabbar height, and viewport width must resolve to `size`, `layout`, component props, or documented pattern tokens.
- Ordinary card, input, button, list, sheet, footer, and viewport line thickness must resolve to `lineWidth.hairline`.
- Ordinary page flow should use parent `gap`; child `marginTop` and `marginBottom` require a layout reason.

## Text Color Exceptions

Allowed component-owned foreground exceptions:

- `src/components/ActionButton.tsx`
- `src/components/StatusPill.tsx`
- `src/components/TextField.tsx`
- `src/feedback/Toast.tsx`
- `src/components/AuthShell.tsx`
- `src/components/UpgradeChatCard.tsx`
- `src/components/ProductControlPanel.tsx`
- `src/components/CurrencyFlag.tsx`

These exceptions must not be copied into page code. If a new component needs inverse or dynamic foreground color, document the component behavior before adding the exception.

## Spacing Exceptions

Allowed component-owned spacing exceptions:

- `src/components/ActionButton.tsx`
- `src/components/AppTopBar.tsx`
- `src/components/AuthShell.tsx`
- `src/components/BackBar.tsx`
- `src/components/BottomSheet.tsx`
- `src/components/FundActionGrid.tsx`
- `src/components/Header.tsx`
- `src/components/InstrumentRow.tsx`
- `src/components/KeyValueList.tsx`
- `src/components/Metric.tsx`
- `src/components/ProductControlPanel.tsx`
- `src/components/QuickActionSheet.tsx`
- `src/components/Screen.tsx`
- `src/components/StatusPill.tsx`
- `src/components/TextField.tsx`
- `src/components/TradingAccountSwitchSheet.tsx`
- `src/components/UpgradeChatCard.tsx`
- `src/feedback/Toast.tsx`

These exceptions represent current component-owned spacing and must be migrated toward `spacing` or `layout` tokens as components are touched.

## Size Exceptions

Allowed component-owned size exceptions:

- `src/components/ActionButton.tsx`
- `src/components/AppTopBar.tsx`
- `src/components/AppViewport.tsx`
- `src/components/AuthShell.tsx`
- `src/components/BottomSheet.tsx`
- `src/components/FundActionGrid.tsx`
- `src/components/GlobalMenuList.tsx`
- `src/components/InstrumentIcon.tsx`
- `src/components/InstrumentRow.tsx`
- `src/components/KeyValueList.tsx`
- `src/components/Metric.tsx`
- `src/components/ProductControlPanel.tsx`
- `src/components/QuickActionSheet.tsx`
- `src/components/StatusPill.tsx`
- `src/components/TextField.tsx`
- `src/components/TradingAccountSwitchSheet.tsx`
- `src/components/UpgradeChatCard.tsx`
- `src/feedback/Toast.tsx`

These exceptions represent current component-owned dimensions, chart/visualization dimensions, or flex utility values. Migrate stable control dimensions toward `size` as components are touched.

## Line Width Exceptions

Allowed component-owned line-width exceptions:

- `app/appearance.tsx`
- `src/components/InstrumentIcon.tsx`
- `src/components/TradingAccountSwitchSheet.tsx`

These exceptions represent selected-state controls, preview swatches, or instrument medallion emphasis. Ordinary UI borders in these files should still use `lineWidth.hairline`; only declared selected/visual emphasis may use `lineWidth.strong` or `lineWidth.selected`.

Icon registry stroke widths, SVG/chart strokes, canvas strokes, and brand illustration strokes are governed separately and must not be migrated to page border tokens.

## Legacy Text Color Migration Baseline

The following existing pages still contain direct `AppText style.color` usage and are temporarily treated as migration backlog so the QA gate can protect new work without blocking the current baseline:

- `app/(tabs)/markets.tsx`
- `app/(tabs)/portfolio.tsx`
- `app/(tabs)/quick.tsx`
- `app/account-balance/[id].tsx`
- `app/auth/onboarding.tsx`
- `app/instrument/[id].tsx`
- `app/launch.tsx`

Do not add new files to this baseline without a design-system review. When these pages are touched for UI work, migrate ordinary text to `AppText tone` and keep inverse foreground inside shared components.

## Legacy Spacing Migration Baseline

The following existing pages still contain hardcoded spacing and are temporarily treated as migration backlog so the QA gate can protect new work without blocking the current baseline:

- `app/(tabs)/_layout.tsx`
- `app/(tabs)/account.tsx`
- `app/(tabs)/discover.tsx`
- `app/(tabs)/markets.tsx`
- `app/(tabs)/partner-tools.tsx`
- `app/(tabs)/portfolio.tsx`
- `app/(tabs)/quick.tsx`
- `app/+not-found.tsx`
- `app/account-details/[id].tsx`
- `app/appearance.tsx`
- `app/auth/account-review.tsx`
- `app/auth/forgot-password.tsx`
- `app/auth/index.tsx`
- `app/auth/onboarding.tsx`
- `app/auth/register.tsx`
- `app/auth/verify.tsx`
- `app/client/[id].tsx`
- `app/instrument/[id].tsx`
- `app/order/[id].tsx`

Do not add new files to this baseline without design-system review. When these pages are touched, migrate ordinary `padding`, `margin`, and `gap` to `spacing` or `layout` tokens and keep absolute offsets inside documented components or patterns.

## Legacy Size Migration Baseline

The following existing pages still contain hardcoded size dimensions and are temporarily treated as migration backlog so the QA gate can protect new work without blocking the current baseline:

- `app/(tabs)/_layout.tsx`
- `app/(tabs)/account.tsx`
- `app/(tabs)/discover.tsx`
- `app/(tabs)/markets.tsx`
- `app/(tabs)/partner-tools.tsx`
- `app/(tabs)/portfolio.tsx`
- `app/(tabs)/quick.tsx`
- `app/account-balance/[id].tsx`
- `app/account-basic/[id].tsx`
- `app/account-details/[id].tsx`
- `app/appearance.tsx`
- `app/auth/account-review.tsx`
- `app/auth/forgot-password.tsx`
- `app/auth/index.tsx`
- `app/auth/onboarding.tsx`
- `app/auth/register.tsx`
- `app/auth/verify.tsx`
- `app/client/[id].tsx`
- `app/discover-layout.tsx`
- `app/instrument/[id].tsx`
- `app/launch.tsx`
- `app/order/[id].tsx`

Do not add new files to this baseline without design-system review. When these pages are touched, migrate stable `height`, `width`, `minHeight`, `minWidth`, `maxHeight`, and `maxWidth` to `size`, `layout`, component props, or documented pattern tokens.
