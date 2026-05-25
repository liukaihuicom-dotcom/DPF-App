# Icon Usage Rules

## L5 Rules

- Pages and feature components must consume semantic `icon.*` registry keys through `AppIcon`.
- Product icons that need a visible background must use `AppIconFrame`; semantic icon tones auto-pair with matching transparent `colors.iconBg.*` backgrounds, neutral icons use `backgroundTone="neutral"`, and transparent/no-background slots use `backgroundTone="none"`.
- Rounded functional icon container backgrounds must follow the icon foreground family through `colors.iconBg.*`. For example, green success/down icons use transparent green backgrounds and warning icons use transparent amber backgrounds.
- Discover entry menu rows are the approved feature-entry exception: the left icon may use a governed semantic pair where `color.icon.*` foreground and matching `color.overlay.*.subtle` background share the same tone family. The mapping must live in the Discover page helper, use registered `AppIconFrame` icons, and stay limited to brand, info, success, warning, danger, up, or down semantics.
- `AppIcon` must render only local vendored icon components from `src/icons/local`; it must not import third-party icon runtime packages.
- `AppIcon` defaults to `color.icon.primary`, which resolves to the active theme text level 1 color (`colors.text.primary`) across all modes.
- Icon foreground color must resolve through `color.icon.*` / `colors.icon.*`; page and feature code must not use text, status, market, surface, or raw color tokens directly for icon glyphs.
- Icon container background color must resolve through `color.iconBg.*` / `colors.iconBg.*` by default, paired to the same semantic family as the icon foreground. The Discover entry menu exception may resolve through `color.overlay.*.subtle` only when paired with the matching governed icon foreground tone.
- Page and feature code may pass only governed `IconTone` names to `AppIcon` / `AppIconFrame`; it must not pass raw colors, `colors.*` values, hex strings, `rgb(a)`, or `hsl(a)` strings as icon tones.
- Compatibility aliases are allowed only when they resolve back to icon tokens: `brand` maps to `color.icon.active`, `blue` to `color.icon.info`, `amber` to `color.icon.warning`, `up/down` to market icon tokens, and `textDim/textMuted` to secondary/tertiary icon tokens.
- Phosphor remains an approved primary-source baseline for governance history and brand exceptions, while current product semantic functional icons render through governed local Iconsax assets.
- Iconsax Free is approved as both a governed local-vendored library asset source and the current semantic runtime glyph source. Library entries use `icon.iconsax.{source_category_slug}.{icon_slug}` with `registry_scope="library_asset"`; promoted product `icon.*` entries use `registry_scope="semantic"`.
- Hugeicons is blocked for production use and must not appear in dependencies, source code, registry entries, or design-system documentation except migration notes.
- Custom icons require a Custom Icon Request with ownership, style, license, token, and QA approval before use.
- Brand assets are not functional icons. Launcher icon, splash icon, favicon, and content logo are governed as brand assets.

## Financial Product Rules

- Use market tones `up` and `down` only when the icon communicates market direction or trading P/L direction.
- Use market background tones `color.iconBg.marketUp` and `color.iconBg.marketDown` only when the icon container communicates market direction or trading P/L direction.
- Use `danger` only for destructive, blocked, failed, or compliance-risk actions.
- Use `brand` only for selected, primary, verified, or product-owned icon semantics; runtime rendering must resolve it through `color.icon.active`.
- Do not use generic bank imagery for every account-related concept; wallet, trading account, banking, and identity icons must stay semantically distinct.
- Operations and rewards icons must not appear in core trading, funding, or risk paths unless the registry usage explicitly allows it.
- Dropdown and expandable controls must use `icon.system.chevron_down`; row disclosure must use `icon.system.chevron_right`.

## Size Rules

