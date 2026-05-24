# Typography Tokens

| Token | Size | Weight | Use |
|---|---:|---:|---|
| display.xl | 28 | 700 | Screen-level hero number or title |
| display.lg | 22 | 500 | Primary page title |
| title.md | 16 | 600 | Section title and card headline |
| title.sm | 16 | 500 | Secondary section title |
| sheet.title | 20 | 600 | Global bottom sheet title bar |
| body.md | 14 | 400 | Main body text |
| body.sm | 14 | 400 | Dense market rows and card body |
| caption | 14 | 500 | Labels and helper copy |
| caption.sm | 13 | 400 | Metadata |
| micro.label | 12 | 700 | Status tags |
| button.md | 16 | 600 | Primary and secondary button labels |

## Rules

- Letter spacing should be 0 unless a token explicitly defines a label treatment.
- Button and tab text must use fixed containers and `adjustsFontSizeToFit` where labels may localize longer.
- `variant` controls size, weight, and line height. `tone` controls text color.
- Do not choose a larger or heavier text variant just to avoid using the correct text color level.
- Do not use `brand`, `danger`, `amber`, `up`, or `down` to repair unclear typography hierarchy. Status tones require a real business state.
- Ordinary page text should use `AppText` with a semantic `tone`; direct `style.color` belongs only in registered component-owned foreground exceptions.
- Default body text is 14px. Larger 16px tokens are reserved for titles, controls, or explicit component roles.
