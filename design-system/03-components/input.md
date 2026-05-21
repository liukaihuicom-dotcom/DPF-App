# Input Component

## Runtime Component

`src/components/TextField.tsx`

## Current Status

Shared. Auth forms, order lot entry, upgrade reason entry, and market search use `TextField`.

## Required API

| Prop | Type | Required | Description |
|---|---|---:|---|
| label | string | yes | Visible field label |
| value | string | yes | Controlled value |
| onChangeText | function | yes | Change handler |
| placeholder | string | no | Placeholder from i18n |
| error | string | no | Error message from i18n |
| disabled | boolean | no | Disabled state |
| keyboardType | string | no | Platform keyboard hint |
| secureTextEntry | boolean | no | Password input |
| multiline | boolean | no | Long-form reason/comment input |
| icon | PhosphorIconName or ReactNode | no | Leading field icon |
| helperText | string | no | Non-error supporting text |
| labelHidden | boolean | no | Visually hidden label for compact/search fields |

## States

default, focus, inputting, validating, error, disabled, success.

## Governance

- Page code must not import `TextInput` directly unless building a low-level input wrapper.
- Error copy must be passed through `error`, not rendered as a detached page-local pattern.
- Visual values must come from `palette` through the shared component.
