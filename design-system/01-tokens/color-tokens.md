# Color Tokens

## Source Of Truth

Color now has a standards-oriented token source and a TypeScript runtime:

| Layer | File | Use |
|---|---|---|
| DTCG source | `design-system-engineering/01_tokens/tokens.color.json` | Machine-readable L1/L2 color tokens for Figma, Web, Admin, and app governance |
| Mode matrix | `design-system-engineering/01_tokens/token-mode.matrix.json` | Required theme coverage for `lightBroker`, `darkTerminal`, and `midnightBlue` |
| Runtime | `src/theme/colors.ts` | React Native `ThemeColors`, `themeColors`, `colorPrimitives`, and deprecated compatibility aliases |
| CSS mapping | `design-system-engineering/08_code_mapping/css-variable.mapping.css` | Web/Admin CSS custom properties |
| Tailwind mapping | `design-system-engineering/08_code_mapping/tailwind.mapping.js` | Tailwind extension map backed by CSS variables |

Pages and components must consume `useThemeColors()` and semantic `colors.*` paths. `ThemePalette`, `themePalettes`, `palette`, and `useThemePalette()` are deprecated compatibility exports only.

## L1 Primitive Ramps

Every primitive ramp uses the 11-step mainstream scale `50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950`.

| Ramp | Runtime Path | Primary Use |
|---|---|---|
| Neutral | `colorPrimitives.neutral.*` | Surfaces, text, borders, disabled states |
| Brand Teal | `colorPrimitives.brand.teal.*` | Dupoin brand, focus, selected states |
| Red | `colorPrimitives.red.*` | Danger, destructive, rejected, market up base |
| Green | `colorPrimitives.green.*` | Success, completed, market down base |
| Amber | `colorPrimitives.amber.*` | Warning, pending, review, caution |
| Blue | `colorPrimitives.blue.*` | Information, links, guidance, transfer |
| Cyan | `colorPrimitives.cyan.*` | Secondary accent and data visualization |
| Purple | `colorPrimitives.purple.*` | Chart categorical/data visualization |
| Market Up | `colorPrimitives.market.up.*` | China-style positive/up movement, red |
| Market Down | `colorPrimitives.market.down.*` | China-style negative/down movement, green |

`brand.teal.500` remains `#2EB5C4`.

## L2 Semantic Runtime

| Semantic Group | Runtime Path | Use |
|---|---|---|
| Surface | `colors.surface.canvas/panel/raised/subtle/disabled/inverse` | Page, card, sheet, control backgrounds |
| Text | `colors.text.primary/secondary/tertiary/disabled/link/inverse` | All text meaning and inverse text |
| Border | `colors.border.default/subtle/strong/focus/disabled` | Dividers, frames, focus, disabled edges |
| Brand | `colors.brand.fg/bg/border/solid/onSolid/active/disabled/launch` | Brand foreground, fill, focus, launch |
| Status | `colors.status.info/success/warning/danger/neutral` | Business states; every state has `fg/bg/border/solid/onSolid` |
| Market | `colors.market.up/down/flat` | Trading direction only; every state has `fg/bg/border/solid/onSolid` |
| Accent | `colors.accent.blue/cyan/purple` | Secondary accents and chart support |
| Overlay | `colors.overlay.*.subtle/muted/strong/scrim` | Tokenized transparency; no page-level color string concatenation |
| Chart | `colors.chart.categorical/sequential/diverging` | Financial charts and data visualization |

## Deprecated Alias Map

| Old Field | New Path |
|---|---|
| `bg` | `surface.canvas` |
| `panel` | `surface.panel` |
| `panelHigh` | `surface.raised` |
| `panelSoft` | `surface.subtle` |
| `line` | `border.default` |
| `lineSoft` | `border.subtle` |
| `text` | `text.primary` |
| `textMuted` | `text.secondary` |
| `textDim` | `text.tertiary` |
| `brand` | `brand.fg` |
| `amber` | `status.warning.fg` |
| `danger` | `status.danger.fg` |
| `blue` | `status.info.fg` |
| `up` | `market.up.fg` |
| `down` | `market.down.fg` |
| `disabledSurface` | `surface.disabled` |
| `disabledText` | `text.disabled` |
| `disabledBorder` | `border.disabled` |

## Text Color System

All text color decisions start from information meaning, not visual preference. Page builders choose typography with `AppText variant` and color with `AppText tone`.

| Text Token | Code Mapping | Allowed Use | Forbidden Use |
|---|---|---|---|
| text.primary | `AppText tone="default"` / `colors.text.primary` | Page titles, key fields, primary body, selected labels | Decorative emphasis or inverse text on filled surfaces |
| text.secondary | `AppText tone="muted"` / `colors.text.secondary` | Helper copy, subtitles, metadata, secondary body | Weakening required risk or legal text |
| text.tertiary | `AppText tone="dim"` / `colors.text.tertiary` | Eyebrow labels, placeholders, quiet metadata | Main body, active controls, important financial values |
| text.brand | `AppText tone="brand"` / `colors.brand.fg` | Current module, selected state, brand entry | Making ordinary headings brighter |
| text.warning | `AppText tone="amber"` / `colors.status.warning.fg` | Pending, review, caution, risk attention | Decorative labels |
| text.danger | `AppText tone="danger"` / `colors.status.danger.fg` | Error, failed, rejected, destructive action | Marketing urgency |
| text.up/down | `AppText tone="up/down"` / `colors.market.*.fg` | Market movement, PnL, trade direction | Generic success/failure |
| text.info | `AppText tone="blue"` / `colors.status.info.fg` | Informational hints, links, guidance | Arbitrary visual variety |
| text.inverse | component-owned foreground | Filled buttons, toast/status fills, logo marks | Page-level direct inverse text |

## Rules

1. Raw hex values belong in token source files, token runtime, shadows, and registered asset exceptions only.
2. Page code must not use L1 `colorPrimitives.*`.
3. Page code must not use deprecated `palette.*`; use `colors.*` or shared component props.
4. Do not concatenate alpha strings such as `${color}14`; use `colors.overlay.*`.
5. Status, market, and brand states must carry `fg`, `bg`, `border`, `solid`, and `onSolid`.
6. `up` and `down` keep China-style financial semantics: `up = red`, `down = green`.
