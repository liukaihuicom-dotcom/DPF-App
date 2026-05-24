# Changelog

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
