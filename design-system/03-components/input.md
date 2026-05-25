# Form Field Component Set

## Runtime Components

- `src/components/TextField.tsx`
- `SelectField` exported from `src/components/TextField.tsx`
- `RichTextField` exported from `src/components/TextField.tsx`

## Current Status

Production shared. Auth forms, order lot entry, market search, upgrade reason entry, and developer-panel selects use the global form field component set.

## Shared Visual Model

- Default style is `variant="neutral"` with a token-bound floating label inside the field shell.
- Empty fields show only the label inside the input box.
- Focused, inputting, or populated fields move the label to the upper area of the same shell and place input text below it.
- Field labels use the 1st-level text color (`colors.text.primary`) and the `label.field` typography role; label copy must preserve source casing and must not be forced to uppercase.
- Field input values use the current `typography.bodySm` metrics with medium weight (`fontWeight: 500`) so typed text reads one step heavier than the base body style.
- Default field shells use `lineWidth.strong` with `palette.line` for a visible 1px boundary that remains recognizable before interaction.
- Focused and inputting states keep the default `lineWidth.strong` border width and use the high-contrast dark theme text color so the selected field is immediately recognizable without changing field height.
- Validating, success, and error states keep `lineWidth.strong` and use their registered state colors.
- `variant="stage"` is the approved high-emphasis numeric input mode for amount-entry surfaces. It keeps the same shell, feedback, and border rules as `neutral`, but uses `typography.quoteLg` and `size.input.multilineMinHeight` to create a focused amount-entry stage without page-local `TextInput` styling.
- `shape="pill"` is the approved full-radius shell shape for compact search fields and similar utility controls. It keeps the same field state, border, feedback, and label rules as the default shell while binding the shell radius to `radius.full`.
- `sizePreset="sm"` and `sizePreset="md"` are approved compact field heights for utility controls. They bind to `size.control.sm` and `size.control.md`; default form fields keep the existing full-height input shell.

## Required TextField API

| Prop | Type | Required | Description |
|---|---|---:|---|
| label | string | yes | Visible field label |
| value | string | no | Controlled value |
| onChangeText | function | yes | Change handler |
| placeholder | string | no | Placeholder from i18n |
| error | string | no | Error message from i18n |
| successText | string | no | Success helper text from i18n |
| disabled | boolean | no | Disabled state |
| readonly | boolean | no | Read-only state |
| fieldState | enum | no | Explicit field state override |
| variant | `neutral` / `stage` | no | Visual variant; `stage` is approved for high-emphasis numeric amount fields |
| keyboardType | string | no | Platform keyboard hint |
| secureTextEntry | boolean | no | Password input |
| multiline | boolean | no | Long-form reason/comment input |
| icon | PhosphorIconName or ReactNode | no | Leading field icon |
| helperText | string | no | Non-error supporting text |
| labelHidden | boolean | no | Visually hidden label for compact/search fields |
| shape | `default` / `pill` | no | Shell shape; `pill` is approved for compact search fields |
| sizePreset | `default` / `sm` / `md` | no | Shell height preset; compact utility fields may use `sm` or `md` |

## Required SelectField API

| Prop | Type | Required | Description |
|---|---|---:|---|
| label | string | yes | Floating field label |
| value | string | yes | Selected option value |
| options | array | yes | `{ label, value, disabled? }` options |
| onChangeValue | function | yes | Selection handler |
| placeholder | string | no | Empty select text |
| error / helperText / successText | string | no | Field feedback |
| disabled / readonly | boolean | no | Non-editable states |
| fieldState | enum | no | Explicit field state override |
| variant | `neutral` / `stage` | no | Visual variant; `SelectField` keeps neutral behavior until a governed stage select pattern is added |
| icon | PhosphorIconName or ReactNode | no | Leading field icon |

## Phone Country Code Variant

`CountryPhoneField` composes a country / dial-code chip with `AuthTextField`.

- The country / dial-code chip is a form field variant and must align with `TextField` shell height, radius, border width, padding, and default border contrast.
- The country / dial-code chip is a button and must show the registered `expandDown` icon on the right side.
- The arrow is a disclosure affordance only; it must use the text-dim token and must not replace the accessible label.
- Page code must not create a custom country-code chip when `CountryPhoneField` can express the interaction.

## Required RichTextField API

`RichTextField` inherits `TextField` props, forces multiline usage, and adds:

| Prop | Type | Required | Description |
|---|---|---:|---|
| toolbarSlot | ReactNode | no | Reserved toolbar area for formatting controls |
| footerSlot | ReactNode | no | Reserved footer area for counters or metadata |

## States

default, focused, inputting, validating, success, error, disabled, readonly.

State priority is fixed: disabled > error > focused/inputting > validating > success > default.

## Governance

- Page code must not import `TextInput` directly unless building a low-level input wrapper.
- Approved low-level wrappers are `TextField`, `SelectField`, `RichTextField`, and the legacy-compatible `AuthTextField` adapter inside `AuthShell`.
- Page code must not build page-local select, textarea, or rich-text field shells when a shared field wrapper can express the state.
- Error copy must be passed through `error`, not rendered as a detached page-local pattern.
- Visual values must come from `palette` and `src/theme/tokens.ts` through the shared component.
- Form field borders must remain `lineWidth.strong` in every state so focus, inputting, validation, success, and error feedback cannot change field height.
- Default form field borders must use at least `palette.line` contrast; reserve `palette.lineSoft` for disabled or lower-emphasis non-input surfaces.
- `labelHidden` is allowed only for compact controls such as search fields and stepper inputs where a visible label would break the control pattern.
- `shape="pill"` must be used through the shared `TextField`/`AuthTextField` API, not via page-local radius overrides.
- Compact field heights must use `sizePreset`; page code must not override form shell height locally when a registered preset can express it.
