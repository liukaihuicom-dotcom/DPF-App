# Spacing Tokens

| Token | Value | Use |
|---|---:|---|
| space.2 | 2 | Hairline offsets |
| space.4 | 4 | Tight icon/text gaps |
| space.8 | 8 | Compact internal gaps |
| space.12 | 12 | Default page and bottom-sheet content horizontal padding, section gap, and compact card padding |
| space.16 | 16 | Default card padding and dense component internal padding |
| space.24 | 24 | Large card padding or grouped section spacing |
| space.32 | 32 | Bottom page padding and large vertical gap |
| space.48 | 48 | Hero and major section spacing |

## Runtime Mapping

- `Screen` uses 12 px horizontal padding, 12 px top gap, and 32 px bottom padding.
- Global BottomSheet content, header, and footer use the same 12 px horizontal padding through `layout.screenPaddingX`.
- `Card` uses 16 px default padding and 12 px compact padding.
- `ActionButton` uses 18 px horizontal and 12 px vertical padding.
