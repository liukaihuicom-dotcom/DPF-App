# Icon Usage

Default functional icons render at 24px through `size.icon.md`. Smaller or larger icons must use governed size variants from the design system, not page-local numbers.

| Context | Size | Color |
|---|---:|---|
| Micro indicator / badge | 8 / 12 | State token |
| Dense inline / helper cue | 16 | Text muted or state color |
| Bottom tab / small button / list row | 20 | Active brand, inactive text dim |
| Default functional icon | 24 | `color.icon.primary` |
| Feature card / empty state | 32 / 40 | Text dim or state color |
| Result state / display business icon | 48 / 64 | Text dim or state color |

## Foreground And Background Pairing

Icon foreground and icon background tokens are paired by semantic meaning. Use the pair as a component decision, not a page-local color recipe.

Use `AppIconFrame` for production icon backgrounds. It defaults to the base `md` frame, automatically pairs semantic icon tones with matching transparent background tones, supports `backgroundTone="none"` for transparent slots, and owns the governed `mini` / `xs` / `sm` / `md` / `lg` / `xl` / `display` size ladder.

| Scenario | Foreground | Background | Notes |
|---|---|---|---|
| Text-leading icon | `color.icon.primary` / `secondary` / `tertiary` | none | Match the adjacent text hierarchy through icon tokens, not text tokens. |
| Bottom navigation active | `color.icon.active` | none | Active state should also use fill or weight-up style where supported. |
| Bottom navigation inactive | `color.icon.tertiary` | none | Do not add background containers to inactive navigation icons. |
| Feature entry icon | `color.icon.secondary` | `color.iconBg.subtle` | Use a fully rounded, borderless container when the icon needs a tile. |
| Product-owned feature entry | `color.icon.active` | `color.iconBg.active` | For verified/product-owned actions and selected feature entries. |
| Info/transfer cue | `color.icon.info` | `color.iconBg.info` | For guidance, links to help, and transfer-style actions. |
| Success/completed state | `color.icon.success` | `color.iconBg.success` | Do not reuse for market-down direction unless the business meaning is market movement. |
| Warning/review/risk attention | `color.icon.warning` | `color.iconBg.warning` | Required risk information must remain visible and not be visually softened. |
| Failed/destructive/compliance risk | `color.icon.danger` | `color.iconBg.danger` | For destructive, rejected, failed, blocked, or compliance-risk actions. |
| Market up | `color.icon.marketUp` | `color.iconBg.marketUp` | Market direction only; `up = red`. |
| Market down | `color.icon.marketDown` | `color.iconBg.marketDown` | Market direction only; `down = green`. |
| Inverse surface | `color.icon.inverse` | `color.iconBg.inverse` | For dark, filled, image, or brand surfaces. |

## Scenario Rules

- Text-adjacent icons follow the same hierarchy as the text but must use `color.icon.*`, not `color.text.*`.
- Navigation icons use `color.icon.active` for selected and `color.icon.tertiary` for inactive; selected state cannot rely on color alone.
- Status icons use the matching `info`, `success`, `warning`, or `danger` foreground/background pair.
- Feature-entry icons may use a rounded `color.iconBg.*` container only when the icon needs a visible tile or semantic state surface.
- Risk and financial-direction icons must keep the business semantic token; do not swap warning, danger, market up, or market down for visual preference.

Linear icons use a 1.5px stroke through `lineWidth.icon.default`.

Use `line` as the default style. Use `fill` only for selected, active, state-emphasis, or business-emphasis scenarios.

## Iconsax Library Assets

Iconsax Free is available as a governed local asset library under `icon.iconsax.{source_category_slug}.{icon_slug}`. These full-source entries are library assets; production pages should still call the existing semantic `icon.*` names through `AppIcon`.

Current non-brand product semantic icons now render local Iconsax glyphs under the same `icon.*` API. Brand/provider marks such as Apple remain governed brand assets and are not forced through Iconsax.

`AppIcon` maps Iconsax `line` to Linear and `fill` to Bold. The source package and checksum are recorded in `design-system-engineering/04_icons/iconsax-source-manifest.json`; `iconsax-react-native` is not a runtime dependency.

When an icon sits on a colored or subtle background container, the container must be fully rounded (`radius.full`) and must not render a border line. Use background tone plus icon tone for hierarchy.

Do not use icons as the only indicator for financial up/down movement.

## Forbidden

- Do not hardcode icon foreground or background colors.
- Do not use `color.text.*`, `color.status.*`, `color.market.*`, or `color.surface.*` directly in icon calls when a `color.icon.*` or `color.iconBg.*` token exists.
- Do not create page-local alpha backgrounds such as `${color}12`; use `color.iconBg.*` or component-owned overlay tokens.
- Do not create page-local icon background wrappers when `AppIconFrame` can express the same semantic tone and size.
- Do not add borders to rounded icon background containers.
- Do not express financial up/down movement with color or icon alone; pair it with text, sign, direction, or accessible label.
