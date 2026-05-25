# Toast Component

## Runtime Component

Visual component: `src/components/feedback/FeedbackToast.tsx`

Runtime provider and hook: `src/feedback/Toast.tsx`

## Usage

Toast is the global transient feedback component for the entire app. Use it for success, blocked action, informational, and system feedback. Do not create page-local toast or snackbar styles.

Do not use toast as the only place for critical risk information, blocking errors, or recovery instructions. Those states must also appear inline or on the page.

The global runtime entry is `ToastProvider` plus `useToast()`. Existing callers should keep using `toast.show({ title, message, tone })`; optional `durationMs` and `dismissible` are reserved for explicit product exceptions. The provider must delegate visual rendering to the shared `FeedbackToast` component.

## Required Types

success, error, warning, info.

## Content Variants

| Variant | Payload | Typography |
|---|---|---|
| `titleOnly` | `title` only | Title uses 16px primary body text and may wrap naturally. |
| `titleBody` | `title` + `message` | Title uses 16px primary body text; body uses a lower-emphasis helper/body role and may wrap naturally. |

## Visual Rules

- Toast surface uses `colors.toast.bg`, an opaque dark feedback surface in light and dark themes.
- Toast appears below the top navigation: safe-area top plus top-bar height and an 8px offset.
- Pages without an app top bar use safe-area top plus the default page gap.
- Toast structure is fixed: left icon frame, middle copy area, right close-icon slot.
- The left icon uses `AppIconFrame` with the default grey icon background. Default/info toasts use the neutral icon color; success, warning, and danger may use governed state icon colors while keeping the grey background.
- The middle copy area supports natural wrapping and must keep `minWidth: 0` so long text does not push the icon slots out of alignment.
- The right close affordance uses the inverse icon token on the dark toast surface. When `dismissible: false`, the close slot remains reserved at the same width to prevent layout shift.
- Toast width is capped by the app viewport and `size.viewport.toastMaxWidth` (`420`). On narrow screens it shrinks with the safe content width and horizontal page margin.

## Interaction Rules

- New toast events replace the current toast immediately.
- Auto-dismiss duration is content-adaptive: title-only 3000ms, normal message 4500ms, long message over 90 characters 6000ms.
- `durationMs` may override the adaptive duration for documented product exceptions.
- Toasts are dismissible by default; `dismissible: false` is allowed only for short system feedback that must remain visible until timeout.
- Enter uses a short fade and upward-to-position motion. Manual and automatic dismissal use the same exit animation.
- Toast content must be announced through accessibility feedback where supported.

## Rules

- Toast text must come from i18n keys.
- Errors that require action must also appear inline or on the page.
- Toasts must not block access to bottom sheets or modal recovery paths.
- Page code must not recreate global feedback surfaces; use `useToast()` and the shared `ToastProvider`.
- Auth form validation keeps inline field errors for recovery and uses the global Toast for transient blocked-submit feedback.
