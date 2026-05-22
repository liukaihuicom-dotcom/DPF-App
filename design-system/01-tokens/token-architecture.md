# Token Architecture

## Layers

| Layer | Meaning | Runtime Mapping |
|---|---|---|
| L1 Base | Raw palette, spacing, radius, type, shadow values | `DESIGN.md`, `src/theme/colors.ts`, `src/theme/tokens.ts` |
| L2 Semantic | Product meaning such as background, panel, text, brand, danger | `ThemePalette` fields |
| L3 Component | Component-specific bindings such as button background and card border | Component docs and StyleSheet bindings backed by `src/theme/tokens.ts` |

## Runtime Modes

| Mode | Current Mapping | Use |
|---|---|---|
| lightBroker | `themePalettes.lightBroker` | Default customer app |
| darkTerminal | `themePalettes.darkTerminal` | Market terminal feel |
| midnightBlue | `themePalettes.midnightBlue` | Alternate dark broker theme |

## Rules

- Page code should depend on `useThemePalette()` and shared component props.
- Token source files may contain raw values. Page files should not.
- Runtime typography, spacing, radius, and layout values must be imported from `src/theme/tokens.ts`.
- Page code must not define raw `fontSize`, `fontWeight`, `lineHeight`, or `letterSpacing`; use `AppText` variants or `typography` tokens.
- If a needed token is missing, add a semantic token first and record it in the changelog.
