# Line Width Tokens

Line width tokens control ordinary UI borders, dividers, separators, and hairline rules. They are separate from color, spacing, and size tokens.

## Runtime Mapping

| Token | Value | Use |
|---|---:|---|
| `lineWidth.none` | 0 | Explicitly remove a border or divider |
| `lineWidth.hairline` | 0.5 | Default UI border and divider width |
| `lineWidth.default` | 0.5 | Alias for the default ordinary UI line |
| `lineWidth.strong` | 1 | Component-owned emphasis line, form field default border, or accessibility fallback |
| `lineWidth.selected` | 2 | Selected ring, active marker, or state emphasis owned by a component |

## Global Rule

All ordinary page, component, card, input, button outline, sheet, footer, list separator, and viewport border lines must use `lineWidth.hairline` by default.

Form field shells are a governed exception: default form fields use `lineWidth.strong` so interactive input boundaries remain visible across light and dark themes.

## Usage Rules

- Use `borderWidth`, `borderTopWidth`, `borderBottomWidth`, `borderLeftWidth`, or `borderRightWidth` with `lineWidth.hairline` for normal UI borders.
- Use `height: lineWidth.hairline` or `width: lineWidth.hairline` only for true visual divider views when a border cannot express the layout.
- Use `lineWidth.none` or `0` only when the component explicitly removes a border inherited from a shared style.
- Use `lineWidth.strong` for default form field shells and component-owned emphasis where 0.5px is too faint after visual QA.
- Use `lineWidth.selected` only for selected, checked, active, or focus-like state rings declared in the component spec.
- Keep line color separate. Width comes from `lineWidth`; color comes from `palette.line`, `palette.lineSoft`, or a registered state color.

## Component Mapping

| Component or Pattern | Required Line Width |
|---|---|
| Card and panel borders | `lineWidth.hairline` |
| Text field shell | `lineWidth.strong` for default, focused, inputting, validating, success, error, disabled, and readonly states |
| Button outline and filled button border | `lineWidth.hairline` |
| BottomSheet modal edge and fixed footer divider | `lineWidth.hairline` |
| Screen sticky footer divider | `lineWidth.hairline` |
| List row separators | `lineWidth.hairline` |
| App viewport side rails | `lineWidth.hairline` |
| Status pill border | `lineWidth.hairline` |
| Selected rings or active markers | `lineWidth.selected` when component-owned |

## Forbidden Usage

- Do not write `borderWidth: 1`, `borderBottomWidth: 1`, `height: 1`, or `width: 1` for ordinary UI lines.
- Do not use spacing tokens for line thickness.
- Do not use size tokens for line thickness unless the element is a real component dimension rather than a divider.
- Do not thicken lines for decoration. If hierarchy is weak, fix surface, spacing, typography, or color semantics first.
- Do not apply this token to icon stroke widths, SVG chart strokes, canvas drawings, brand marks, or financial visualization lines. Those are governed by icon or chart component specs.

## Exceptions

Allowed component-owned exceptions must be documented before use:

- Icon stroke widths and icon registry defaults.
- SVG, chart, sparkline, gauge, canvas, and brand visualization strokes.
- Selected or checked rings that require `lineWidth.selected`.
- Preview controls or visual swatches where line thickness is part of the control affordance.
- Platform rendering fallback if 0.5px becomes invisible on a verified target.
- Default form field shells that require a visible 1px boundary and state recognition through color instead of width.
