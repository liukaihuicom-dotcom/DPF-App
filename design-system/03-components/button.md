# Button Component

## Runtime Component

`src/components/ActionButton.tsx`

Exports `ActionButtonTone` for shared footer/action typing.

## Variants

| Variant | Prop | Use |
|---|---|---|
| neutral | `tone="neutral"` | Secondary action |
| brand | `tone="brand"` | Primary product CTA |
| up | `tone="up"` | Buy or upward market context |
| down | `tone="down"` | Sell or downward market context |
| blue | `tone="blue"` | Informational action |
| amber | `tone="amber"` | Pending, review, or caution action |

## States

| State | Prop or Trigger | Requirement |
|---|---|---|
| default | no flags | Enabled and labeled |
| loading | `loading` | Shows spinner, sets busy state, disables press |
| disabled | `disabled` | Disabled style and state |
| success | caller-owned | Show toast or result block |
| failed | caller-owned | Show validation or error toast |

## A11y

- Must set `accessibilityRole="button"`.
- Must set label from explicit `accessibilityLabel` or visible label.
- Busy and disabled must be reflected through `accessibilityState`.