- Registry sizes must be limited to 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64.
- `AppIcon` defaults to `size.icon.md`, which is 24px.
- `size.icon.*` defines the stable layout canvas. The default functional icon canvas is 24x24.
- `size.iconGlyph.*` defines the visible glyph size inside that canvas. The default functional icon glyph is 21x21.
- Non-brand functional icons must render the 21px glyph centered inside the 24px canvas with 1.5px safe-area inset.
- Square, rectangle, circle, and balanced icon silhouettes must declare `shape_fit` in the registry so optical fit is governed instead of page-local adjusted.
- Runtime icon calls should use `sizeVariant` for governed icon sizes; concrete `size` is migration-compatible only for documented component-owned exceptions.
- 8px and 12px are only for micro indicators, badges, and dense helper cues; they are not default functional icon sizes.
- `AppIconFrame` supports `mini` / `xs` / `sm` / `md` / `lg` / `xl` / `display` frame sizes, with `mini` and `xs` reserved for dense non-touch slots unless an outer control provides the touch target.
- 48px and 64px are only for empty states, result states, feature entry visuals, and display business icons.
- Every registry entry must bind to `size.icon.*` and `color.icon.*` tokens.
- Icon containers and component manifests that declare a background token must bind it to `color.iconBg.*`.
- Rounded icon background containers must use `radius.full` and must not render a border line; hierarchy comes from the foreground/background token pair.

## Style Rules

- Linear icon stroke width must resolve to `lineWidth.icon.default`, which is 1.5px.
- `AppIcon` supports `styleVariant="line"` and `styleVariant="fill"`; default is `line`.
- Fill style is reserved for selected, active, state-emphasis, or business-emphasis scenarios.
- Page code must not simulate fill or stroke changes through local SVG overrides.

## Provider Rules

- Approved source libraries remain Phosphor, Remix Icon, Lucide, and governed Iconsax Free assets, but current non-brand product semantic icons must resolve to local Iconsax glyphs through `AppIcon`.
- Iconsax Free assets must be synced from the official `lusaxweb/iconsax` source package through `scripts/icons/sync-iconsax.js`; the Figma Community file is visual/category reference only, not a production source.
- Product semantic Iconsax mapping must be reapplied through `scripts/icons/switch-semantic-icons-to-iconsax.js` after any full Iconsax registry regeneration.
- Iconsax `AppIcon` style mapping is `line` to Linear and `fill` to Bold. Other Iconsax source styles are recorded in the source manifest but are not exposed as public `AppIcon` variants.
- Do not redistribute Iconsax as a standalone icon pack, resell the assets, or claim ownership/authorship of Iconsax artwork.
- Every semantic icon must carry source metadata: `source_library`, `source_icon_name`, `license`, `license.url`, `license.attribution_required`, and `modified`.
- Unknown-source SVG, competitor-derived glyphs, emoji, bitmap functional icons, and page-local functional SVG are blocked from production.
- Low-level icon runtime imports are blocked everywhere, including `src/components/AppIcon.tsx`; pages must only use semantic `AppIcon`.


## Local Asset Rules

- Every registry entry must declare `local_asset_path` under `src/icons/local/{source}/`.
- Local vendored icon files must keep source and license comments.
- Third-party icon runtime packages such as `phosphor-react-native`, `lucide-react-native`, `react-native-remix-icon`, and `@expo/vector-icons` are blocked from dependencies and source imports.

## Flag Asset Rules

- Country and region flags are governed visual assets, not functional system icons.
- Flag artwork source is `flag-icons` v7.5.0, MIT license, vendored under `src/assets/flags/flag-icons`.
- Flag rendering must go through `src/components/FlagIcon.tsx` or approved wrappers such as `CurrencyFlag`.
- `FlagIcon` supports `circle`, `square`, and `rectangle`; default shape is `circle`.
- `circle` and `square` use 1x1 assets; `rectangle` uses 4x3 assets.
- Do not use emoji flags, text-only country badges, unknown-source SVG, or page-local flag SVG for production UI.
