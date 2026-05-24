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

## Title Binding

| Title type | Runtime variant | Size |
|---|---|---:|
| Shared dialog title | `title.dialog` | 20 |
| Global bottom sheet title | `title.sheet` | 20 |

## Rules

- Destructive and future live financial operations need confirmation.
- Dialogs must define focus, dismiss, and loading behavior.
- Dialog and sheet titles must not use page title, card title, or generic `subtitle` variants.
