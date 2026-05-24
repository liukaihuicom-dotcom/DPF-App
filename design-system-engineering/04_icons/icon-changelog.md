# Icon Changelog

## 3.4.0 - 2026-05-25

- Expanded governed icon sizes to 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64.
- Set the global functional icon default to 24px through `size.icon.md`.
- Added governed `AppIcon` size and style variants for line and fill usage.
- Standardized linear icon stroke width to `lineWidth.icon.default` at 1.5px.
- Added QA coverage for default size, size scale, style contract, and stroke-width contract.

## 3.3.0 - 2026-05-25

- Added runtime `colors.icon.*` theme tokens and aligned default functional icon color to text level 1 through `color.icon.primary`.
- Updated `AppIcon` tone resolution so decorative legacy tones normalize to the unified default while state, disabled, inverse, and market-risk tones remain governed exceptions.
- Added icon QA coverage for blocked literal decorative `AppIcon` tones in page and component code.

## 3.2.0 - 2026-05-24

- Added governed global flag assets from `flag-icons` v7.5.0 under `src/assets/flags/flag-icons`.
- Added `FlagIcon` with `circle`, `square`, and `rectangle` shape support; default shape is `circle`.
- Updated `CurrencyFlag` and phone country flag badges to consume the governed flag asset system.
- Documented flag source, license, coverage, runtime, and forbidden usage rules.

## 3.1.0 - 2026-05-24

- Vendored approved source glyphs into `src/icons/local` so all functional icon files live in the local project.
- Updated `AppIcon` to render local vendored components only; third-party icon runtime packages are blocked in dependencies and imports.
- Added `local_asset_path` and runtime local asset policy checks to icon governance and QA.

## 3.0.0 - 2026-05-24

- Migrated the production icon source policy to the latest Icon Asset Library Governance Skill.
- Replaced Hugeicons runtime dependencies with Phosphor primary, Remix financial/business supplement, and Lucide system-operation supplement packages.
- Rebuilt `icon-registry.json` as an `icons` array with `icon.*` semantic keys, source metadata, license metadata, token bindings, states, and migration aliases.
- Updated `AppIcon` to dispatch icons by `source_library` and blocked low-level icon imports outside the runtime bridge.
- Added QA blockers for Hugeicons references, unregistered functional SVG, low-level icon imports, missing source glyphs, invalid token bindings, and legacy icon usage.

## 2.2.1 - 2026-05-23

- Added scene-specific semantic icons for deposit, withdrawal, balance, trading account, trade ticket, order list, position close, close losing position, app rating, help center, function center, trade volume, and instrument asset classes.
- Deprecated broad legacy semantic names: `actionRefresh`, `accountBank`, `taskChecklist`, and `qrCode`.

## 2.0.0 - 2026-05-22

- Previous Hugeicons-based runtime. Deprecated by v3.0.0 and blocked by current source policy.

## 1.0.0 - 2026-05-22

- Added the first L5 icon registry, semantic naming, usage rules, core list, schema, and QA rules.
