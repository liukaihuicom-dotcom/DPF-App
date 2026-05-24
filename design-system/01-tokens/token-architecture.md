# Token Architecture

## Layers

| Layer | Meaning | Runtime Mapping |
|---|---|---|
| L1 Base | Raw palette, spacing, radius, type, shadow values | `DESIGN.md`, `design-system-engineering/01_tokens/tokens.color.json`, `src/theme/colors.ts`, `src/theme/tokens.ts` |
| L2 Semantic | Product meaning such as background, panel, text, brand, danger | `ThemeColors` fields |
| L3 Component | Component-specific bindings such as button background and card border | Component docs and StyleSheet bindings backed by `src/theme/tokens.ts` |

## Runtime Modes

| Mode | Current Mapping | Use |
|---|---|---|
| lightBroker | `themeColors.lightBroker` | Default customer app |
| darkTerminal | `themeColors.darkTerminal` | Market terminal feel |
| midnightBlue | `themeColors.midnightBlue` | Alternate dark broker theme |

## Rules

- Page code should depend on `useThemeColors()` and shared component props.
- Token source files may contain raw values. Page files should not.
- Text color is an L2 semantic token decision. Page text should use `AppText tone`; page code should not read raw color fields to color ordinary text.
- `ThemeColors` fields are runtime exports for shared components and token-backed primitives. Deprecated `ThemePalette` aliases must not be used in new code.
- Runtime typography, spacing, radius, line width, and layout values must be imported from `src/theme/tokens.ts`.
- Size is a dimension token system for component height, width, min/max constraints, icon size, touch targets, and viewport constraints. It must not be mixed with spacing.
- Line width is a dimension token system for ordinary UI borders, dividers, separators, and hairline rules. It must not be mixed with border color, spacing, size, icon stroke width, or chart stroke width.
- Spacing is a full-site layout primitive. Page, component, sheet, form, list, card, footer, and operation-area spacing must resolve to `spacing` or `layout` tokens.
- Page code must not guess local `padding`, `margin`, `gap`, `rowGap`, or `columnGap` values. Use parent `gap`, shared component spacing, or a documented pattern token.
- Page and component code must not guess local `height`, `width`, `minHeight`, `minWidth`, `maxHeight`, or `maxWidth` values. Use `size`, `layout`, shared component props, or documented pattern tokens.
- Page and component code must not guess local `borderWidth`, side-specific border widths, or `height: 1` / `width: 1` divider thickness. Use `lineWidth.hairline` for ordinary UI lines.
- Page code must not define raw `fontSize`, `fontWeight`, `lineHeight`, or `letterSpacing`; use `AppText` variants or `typography` tokens.
- Do not use color to compensate for weak hierarchy. Fix the text role, layout, or typography variant first, then apply the semantic tone.
- Do not use negative margin or absolute offsets to repair ordinary layout rhythm.
- If a needed token is missing, add a semantic token first and record it in the changelog.
