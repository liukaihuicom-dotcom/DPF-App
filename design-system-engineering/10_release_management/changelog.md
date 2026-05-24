# Design System Engineering Changelog

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
