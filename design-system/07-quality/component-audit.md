# Component Audit

| Component | Runtime File | Status | Next Step |
|---|---|---|---|
| Button | `src/components/ActionButton.tsx` | Shared + token-bound | Keep icon + label action API documented |
| Card | `src/components/Card.tsx` | Shared + token-bound | Keep token bindings documented |
| Screen | `src/components/Screen.tsx` | Shared + token-bound | Maintain 12px `layout.screenPaddingX` page content padding and add page-state helper if repeated |
| Typography | `src/components/Typography.tsx` | Shared + token-bound | Page code must use variants or `typography` tokens |
| Bottom Sheet | `src/components/BottomSheet.tsx` | Production shared | Maintain explicit header-mode presets, 12px `layout.screenPaddingX` header/content/footer padding, component-owned fixed title bar without divider, 20px `sheetTitle` title token, matching header spacer, primary-color header icons, semantic left slot, business-only right action, headerless modes with no spacer gap, nested push/back navigation, tap-to-close full-stage backdrop, page-width centered sheet, dynamic height, fixed footer action area with icons, max-height safe-area cap, a11y, dismiss behavior, and all-page interaction acceptance |
| Toast | `src/feedback/Toast.tsx` | Shared | Ensure type coverage |
| Input | `src/components/TextField.tsx` | Shared + token-bound | Keep direct `TextInput` limited to wrapper |
| Status | `src/components/StatusPill.tsx` | Shared + token-bound | Continue replacing purely semantic local badges |
| Fund Action Grid | `src/components/FundActionGrid.tsx` | Shared + refined | Decorative action icons are plain 24px glyphs inside a 40px visual box without tinted circular backgrounds or outline frames; deposit is green, withdraw is yellow, transfer is blue; tile structure may keep token-bound card borders |
| Quick Action Sheet | `src/components/QuickActionSheet.tsx` | Aligned | Uses the same header/content/bottom-safe sheet structure |
