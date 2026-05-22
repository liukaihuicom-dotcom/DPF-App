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
| danger | `tone="danger"` | Destructive operations such as close position or delete |

## Props

`ActionButton` supports `label`, `onPress`, `tone`, `emphasis`, `disabled`, `loading`, `accessibilityLabel`, `style`, and optional `icon`.

`emphasis` defaults to `soft`. Use `emphasis="solid"` only for the single primary action in a fixed operation area, such as order submission or a destructive confirmation. Directional trading CTAs must pair solid emphasis with the business direction color.

Use `icon` with a registered `AppIconName` for bottom-sheet footer operations, destructive actions, edit/modify actions, and dense action rows where fast scanning matters. Destructive sheet footer actions use `tone="danger"` so the label and icon share the danger color.

## Icon Treatment

Financial action tiles and quick-action entries render icons as quiet standalone glyphs. Do not wrap decorative action icons in tinted circular backgrounds, outline rings, or token-derived color frames.

Funding action glyphs use a 24px icon inside a 40px reserved visual box. Deposit maps to the green/down semantic color, withdraw maps to amber/yellow, and transfer maps to blue. Page code should use the business tones `deposit`, `withdraw`, and `transfer` instead of reusing market movement tone names.

Header icon buttons may keep a soft hit area for accessibility, but the button frame must not draw an outlined circle. The visual priority should stay on the icon, label, and surrounding financial data rather than on decorative icon badges.

## Token Binding

| Part | Token |
|---|---|
| Label | `typography.buttonMd` through `AppText` |
| Icon | `AppIcon` registered asset, matching label foreground |
| Radius | `radius.full` |
| Padding | `space.18` horizontal equivalent, `space.12` vertical |
| Colors | `ThemePalette` semantic fields |

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
