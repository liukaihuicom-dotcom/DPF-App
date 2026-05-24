# Spacing Tokens

Spacing is a full-site layout system, not a page-level visual guess. Every page, shared component, business component, sheet, form, list, card, footer, and operation area must map spacing back to this scale or to a documented layout token.

| Token | Value | Use |
|---|---:|---|
| space.0 | 0 | Flush layout reset, no padding, no gap |
| space.2 | 2 | Hairline alignment, badge micro spacing, graph or icon optical offsets |
| space.4 | 4 | Icon/text micro gap, eyebrow/title gap, dense metadata spacing |
| space.8 | 8 | Small control internal gap, button icon/text gap, compact list-item inner spacing |
| space.12 | 12 | Default page module gap, bottom-sheet content gap, form field group gap, compact card padding |
| space.16 | 16 | Standard card padding, list-row horizontal padding, dense component primary padding |
| space.24 | 24 | Section group spacing, large card internal region spacing, main page content grouping |
| space.32 | 32 | Page bottom breathing room, end-of-content spacing, sticky-footer buffer |
| space.48 | 48 | First-viewport hero spacing, major page breaks, large empty-state breathing room |

## Layout Tokens

| Layout Token | Runtime Mapping | Use |
|---|---|---|
| `layout.screenPaddingX` | `spacing.lg` / 16 | Full-site page horizontal padding and bottom-sheet horizontal alignment |
| `layout.screenGap` | `spacing.md` / 12 | Default vertical gap between page modules |
| `layout.screenBottomPadding` | `spacing.xxl` / 32 | Scroll page bottom padding |
| `layout.touchTargetMin` | 44 | Minimum interactive hit area; not a generic spacing token |
| `layout.sheetHeaderHeight` | 56 | Fixed bottom-sheet title bar height; not a generic gap or padding token |
| Icon box sizes | component-owned layout values | Icon visual reservation; not generic spacing |

## Global Spacing Policy

- Full-site UI work must use this spacing scale. New pages and components may not guess local values such as `7`, `10`, `13`, `14`, `18`, or `20`.
- Design references must be mapped to the nearest existing spacing token. If a reference needs a new value, create a design-system change before implementation.
- UI Build handoff must report spacing tokens used by the page and any documented exceptions.
- Existing hardcoded spacing is a migration backlog, not an allowed pattern. When a legacy page is touched, migrate ordinary spacing to tokens in the same change.
- Do not expand the legacy baseline without a design-system review.

## Usage Rules

### Gap

- Use `gap` for relationships between siblings inside the same parent.
- Page flows should prefer parent `gap` over child `marginTop` or `marginBottom`.
- Use `layout.screenGap` for default page module rhythm.
- Use `spacing.xs` and `spacing.sm` for micro and compact groups.

### Padding

- Use `padding` for internal space owned by a container.
- Page horizontal padding must come from `Screen` or `layout.screenPaddingX`.
- Card padding must come from `Card` default or compact specs unless a business component documents another rule.
- BottomSheet header, content, and footer must share `layout.screenPaddingX`.
- Form groups, list rows, status panels, and operation areas must declare their spacing in the component or pattern documentation.

### Margin

- Use `margin` only for relationships outside the current parent when `gap` cannot express the layout.
- Avoid stacking page sections with child `marginTop`; move spacing to the parent container.
- Negative margin is forbidden for normal alignment fixes. Use layout structure, component sizing, or a documented pattern token.

### Insets And Offsets

- `top`, `right`, `bottom`, `left`, and absolute/fixed offsets are allowed only for overlays, backdrops, graph labels, floating controls, sheet layers, and other component-owned positioning.
- Absolute offsets must not be used to repair normal page flow spacing.
- Chart/canvas/SVG offsets and optical icon offsets must stay in the owning component and be documented as exceptions.

## Runtime Mapping

- `Screen` uses 16 px horizontal padding, 12 px top gap, and 32 px bottom padding.
- White-background page shells, including `AuthShell`, use 16 px horizontal padding through `layout.screenPaddingX`.
- Global BottomSheet content, header, and footer use the same 16 px horizontal padding through `layout.screenPaddingX`.
- `Card` uses 16 px default padding and 12 px compact padding.
- `ActionButton` uses 18 px horizontal and 12 px vertical padding.

## Full-Site Application

- New page contracts and UI Build output must read this file before layout work.
- Shared components must consume `spacing` or `layout` tokens directly.
- Page code should compose shared components instead of re-declaring padding for cards, sheets, inputs, buttons, or list rows.
- Legacy pages with hardcoded spacing must be migrated gradually, starting with high-frequency pages: markets, portfolio, quick, account, and instrument.
