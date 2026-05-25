# Changelog

## 0.2.28 - 2026-05-25

### Added

- Added the profile nickname change rule, helper copy, and save-time cooldown validation for the profile edit bottom sheet.

## 0.2.27 - 2026-05-25

### Added

- Added 993 governed Iconsax Free local-vendored icon assets with source manifest, checksum, license metadata, and `AppIcon` line/fill rendering support.
- Added a governed primary save action to the profile edit bottom sheet footer.

## 0.2.26 - 2026-05-25

### Changed

- Refined the profile identity header into a compact card surface with token-bound avatar, edit badge, nickname, and verification chip spacing.

## 0.2.25 - 2026-05-25

### Fixed

- Corrected the web `SwitchControl` thumb alignment so unchecked settings switches start from the left edge and checked switches stay inside the governed track.

## 0.2.24 - 2026-05-25

### Changed

- Replaced the Partner Portal referral hero visual with a transparent-background, theme-adaptive referral illustration inspired by the provided reference.
- Registered the referral-network illustration as a governed SVG renderer so page code does not own local SVG drawing.

## 0.2.23 - 2026-05-25

### Changed

- Removed the two signal tags from the Partner Portal referral hero for a cleaner card header area.

## 0.2.22 - 2026-05-25

### Changed

- Updated the Partner Portal referral hero invite CTA to use the product theme color instead of the info-blue action tone.

## 0.2.21 - 2026-05-25

### Changed

- Polished the Partner Portal referral hero with a quieter panel background and a higher-quality governed referral-network illustration stage.

## 0.2.20 - 2026-05-25

### Changed

- Refined the Partner Portal referral hero into a left-copy and right-illustration layout with a lighter info-tinted background and governed avatar/icon illustration elements.

## 0.2.19 - 2026-05-25

### Changed

- Standardized bottom-sheet header decorative icons to the 40px `AppIconFrame` icon-plus-background treatment used by page header icon actions.

## 0.2.18 - 2026-05-25

### Changed

- Removed the bottom divider from the trade order view tabs so the pending-order content region reads as one continuous surface.

## 0.2.17 - 2026-05-25

### Changed

- Bound `AppIcon` disclosure chevron default colors to the registered lower-emphasis icon tone.
- Added runtime icon tone mapping for secondary and tertiary emphasis levels.

## 0.2.16 - 2026-05-25

### Changed

- Replaced the shared settings switch control with the platform-native React Native `Switch`.
- Added a governed 44px minimum touch target and native switch accessibility state.

## 0.2.15 - 2026-05-25

### Changed

- Replaced the default Expo launcher, Android adaptive icon, and web favicon assets with the governed Dupoin brand mark.
- Added a settings security-code switch with an enable path and a confirmed local disable path.

## 0.2.14 - 2026-05-25

### Changed

- Removed visible semantic border colors from filled `ActionButton` variants while preserving the transparent reserved border for stable layout.
- Updated shared form field labels to use 1st-level text color and preserve source casing instead of forced uppercase.
- Updated shared form field input values to medium weight for a one-step heavier typed-text style.

## 0.2.13 - 2026-05-25

### Added

- Added a configurable Discover widget flow covering entry and campaign content with large card, small card, large list, and small list display modes.
- Added a low-emphasis Discover footer edit action that opens the visual layout editor.

### Changed

- Reworked the Discover layout editor into an iOS-style widget preview editor with drag feedback, move controls, and inline size selection.
- Added local layout normalization for legacy Discover layout ids and legacy large / medium / list modes.

## 0.2.12 - 2026-05-25

### Added

- Added a governed Discover entry-menu icon treatment that pairs semantic icon foreground colors with matching transparent overlay backgrounds.
- Added `color.overlay.success.*` runtime and design-system token mappings for success-toned feature entry backgrounds.

### Changed

- Removed Ready/Demo/Preview and 可用/演示/预览 status tags from Discover entry rows.
- Updated icon QA policy so the colored Discover entry treatment is allowed only through the approved helper mapping.

## 0.2.11 - 2026-05-25

### Changed

- Standardized rounded functional icon container backgrounds to the grey `color.iconBg.*` family across light and dark runtime themes.
- Strengthened grey icon container contrast on grey app backgrounds while keeping icon backgrounds in the governed neutral family.
- Migrated Discover entry and campaign icon containers from page-local brand alpha backgrounds to the governed `AppIconFrame` component.
- Added icon QA policy coverage to block brand/status/market alpha backgrounds on rounded functional icon containers.

