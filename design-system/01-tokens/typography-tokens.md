# Typography Tokens

| Token | Size | Weight | Use |
|---|---:|---:|---|
| display.xl | 28 | 700 | Screen-level hero number or title |
| display.lg | 22 | 500 | Legacy compact display title |
| title.md | 16 | 600 | Section title and card headline |
| title.sm | 16 | 500 | Secondary section title |
| sheet.title | 20 | 600 | Global bottom sheet title bar |
| body.md | 14 | 400 | Main body text |
| body.sm | 14 | 400 | Dense market rows and card body |
| caption | 14 | 500 | Labels and helper copy |
| caption.sm | 13 | 400 | Metadata |
| micro.label | 12 | 700 | Status tags |
| button.md | 16 | 600 | Primary and secondary button labels |

## Title Role Matrix

All screen, dialog, card, list, and tab titles must use a governed title role. Product UI should choose the role by component context instead of manually choosing `fontSize`, `fontWeight`, or generic text variants.

| Role | Runtime variant | Source token | Size | Weight | Line height | Required use |
|---|---|---|---:|---:|---:|---|
| Page title | `title.page` | `display.xl` | 28 | 700 | 40 | Root screen title, auth page title, primary page header |
| Compact page title | `title.pageCompact` | `sheet.title` | 20 | 600 | 24 | Back-navigation level-2 page title, compact top bar title; must match dialog and sheet top navigation title size |
| Dialog title | `title.dialog` | `sheet.title` | 20 | 600 | 24 | Modal dialog title when a shared dialog is introduced |
| Bottom sheet title | `title.sheet` | `sheet.title` | 20 | 600 | 24 | Global bottom sheet title bar |
| Card title | `title.card` | `title.md` | 16 | 600 | 20 | Card header, empty-state card title, compact content module title |
| Section title | `title.section` | `title.md` | 16 | 600 | 20 | Screen section header above grouped content |
| List title | `title.list` | `caption` | 14 | 500 | 18 | List group title, date/group headers, sheet group title |
| List item title | `title.listItem` | `title.md` | 16 | 600 | 20 | Primary row title such as account number, instrument, transaction note |
| Segmented tab title | `title.tabs` | `caption` | 14 | 500 | 18 | In-page segmented tab labels |
| Bottom tab title | `title.bottomTabs` | `micro.label` | 12 | 700 | 16 | App-level Expo Router bottom tab labels |

## Body Role Matrix

| Role | Runtime variant | Source token | Size | Weight | Line height | Required use |
|---|---|---|---:|---:|---:|---|
| Primary body | `body.primary` | `body.md` | 14 | 400 | 20 | Standard paragraphs and readable explanatory copy |
| Secondary body | `body.secondary` | `body.sm` | 14 | 400 | 20 | Dense card body, empty-state body, secondary descriptions |
| Dense body | `body.dense` | `body.sm` | 14 | 400 | 20 | Table-like rows, market rows, compact lists |
| Prominent body | `body.prominent` | `body.lg` | 16 | 400 | 22 | Auth subtitles, onboarding lead copy, toast titles, long-form high-emphasis copy |

## Label And Minimum Text Matrix

| Role | Runtime variant | Source token | Size | Weight | Line height | Required use |
|---|---|---|---:|---:|---:|---|
| Default label | `label.default` | `caption` | 14 | 500 | 18 | Field labels, list group labels, chart labels |
| Helper label | `label.helper` | `caption.sm` | 13 | 400 | 16 | Helper text, secondary metadata, subtitles inside compact components |
| Metadata label | `label.metadata` | `caption.sm` | 13 | 400 | 16 | Time, reference id, auxiliary one-line data |
| Field label | `label.field` | `body.sm` | 14 | 400 | 20 | Form-field visible labels when not using compact label treatment |
| Control label | `label.control` | `caption` | 14 | 500 | 18 | Segmented tabs, text links, compact control labels |
| Status label | `label.status` | `micro.label` | 12 | 700 | 16 | Status tags, badges, toast status word |
| Minimum label | `label.minimum` | `micro.label` | 12 | 700 | 16 | Short legal-safe metadata or helper labels where space is constrained |

## Rules

- Letter spacing should be 0 unless a token explicitly defines a label treatment.
- Button and tab text must use fixed containers and `adjustsFontSizeToFit` where labels may localize longer.
- `variant` controls size, weight, and line height. `tone` controls text color.
- Page, dialog, card, list, and tab titles must use `title.*` semantic variants through `AppText` or component-owned mappings such as `titleTypography`.
- Body text must use `body.*` semantic variants. Do not use `caption` to make body text smaller.
- Labels, helper text, metadata, statuses, and compact controls must use `label.*` semantic variants.
- Minimum text is 12px through `label.minimum`, `label.status`, or `title.bottomTabs` only. Do not introduce text below 12px.
- Do not use generic `title`, `subtitle`, `body`, `caption`, `displayXl`, `displayLg`, `titleMd`, `sheetTitle`, `captionSm`, or `microLabel` for governed title/body/label roles in new code. Legacy aliases exist only for migration compatibility.
- Do not hardcode title `fontSize`, `fontWeight`, `lineHeight`, or `letterSpacing` outside `src/theme/tokens.ts` and governed typography components.
- Do not choose a larger or heavier text variant just to avoid using the correct text color level.
- Do not use `brand`, `danger`, `amber`, `up`, or `down` to repair unclear typography hierarchy. Status tones require a real business state.
- Ordinary page text should use `AppText` with a semantic `tone`; direct `style.color` belongs only in registered component-owned foreground exceptions.
- Default body text is 14px. Larger 16px tokens are reserved for titles, controls, or explicit component roles.
