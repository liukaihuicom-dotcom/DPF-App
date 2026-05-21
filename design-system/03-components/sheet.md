# Sheet Component

## Runtime Component

`src/components/BottomSheet.tsx`

Built on `@gorhom/bottom-sheet` and mounted from the app root through:

- `GestureHandlerRootView`
- `SafeAreaProvider`
- `BottomSheetModalProvider`

## Usage

Use for global mobile action menus, order options, filters, account menus, and contextual detail flows.

`QuickActionSheet` keeps its independent trigger, but must follow the same three-zone structure.

## API

`useBottomSheet()` returns `show(options)` and `hide()`.

| Prop | Type | Required | Description |
|---|---|---:|---|
| title | string | yes | Header navigation title |
| subtitle | string | no | Header supporting context |
| content | ReactNode | yes | Scrollable middle content |
| footer | ReactNode or BottomSheetAction[] | no | Fixed bottom action area |
| snapPoints | Array<string \| number> | no | Optional override |

`BottomSheetAction` supports `label`, `onPress`, `tone`, `disabled`, `loading`, and `accessibilityLabel`.

## Structure

- Header navigation area: title, optional subtitle, close button.
- Scrollable content area: default internal scroll for long content.
- Fixed footer action area: action buttons plus bottom safe area.
- Backdrop is rendered by the app-owned `AppBottomSheetBackdrop`, not the library default backdrop, and tapping it closes the sheet.
- The global sheet host sits above `AppViewport`; backdrop covers the full app stage while the sheet surface aligns to the active app page width.

## Height

- Default height is adaptive to the rendered header, content, and footer.
- Short content must not be forced to a minimum opening height.
- Long content is capped by `maxDynamicContentSize`: screen height minus top safe area and `24px` reserve.
- `snapPoints` is an explicit business override only. Do not use a default minimum snap point for global sheets.

## Width

- Native and narrow mobile viewports use the full available page width.
- Web/tablet viewports center the sheet inside the active app page width.
- Current production cap: `430px`, matching `AppViewport` so global sheets do not stretch across the browser stage.
- Do not constrain the modal container to `430px`; keep the overlay full-screen and center only the sheet surface.

## Required States

default, opening, open, closing, disabled action, loading action, failed action.

## A11y

- Sheet title must describe the context.
- Dismiss paths must be available through the backdrop, pan-down gesture, and header close button.
- Backdrop must not be exposed as a named focusable button; use the header close button for explicit close semantics.
- Icon-only actions in sheets need labels.
