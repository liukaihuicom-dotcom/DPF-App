# Icon Usage Rules

## L5 Rules

- Pages and feature components must consume semantic `icon.*` registry keys through `AppIcon`.
- `AppIcon` must render only local vendored icon components from `src/icons/local`; it must not import third-party icon runtime packages.
- `AppIcon` defaults to `color.icon.primary`, which resolves to the active theme text level 1 color (`colors.text.primary`) across all modes.
- Page and feature code must omit decorative icon tones such as `brand`, `blue`, `text`, `textMuted`, or `textDim`; use explicit `tone` only for governed status, risk, disabled, market, or inverse contrast contexts.
- Phosphor is the primary icon library; Remix is only a financial/business supplement; Lucide is only a system-operation supplement.
- Hugeicons is blocked for production use and must not appear in dependencies, source code, registry entries, or design-system documentation except migration notes.
- Custom icons require a Custom Icon Request with ownership, style, license, token, and QA approval before use.
- Brand assets are not functional icons. Launcher icon, splash icon, favicon, and content logo are governed as brand assets.

## Financial Product Rules

- Use market tones `up` and `down` only when the icon communicates market direction or trading P/L direction.
- Use `danger` only for destructive, blocked, failed, or compliance-risk actions.
- Use `brand` for selected, primary, verified, or product-owned actions.
- Do not use generic bank imagery for every account-related concept; wallet, trading account, banking, and identity icons must stay semantically distinct.
- Operations and rewards icons must not appear in core trading, funding, or risk paths unless the registry usage explicitly allows it.
- Dropdown and expandable controls must use `icon.system.chevron_down`; row disclosure must use `icon.system.chevron_right`.

## Size Rules

- Registry sizes must be limited to 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64.
- `AppIcon` defaults to `size.icon.md`, which is 24px.
- Runtime icon calls should use `sizeVariant` for governed icon sizes; concrete `size` is migration-compatible only for documented component-owned exceptions.
- 8px and 12px are only for micro indicators, badges, and dense helper cues; they are not default functional icon sizes.
- 48px and 64px are only for empty states, result states, feature entry visuals, and display business icons.
- Every registry entry must bind to `size.icon.*` and `color.icon.*` tokens.

## Style Rules

- Linear icon stroke width must resolve to `lineWidth.icon.default`, which is 1.5px.
- `AppIcon` supports `styleVariant="line"` and `styleVariant="fill"`; default is `line`.
- Fill style is reserved for selected, active, state-emphasis, or business-emphasis scenarios.
- Page code must not simulate fill or stroke changes through local SVG overrides.

## Provider Rules

- Approved source libraries remain Phosphor, Remix Icon, and Lucide, but runtime glyphs must be vendored into `src/icons/local`.
- Every semantic icon must carry source metadata: `source_library`, `source_icon_name`, `license`, `license.url`, `license.attribution_required`, and `modified`.
- Unknown-source SVG, competitor-derived glyphs, emoji, bitmap functional icons, and page-local functional SVG are blocked from production.
- Low-level icon runtime imports are blocked everywhere, including `src/components/AppIcon.tsx`; pages must only use semantic `AppIcon`.


## Local Asset Rules

- Every registry entry must declare `local_asset_path` under `src/icons/local/{source}/`.
- Local vendored icon files must keep source and license comments.
- Third-party icon runtime packages such as `phosphor-react-native`, `lucide-react-native`, `react-native-remix-icon`, and `@expo/vector-icons` are blocked from dependencies and source imports.

## Flag Asset Rules

- Country and region flags are governed visual assets, not functional system icons.
- Flag artwork source is `flag-icons` v7.5.0, MIT license, vendored under `src/assets/flags/flag-icons`.
- Flag rendering must go through `src/components/FlagIcon.tsx` or approved wrappers such as `CurrencyFlag`.
- `FlagIcon` supports `circle`, `square`, and `rectangle`; default shape is `circle`.
- `circle` and `square` use 1x1 assets; `rectangle` uses 4x3 assets.
- Do not use emoji flags, text-only country badges, unknown-source SVG, or page-local flag SVG for production UI.
