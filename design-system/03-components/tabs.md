# Tabs Component

## Runtime Component

- Bottom navigation uses Expo Router `Tabs` in `app/(tabs)/_layout.tsx`.
- In-page segmented controls use `src/components/SegmentedTabs.tsx`.

## Rules

- Use fixed tab bar height and label sizing to avoid layout shift.
- Active color maps to `brand`.
- Inactive color maps to `text.dim`.
- Hidden routes must use `options={{ href: null }}`.

## Segmented Tabs

Use `SegmentedTabs` for mutually exclusive in-page choices such as order type, filter mode, or compact state switching.

| Part | Token Binding |
|---|---|
| Rail background | `palette.panelSoft` |
| Rail border | `palette.lineSoft` + `lineWidth.hairline` |
| Selected item background | `palette.panel` |
| Selected item border | `palette.line` + `lineWidth.hairline` |
| Radius | `radius.full` |
| Gap and padding | `spacing.xs` |
| Minimum item height | `size.tab.itemMinHeight` |
| Label | `AppText variant="label.control"` with semantic tone |

Rules:

- Page code should pass `items`, `value`, and `onValueChange`; it should not recreate local segmented-tab rail styles.
- Each option must expose `accessibilityRole="tab"` and selected state.
- Use `SegmentedTabs` for compact tabs inside cards, sheets, and order tickets; use Expo Router `Tabs` only for app-level navigation.
- Expo Router bottom tab labels must use `titleTypography.bottomTabs`; in-page segmented tab labels must use `label.control`.
