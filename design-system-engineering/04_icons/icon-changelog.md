# Icon Changelog

## 3.6.2 - 2026-05-25

- Tightened `AppIcon` and `AppIconFrame` tone props so functional icons accept governed `IconTone` values instead of arbitrary strings.
- Mapped the `brand` compatibility tone through `color.icon.active` and blocked raw color values from icon tone props in icon QA.
- Migrated the remaining raw color tone usage in Portfolio to a governed semantic icon tone.

## 3.6.1 - 2026-05-25

- Promoted all 60 non-brand product semantic functional icons to render governed local Iconsax glyphs while preserving existing `icon.*` API names and legacy aliases.
- Kept `icon.brand.apple` on its existing brand/provider source instead of forcing a brand mark through Iconsax.
- Added `scripts/icons/switch-semantic-icons-to-iconsax.js` so the semantic Iconsax mapping can be reapplied deterministically after full Iconsax asset regeneration.
- Updated icon QA and usage docs to distinguish Iconsax `registry_scope: "library_asset"` full-source entries from promoted `registry_scope: "semantic"` product icons.

## 3.6.0 - 2026-05-25

- Added Iconsax Free as a governed local-vendored library asset source while keeping Phosphor as the primary production UI icon library.
- Generated 993 Iconsax Free Linear/Bold runtime assets from the official `lusaxweb/iconsax` source package into `src/icons/local/iconsax/iconsaxGeneratedIcons.tsx`.
- Added `IconsaxIconBase`, generated runtime registry entries, `registry_scope: "library_asset"`, and the source manifest with checksum and license metadata.
- Updated icon schema and QA so Iconsax assets can remain unused until promoted through semantic icon governance, while `iconsax-react-native` remains blocked as a runtime dependency.

## 3.5.3 - 2026-05-25

- Standardized page, dialog, and sheet title-bar icon slots to the governed 40px header frame with a 24px glyph through shared layout tokens.
- Kept title-bar icons routed through `HeaderIconButton`, `HeaderIconSlot`, and `AppIconFrame` instead of page-local hardcoded sizes.

## 3.5.2 - 2026-05-25

- Added a governed Discover entry-menu exception that pairs semantic `color.icon.*` foreground tones with matching `color.overlay.*.subtle` icon backgrounds.
- Removed Discover entry status pills so ready, demo, and preview states no longer appear as row tags in the menu list.
- Added icon QA coverage to keep the colored Discover entry treatment constrained to the approved helper mapping.

## 3.5.1 - 2026-05-25

- Standardized rounded functional icon container backgrounds to grey `color.iconBg.*` values across all theme modes.
- Migrated Discover feature-entry icons to `AppIconFrame` so feature rows and campaign cards no longer use page-local brand alpha icon backgrounds.
- Added QA coverage to flag brand, status, market, or overlay alpha backgrounds on rounded functional icon containers.

## 3.5.0 - 2026-05-25

- Split functional icon sizing into a stable 24px canvas and a 21px centered glyph.
- Added `default_canvas_size`, `default_glyph_size`, `view_box`, `safe_area_inset`, and `shape_fit` governance fields for all non-brand functional icons.
- Updated `AppIcon` rendering so explicit size controls the canvas while the glyph scales from the 21 / 24 ratio.
- Added QA coverage for canvas size, glyph size, safe area, shape fit, and `size.iconGlyph.*` token binding.

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
