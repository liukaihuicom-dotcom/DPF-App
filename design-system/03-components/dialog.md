# Dialog Component

## Current Status

No shared dialog is formalized. Use bottom sheet for mobile-first decisions until a shared dialog is introduced.

## Required API

| Prop | Type | Required |
|---|---|---:|
| open | boolean | yes |
| title | string | yes |
| description | string | no |
| primaryAction | object | yes |
| secondaryAction | object | no |
| onOpenChange | function | yes |

## Rules

- Destructive and future live financial operations need confirmation.
- Dialogs must define focus, dismiss, and loading behavior.

