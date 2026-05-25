# Token Changelog

## v2.1.4-header-icon-frame

- Aligned runtime header icon button slots to the documented 40px `header.icon-button` size by mapping `layout.headerIconButtonSize` to `size.iconFrame.lg`.
- Mapped `layout.headerIconSize` to `size.iconFrameGlyph.lg` so page, dialog, and sheet title bars use the governed 40px frame with a 24px glyph.

## v2.1.3-success-overlay

- Added `color.overlay.success.*` tokens across runtime, token matrix, CSS variable, and Tailwind mappings.
- Reserved success overlay backgrounds for governed semantic feature-entry pairings, including Discover entry menu icons.

## v2.1.2-stronger-grey-icon-backgrounds

- Strengthened neutral `color.iconBg.*` values so rounded icon frames remain visible on grey app backgrounds while staying in the governed grey family.
- Updated runtime and token matrix values for `darkTerminal`, `lightBroker`, and `midnightBlue` without changing icon foreground or size tokens.

## v2.1.1-grey-icon-backgrounds

- Standardized `color.iconBg.active`, `danger`, `info`, `success`, `warning`, `marketUp`, and `marketDown` to grey neutral container values across all theme modes.
- Kept semantic status and market meaning on `color.icon.*` foreground tokens so icon containers no longer introduce blue, green, red, amber, or brand-tinted default backgrounds.

## v2.1.0-icon-color-background

- Added governed `color.icon.*` semantic foreground tokens, including `marketUp` and `marketDown`.
- Added `color.iconBg.*` semantic background tokens for borderless rounded icon containers.
- Mapped icon foreground and background tokens across `darkTerminal`, `lightBroker`, and `midnightBlue`.
- Added runtime and QA coverage for icon foreground/background token completeness.

## v2.0.2-icon-frame-size-ladder

- Added governed `size.iconFrame.*` and `size.iconFrameGlyph.*` runtime tokens for mini through display icon background frames.
- Kept existing `size.icon.*` values unchanged so pure semantic icons remain backward compatible.

## v2.0.1-dark-text-softening

- Softened `darkTerminal` and `midnightBlue` semantic text colors for improved long-form reading comfort.
- Kept `text.primary`, `text.secondary`, `text.tertiary`, and `text.link` above WCAG AA contrast on governed dark surfaces.
- Preserved `text.inverse` and all public runtime text token names.

## v2.0.0-production-structure

- Added L5 token index, schema, alias map, export map, and QA rules.
- Kept `tokens.color.json` and `token-mode.matrix.json` as the color source of truth.
- Mapped runtime non-color tokens to `src/theme/tokens.ts`.
