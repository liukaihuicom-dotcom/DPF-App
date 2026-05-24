# Form Pattern Component

## Required Behavior

- Field labels from i18n.
- Text, select, and rich-text inputs use the global form field component set.
- Default field labels render inside the input shell and float upward on focus or input.
- Inline validation before submit.
- Submit disabled while invalid or submitting.
- Error summary for blocked submit.
- Success feedback after completion.
- No sensitive data persisted in localStorage.

## States

Field states: default, focused, inputting, validating, success, error, disabled, readonly.

Form states: default, inputting, validating, submitting, success, failed, disabled.

## Forbidden

- Do not create page-local TextInput, select, textarea, or rich-text shells.
- Do not render detached labels above fields unless `labelHidden` is required by a compact control pattern.
- Do not use brand-colored focus borders for default neutral forms.
