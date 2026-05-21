# Token Architecture

## Layers

| Layer | Meaning | Runtime Mapping |
|---|---|---|
| L1 Base | Raw palette, spacing, radius, type, shadow values | `DESIGN.md` and `src/theme/colors.ts` |
| L2 Semantic | Product meaning such as background, panel, text, brand, danger | `ThemePalette` fields |
| L3 Component | Component-specific bindings such as button background and card border | Component docs and StyleSheet bindings |

## Runtime Modes

| Mode | Current Mapping | Use |
|---|---|---|
| lightBroker | `themePalettes.lightBroker` | Default customer app |
| darkTerminal | `themePalettes.darkTerminal` | Market terminal feel |
| midnightBlue | `themePalettes.midnightBlue` | Alternate dark broker theme |

## Rules

- Page code should depend on `useThemePalette()` and shared component props.
- Token source files may contain raw values. Page files should not.
- If a needed token is missing, add a semantic token first and record it in the changelog.

