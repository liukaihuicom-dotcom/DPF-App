# Color Tokens

## Brand

| Token | Value | Use |
|---|---|---|
| brand.teal | `#2EB5C4` | Accent, selected state, focus, badges, icons |
| brand.teal.active | `#2399A5` | Pressed or active accent |
| brand.teal.disabled | `#B9E5EA` | Disabled accent |

## Semantic Runtime Palette

| Semantic Token | `ThemePalette` Field | Use |
|---|---|---|
| bg.app | `bg` | Screen background |
| surface.panel | `panel` | Main card and tab surfaces |
| surface.panelHigh | `panelHigh` | Elevated or high emphasis card |
| surface.panelSoft | `panelSoft` | Neutral button and subtle fill |
| border.default | `line` | Dividers and prominent card borders |
| border.soft | `lineSoft` | Subtle card borders |
| text.primary | `text` | Primary text |
| text.muted | `textMuted` | Secondary text |
| text.dim | `textDim` | Tertiary text |
| state.up | `up` | China-style positive/up movement in this app |
| state.down | `down` | China-style negative/down movement in this app |
| state.warning | `amber` | Review, pending, risk caution |
| state.danger | `danger` | Error and destructive action |

## Dark Theme Contrast Rules

Dark modes must preserve a clear separation between page background, card surfaces, borders, and text. The runtime dark palettes use a near-black `bg`, visibly raised `panel` / `panelHigh`, stronger `line` / `lineSoft`, and brighter secondary text so dense financial content remains readable.

| Surface Pair | Minimum Intent |
|---|---|
| `bg` to `panel` | Cards must read as a distinct surface without relying only on shadow |
| `panel` to `panelHigh` | Elevated cards, sheets, and active regions must step up visibly |
| `panel` to `lineSoft` | Ordinary cards, inputs, lists, and bottom bars must keep a perceptible edge |
| `panel` to `textMuted` | Secondary text must remain comfortable for body-level reading |
| `panel` to `textDim` | Tertiary text is quiet but cannot fall below placeholder/readability baseline |

Shared surfaces such as `Card`, `TextField`, tab bars, bottom sheets, quick-action rows, and list frames must consume these semantic fields instead of defining local dark colors.

## Text Color System

All text color decisions must start from information meaning, not visual preference. Page builders choose typography with `AppText variant` and choose color with `AppText tone`; they should not invent local text colors.

| Text Token | Runtime Use | Code Mapping | Allowed Use | Forbidden Use |
|---|---|---|---|---|
| text.primary | Primary content | `AppText tone="default"` / `palette.text` | Page titles, section titles, key fields, core amounts, primary body text, selected labels | Decorative emphasis or inverse text on filled surfaces |
| text.secondary | Supporting content | `AppText tone="muted"` / `palette.textMuted` | Helper copy, subtitles, list details, normal metadata, secondary body text | Weakening required risk or legal text |
| text.tertiary | Low-priority content | `AppText tone="dim"` / `palette.textDim` | Eyebrow labels, placeholders, disabled hints, quiet metadata, non-actionable timestamps | Main body copy, active controls, important financial values |
| text.brand | Brand or active emphasis | `AppText tone="brand"` / `palette.brand` | Current module, selected state, brand entry, primary action context | Making ordinary headings look brighter |
| text.warning | Pending or caution | `AppText tone="amber"` / `palette.amber` | Pending, review, caution, risk attention that is not failed | Decorative labels or ordinary categories |
| text.danger | Error or destructive | `AppText tone="danger"` / `palette.danger` | Error, failed, rejected, blocked, destructive action | Ordinary negative mood, marketing urgency, non-risk emphasis |
| text.up | Market up direction | `AppText tone="up"` / `palette.up` | Real market movement, PnL, trade direction using China-style up semantics | Generic success, approval, completed state |
| text.down | Market down direction | `AppText tone="down"` / `palette.down` | Real market movement, PnL, trade direction using China-style down semantics | Generic success, approval, completed state |
| text.info | Informational accent | `AppText tone="blue"` or `tone="cyan"` | Informational hints, link-like secondary actions, system guidance | Page decoration or arbitrary visual variety |
| text.inverse / on-fill | Component-owned contrast text | Component internal foreground mapping | Filled buttons, dark message bubbles, logo marks, toast/status surfaces | Page-level `style={{ color: palette.white }}` or `palette.panel` |

## Text Color Selection

1. Pick the information role first: primary, secondary, tertiary, status, market direction, or inverse.
2. Use `AppText tone` for normal text. Keep `variant` responsible only for size and weight.
3. Use status tones only when the text can be traced to a real business state.
4. Use `up` and `down` only for real market movement, PnL, and trading direction.
5. Let components own contrast foregrounds for filled surfaces. Pages should pass component props, not handwrite inverse colors.
6. If the required meaning is missing, add a semantic token and document allowed and forbidden uses before page implementation.

## Forbidden Text Color Usage

- Do not use `style={{ color: palette.* }}` for ordinary page text.
- Do not use raw hex, `rgb`, `rgba`, `hsl`, or transparency strings for text colors outside token source files and registered component internals.
- Do not use `brand`, `danger`, `amber`, `up`, or `down` to make text feel more important without a matching business state.
- Do not define local text color variables such as `primaryColor`, `grayText`, `lightText`, or `activeText` in page code.
- Do not use native `Text` for new page text; use `AppText` so tone and variant stay governed.
- Do not use `palette.white` or `palette.panel` directly for text in page code. Use component-owned inverse foreground behavior.

## Component-Owned Foreground Exceptions

Some components need dynamic or inverse text color to preserve contrast. These cases must stay inside shared component implementations or documented business components:

- `ActionButton` foreground for `filled`, `outline`, `text`, disabled, and loading states.
- `StatusPill` state text mapping.
- `TextField` input, disabled input, placeholder, helper, and error text.
- `Toast` title and status foreground mapping.
- Message bubbles, logo marks, and filled operation surfaces that need inverse foreground.
- Web form controls that cannot consume `AppText`, such as the existing product control select shell.

## Rule

Raw hex values belong in token source files only.
