# Verification Prompt

## Purpose

Guide users from restricted actions to the required auth, risk, KYC, or partner status step.

## Required Props

| Prop | Description |
|---|---|
| title | Human-readable blocked state |
| body | Reason and next step |
| actionLabel | CTA from i18n |
| onAction | Route or action |
| severity | neutral, warning, danger |

## Auth Contact Confirmation Variant

Use `AuthContactConfirmDialog` before sending a registration verification code.

## Required Props

| Prop | Description |
|---|---|
| channel | `email` or `phone` |
| target | Full email address or phone number shown for user confirmation |
| countryFlag | Optional phone country flag rendered through `FlagBadge` |
| open | Controls whether the centered dialog is visible |
| onConfirm | Continue to the verification-code route |
| onCancel | Close the dialog and keep the entered contact editable |

## States

| State | Behavior |
|---|---|
| default | Hidden until the contact field passes validation |
| confirming | Center dialog blocks the flow and asks the user to confirm the target |
| cancelled | Dialog closes without clearing the field |
| confirmed | Existing verification-code navigation runs |

## Token And Component Binding

- Surface, scrim, text, border, radius, and spacing must use runtime theme palette plus `spacing`, `radius`, `lineWidth`, and `size` tokens.
- CTA controls must use `ActionButton`; phone country identity must use `FlagBadge`.
- User-facing copy must use `auth.confirmContact.*` i18n keys.
- Title and body copy are one compact module. Use a tighter internal gap than the dialog-to-action gap, so the message reads as one block and the primary action remains visually distinct.

## QA Gate

- Pass when invalid email/phone still opens the existing error sheet, valid contact opens the centered dialog, Go back preserves input, Confirm routes with the same query parameters as the prior direct flow, and EN/ZH copy has no profit or risk-free claims.
