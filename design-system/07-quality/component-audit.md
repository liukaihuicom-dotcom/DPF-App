# Component Audit

| Component | Runtime File | Status | Next Step |
|---|---|---|---|
| Button | `src/components/ActionButton.tsx` | Shared + token-bound | Keep icon + label action API documented |
| Size Tokens | `src/theme/tokens.ts` | Runtime design-system primitive | Shared controls must map fixed height, min/max dimensions, icon size, touch target, sheet height, tabbar height, and viewport width through `size` or documented `layout` aliases |
| Card | `src/components/Card.tsx` | Shared + token-bound | Keep token bindings documented |
| Screen | `src/components/Screen.tsx` | Shared + token-bound | Maintain 16px `layout.screenPaddingX` page content padding and add page-state helper if repeated |
| Typography | `src/components/Typography.tsx` | Shared + token-bound | Page code must use variants or `typography` tokens |
| Segmented Tabs | `src/components/SegmentedTabs.tsx` | Shared + token-bound | Use for in-page mutually exclusive choices such as order type and filters; do not recreate page-local segmented rail styles |
| Bottom Sheet | `src/components/BottomSheet.tsx` | Production shared | Maintain explicit header-mode presets, 16px `layout.screenPaddingX` header/content/footer padding, component-owned fixed title bar without divider, 20px `sheetTitle` title token, matching header spacer, primary-color header icons, semantic left slot, business-only right action, headerless modes with no spacer gap, nested push/back navigation, tap-to-close full-stage backdrop, page-width centered sheet, content-first dynamic height, fixed footer action area with icons, max-height safe-area cap with scroll only after overflow, a11y, dismiss behavior, and all-page interaction acceptance |
| Toast | `src/feedback/Toast.tsx` | Shared + governed global feedback | Keep dark global surface, fixed left-icon/copy/right-close-slot structure, 16px wrapping title, title/body variant support, max-width cap, reserved close slot, i18n copy, a11y announcement, and no page-local toast variants |
| Form Field Set | `src/components/TextField.tsx` | Shared + token-bound | `TextField`, `SelectField`, and `RichTextField` own floating labels, neutral focus borders, feedback states, and direct `TextInput` / select usage |
| Global Menu List | `src/components/GlobalMenuList.tsx` | Shared + variant-ready | `navigation` and `descriptive` variants own row content, dividers, and vertical rhythm; `flushRows` lets sheet parents own left/right spacing |
| Key Value List | `src/components/KeyValueList.tsx` | Shared + variant-ready | `compact` and `detail` variants own label/value alignment, dividers, and fill behavior; parent cards or sheets own left/right spacing |
| Status | `src/components/StatusPill.tsx` | Shared + token-bound | Continue replacing purely semantic local badges |
| Fund Action Grid | `src/components/FundActionGrid.tsx` | Shared + refined | Decorative action icons are plain 24px glyphs inside a 40px visual box without tinted circular backgrounds or outline frames; deposit is green, withdraw is yellow, transfer is blue; tile structure may keep token-bound card borders |
| Quick Action Sheet | `src/components/QuickActionSheet.tsx` | Aligned | Uses the same header/content/bottom-safe sheet structure |