## 0.2.10 - 2026-05-25

### Changed

- Governed the global Toast feedback pattern for title-only and title-plus-body variants.
- Required the dark Toast surface to keep a fixed left icon, wrapping copy area, reserved close slot, and `size.viewport.toastMaxWidth` cap.
- Migrated Auth blocked-submit feedback to the governed global Toast while keeping inline field errors for recovery.

## 0.2.9 - 2026-05-25

### Changed

- Extended `GlobalMenuList` to support governed settings-menu accessories, right-side values, optional icons, and per-row chevron behavior.
- Migrated the profile settings and support menu groups to `GlobalMenuList` so pages no longer recreate menu rows locally.

## 0.2.8 - 2026-05-25

### Changed

- Refined the profile Partner Portal rebate card so summary data stays grouped while the trend chart occupies the bottom chart area.
- Bound the revised card structure to existing surface, border, spacing, radius, typography, and market-direction tokens.

## 0.2.7 - 2026-05-25

### Added

- Added governed `color.icon.*` foreground and `color.iconBg.*` background token specifications for icon glyphs and rounded icon containers.
- Added icon foreground/background pairing rules for text-adjacent icons, navigation, status, feature-entry, risk, inverse, and market-direction scenarios.

### Changed

- Updated icon QA policy to require `color.icon.*` for glyph color and `color.iconBg.*` for icon container backgrounds.

## 0.2.6 - 2026-05-25

### Added

- Added the governed `AppIconFrame` component for default grey, semantic, disabled, and transparent icon background frames.
- Added `mini` through `display` icon frame and glyph size tokens, including smaller `mini`, `xs`, and `sm` variants.

### Changed

- Migrated shared header, form, menu, empty-state, fund-action, funding payment, instrument, trade-direction, and account-switch icon background usage to the shared frame component.

## 0.2.5 - 2026-05-25

### Changed

- Refactored global toast feedback into a dark, top-navigation-aware component with close control, adaptive timing, and enter/exit motion.

## 0.2.4 - 2026-05-25

### Changed

- Removed visible card border styling from shared and high-traffic local card surfaces.
- Standardized icon background containers to use borderless fully rounded backgrounds.

## 0.2.3 - 2026-05-25

### Changed

- Unified level-2 page navigation titles with dialog and sheet top titles at the governed 20px title size.

## 0.2.2 - 2026-05-25

### Changed

- Standardized selected bottom navigation icons to use filled style plus brand color.
- Corrected `brand` icon tone resolution so brand-colored icons bind to the brand color token.

## 0.2.1 - 2026-05-25

### Changed

- Softened dark-theme semantic text tokens in `darkTerminal` and `midnightBlue` for improved reading comfort.
- Kept public text token names and component consumption paths unchanged.

## 0.2.0 - 2026-05-23

### Added

- Added the production global form field component set with floating-label `TextField`, `SelectField`, and lightweight `RichTextField`.
- Reserved the `stage` form field variant for future stage-themed input styling.
- Added `GlobalMenuList` variants for navigation and descriptive sheet option menus.

### Changed

- Set the global body typography token `body.md` to 14px/20px and aligned web select overlay input sizing to the typography token.
- Migrated existing shared form usage to inherit neutral floating-label states.
- Moved developer-panel select controls onto the shared `SelectField` behavior.
- Moved trade option menus onto `GlobalMenuList` and made parent containers responsible for horizontal spacing.
- Added fill sizing for fixed-height detail sheet content so trade position details can use the available middle sheet area.
- Promoted detail label/value rows to `KeyValueList` so text lists do not reuse menu-list components and parent containers own horizontal spacing.
- Governed global BottomSheet height so all current sheet entries use content-first dynamic height, with scrolling only after the global max-height cap.

## 0.1.0 - 2026-05-21

### Added

- Initialized design system governance docs for the existing Dupoin Expo app.
- Added token architecture, icon rules, core component docs, business component docs, page patterns, platform rules, and quality checklists.

### Notes

- No runtime component behavior was changed.
# 2026-05-24

- Updated `icon.account.trading` to use the approved Phosphor `Vault` asset for trading-account asset containers, replacing the previous user-switch glyph.
- Added fixed icon-slot guidance in account cards so trading-account icons do not collide with equity or PnL values.
