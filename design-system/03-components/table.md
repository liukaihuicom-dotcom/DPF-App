# Table Component

## Current Status

Mobile screens currently use lists and cards. Tables are reserved for future web/admin partner and commission views.

## Required Behavior

- Responsive fallback to list cards on mobile.
- Sort and filter state must be explicit.
- Empty and error states are mandatory.

## Key Value List

`src/components/KeyValueList.tsx` is the shared text-list component for compact metrics and detail rows inside cards, sheets, and summary modules.

## Variants

| Variant | Use |
|---|---|
| `compact` | Dense account metrics, small summaries, and card metadata. |
| `detail` | Full-width sheet/card detail rows such as position, order, and account detail text lists. |

## Spacing Rules

- Text-list rows must not own left or right outer spacing.
- Parent cards, sheet content, or modules own horizontal padding and module width.
- Rows may own label/value alignment, internal gap, vertical rhythm, optional dividers, and fill-height distribution.
- Do not use `GlobalMenuList` for read-only label/value text lists; menu lists are reserved for selectable actions or navigation.
