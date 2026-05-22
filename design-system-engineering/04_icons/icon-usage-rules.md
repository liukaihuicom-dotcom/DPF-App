# Icon Usage Rules

## L5 Rules

- Pages and feature components must consume semantic registry names through `AppIcon`.
- `AppIcon` renders Hugeicons production assets. `PhosphorIcon` is legacy and must not be imported by pages.
- Every icon must declare category, default size, allowed tone tokens, states, forbidden usage, and deprecation state.
- Core financial icons must use Hugeicons provider metadata and score at least 8 in `financeSemanticScore`.
- New functional icons must map to Hugeicons Stroke Rounded now, with a `proProviderIcon` for Hugeicons Pro Duotone/Twotone migration.
- Brand assets are not functional icons. Launcher icon, splash icon, favicon, and content logo are governed as brand assets.

## Financial Product Rules

- Use market tones `up` and `down` only when the icon communicates market direction or trading P/L direction.
- Use `danger` only for destructive, blocked, failed, or compliance-risk actions.
- Use `brand` for selected, primary, verified, or product-owned actions.
- Do not use generic bank imagery for every account-related concept; funds and account balance should use wallet/money imagery.
- Do not use generic chart imagery for every trading concept; market surfaces should prefer candlestick/market-specific icons.
- Operations and rewards icons (`rewardGift`, `promoTicket`, `achievementTrophy`) must not appear in core trading, funding, or risk paths.
- Dropdown and expandable controls must use `expandDown`, mapped to the chevron-style down arrow without a shaft.

## Size Rules

- Tab/navigation: 20.
- Top bar/action: 16-18, back navigation can use 22.
- Form/list prefix: 15-18.
- Feature entry: 20-24.
- Empty or key visual: 32-42.

## Provider Rules

- Current runtime provider: `hugeicons-free-stroke-rounded`.
- Target procurement provider: `hugeicons-pro-duotone-rounded`.
- Once Pro registry auth is available, swap imports from `@hugeicons/core-free-icons` to `@hugeicons-pro/core-duotone-rounded` using the existing `proProviderIcon` mapping.
