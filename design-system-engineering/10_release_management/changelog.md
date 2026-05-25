# Design System Engineering Changelog

## v2.0.8-iconsax-semantic-runtime

- Promoted current non-brand product semantic icons to local Iconsax runtime glyphs while preserving existing `AppIcon` semantic names.
- Added a deterministic semantic Iconsax switch script and QA distinction between Iconsax library assets and promoted semantic icons.
- Kept provider brand marks as brand-governed exceptions rather than replacing them with functional Iconsax glyphs.

## v2.0.7-iconsax-library-assets

- Added governed Iconsax Free local-vendored library assets with source manifest, checksum, license metadata, and QA coverage.
- Kept Phosphor as the primary production UI icon library while allowing Iconsax assets to be promoted through semantic icon governance.

## v2.0.6-discover-widget-layout

- Added a configurable Discover widget flow pattern for mixed entry and campaign content.
- Added a visual widget-layout editor pattern with preview cards, drag feedback, move controls, and inline size selection.
- Preserved local layout migration from legacy Discover layout ids and large / medium / list modes.

## v2.0.5-grey-icon-backgrounds

- Standardized `color.iconBg.*` semantic container backgrounds to grey neutral values in all runtime modes.
- Required feature-entry and list-row functional icons to use `AppIconFrame` or `colors.iconBg.*` rather than page-local brand/status alpha backgrounds.
- Added icon QA coverage for non-grey rounded functional icon container backgrounds.

## v2.0.4-global-toast-uxui

- Governed global Toast as the app-wide transient feedback component instead of page-local toast/snackbar variants.
- Bound Toast to dark feedback surface rules, fixed icon/copy/close-slot layout, 16px wrapping title text, title-body content variants, `size.viewport.toastMaxWidth`, registered icons, and `shadows.toast`.
- Required Auth blocked-submit feedback to use the global Toast and retain field-level inline errors as the recovery path.

## v2.0.3-global-menu-accessories

- Extended GlobalMenuList governance for settings-menu accessories, right-side values, optional icon slots, and per-row chevron behavior.
- Required settings and support menu groups to use the registered GlobalMenuList row pattern instead of page-local row structures.

## v2.0.2-navigation-active-icons

- Standardized bottom navigation selected icons to use the governed active `fill` style.
- Corrected `brand` icon tone resolution to bind to the brand semantic color.

## v2.0.1-dark-text-softening

- Softened semantic text colors for `darkTerminal` and `midnightBlue` to reduce harsh dark-mode reading contrast.
- Synchronized runtime colors, token mode matrix, token source, and CSS variable mapping.
- Preserved existing text token APIs and deprecated palette aliases.

## v1.2.0-title-typography-governance

- Added semantic title roles for page, compact page, dialog, sheet, card, section, list, list item, segmented tab, and bottom tab titles.
- Bound title roles to runtime `titleTypography` and `AppText` `title.*` variants.
- Added governance rules so new page, dialog, card, list, and tab titles cannot choose generic typography variants or hardcoded sizes.
- Added semantic body roles and label roles so正文, helper text, metadata, status labels, compact controls, and minimum 12px text are governed separately.
- Set minimum text to 12px only through `label.minimum`, `label.status`, or `title.bottomTabs`.

## v1.1.0-icon-size-style-governance

- Expanded icon size tokens and registry governance to 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64.
- Set 24px as the default functional icon size and added governed line/fill style variants.
- Standardized linear icon stroke width to 1.5px through `lineWidth.icon.default`.
- Updated icon QA rules for default size, size scale, style contract, and stroke-width contract.

## v1.0.0-production-structure

- Added L5 design-system engineering directories for principles, patterns, platform modes, AI runtime, code mapping, QA gates, release management, and scripts.
- Added machine-readable token, pattern, platform, AI runtime, and QA mapping assets.
- Mapped existing `design-system/` documentation into engineering governance without redefining visual rules.
