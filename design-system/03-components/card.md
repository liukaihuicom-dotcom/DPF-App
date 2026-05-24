# Card Component

## Runtime Component

`src/components/Card.tsx`

## Variants

| Variant | Props | Use |
|---|---|---|
| default | none | Standard grouped content |
| compact | `compact` | Dense rows and secondary modules |
| highlight | `highlight` | Elevated or primary content block |

## Token Binding

| Part | Token |
|---|---|
| Background | `surface.panel` or `surface.panelHigh` |
| Border | `border.soft` or `border.default` |
| Radius | `radius.md` |
| Padding | `space.16` or `space.12` |
| Shadow | `shadow.panel` for highlight only |
| Title | `AppText variant="title.card"` |

Runtime values are imported from `src/theme/tokens.ts`; page-local cards should use `Card` instead of copying radius, border, and padding rules.

## Rules

- Cards should not contain unrelated page sections.
- Avoid nested cards unless the inner item is a repeated data record.
- Card headers and card-level empty-state titles must use `title.card`; list row titles inside cards must use `title.listItem`.
