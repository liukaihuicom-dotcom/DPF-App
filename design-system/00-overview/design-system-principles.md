# Design System Principles

## Positioning

This design system governs the Dupoin FX/CFD Expo app. It translates the existing `DESIGN.md`, `src/theme/colors.ts`, and shared React Native components into production rules that Codex and developers can reuse.

## Principles

| Principle | Rule |
|---|---|
| Business first | UI must represent product roles, permissions, risk, and state |
| Token constrained | Pages use semantic tokens and shared components before local styles |
| Mobile financial clarity | Layouts are dense enough for market data while staying readable on phone screens |
| Simulation honesty | Trading, balances, deposits, withdrawals, and partner data must remain clearly labeled as demo until live integration |
| Reusable patterns | Repeated trading, account, risk, partner, and onboarding blocks become business components |

## Visual Direction

- Warm white broker app, using Dupoin Teal `#2EB5C4` as the accent.
- Primary trading actions keep strong neutral contrast; teal is used for selection, focus, progress, badges, icons, and small accents.
- Cards are friendly but controlled, with 12 to 20 px radius depending on density.
- Typography uses modest display scale and avoids heavy enterprise weight unless required for market numbers.

