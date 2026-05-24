# Navigation Component

## Runtime Components

- `src/components/AppTopBar.tsx`
- `src/components/GlobalMenuList.tsx`
- Expo Router `Stack`
- Expo Router `Tabs`

## Rules

- Page title and subtitle must come from i18n unless domain data provides localized text.
- Back controls must be accessible.
- Protected navigation requires page-level permission behavior.

## Global Menu List

`GlobalMenuList` is the shared menu-list component for account menus, sheet option menus, and future menu variants.

## Variants

| Variant | Use |
|---|---|
| `navigation` | Icon, label, and trailing navigation affordance. |
| `descriptive` | Icon, label, description, and trailing navigation affordance for sheet option lists. |

## Spacing Rules

- Menu rows must not own left or right outer spacing.
- Parent containers, cards, or bottom-sheet content own horizontal page spacing.
- Row variants may own vertical rhythm, icons, typography, dividers, and internal content gaps.
- Contained menu cards use the shared card radius token and must align to the sheet/content module width.
- Contained `flushRows` lists keep row separators full-width while the card owns the row content horizontal inset.
- Use `flushRows` for sheet option groups when the parent module controls outer module width and the card should own inner left/right spacing.
