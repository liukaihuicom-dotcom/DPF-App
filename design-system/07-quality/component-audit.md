# Component Audit

| Component | Runtime File | Status | Next Step |
|---|---|---|---|
| Button | `src/components/ActionButton.tsx` | Shared | Keep API documented |
| Card | `src/components/Card.tsx` | Shared | Keep token bindings documented |
| Screen | `src/components/Screen.tsx` | Shared | Add page-state helper if repeated |
| Bottom Sheet | `src/components/BottomSheet.tsx` | Production shared | Maintain tap-to-close full-stage backdrop, page-width centered sheet, dynamic height, max-height safe-area cap, a11y, and dismiss behavior |
| Toast | `src/feedback/Toast.tsx` | Shared | Ensure type coverage |
| Input | `src/components/TextField.tsx` | Shared + migrated | Keep direct `TextInput` limited to wrapper |
| Status | `src/components/StatusPill.tsx` | Shared + migrated | Continue replacing purely semantic local badges |
| Quick Action Sheet | `src/components/QuickActionSheet.tsx` | Aligned | Uses the same header/content/bottom-safe sheet structure |
