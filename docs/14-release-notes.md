# Release Notes

## 2026-05-25

### Changed

- Added governed Iconsax Free local-vendored icon assets with source manifest, checksum, and license restrictions while keeping Phosphor as the primary production UI icon library.
- Switched all non-brand product semantic icons to render the governed local Iconsax glyph assets while preserving existing `AppIcon` names and legacy aliases.
- Replaced the default Expo launcher, Android adaptive icon, and web favicon assets with the Dupoin brand mark.
- Rebuilt Discover as a configurable widget flow with entry and campaign widgets, four display sizes, and a low-emphasis Edit action.
- Updated the Discover layout editor to show iOS-style visual widget previews with drag feedback and inline size controls.
- Colored Discover menu entry icons with governed semantic foreground/background pairs and removed Ready/Demo/Preview entry status tags.
- Standardized rounded functional icon container backgrounds to grey `color.iconBg.*` tokens and migrated Discover feature-entry icons to `AppIconFrame`.
- Strengthened grey icon container contrast on grey app backgrounds while preserving the neutral icon-background system.
- Migrated the profile settings and support menu groups to the governed `GlobalMenuList` component, including switch, value, rating, icon, and chevron accessories.
- Added a profile/settings menu entry for setting a local security code, with immediate verification after setup.
- Added a profile/settings security-code switch so users can turn the local security code on or off.
- Replaced profile/settings switch visuals with the app-native React Native `Switch` and a 44px minimum touch target.
- Lowered the default visual emphasis of registered menu and card disclosure chevrons.
- Removed the divider under the trade order view tabs.
- Standardized page and bottom-sheet header icon controls to the 40px icon-plus-background treatment.
- Refined the Partner Portal referral hero with a reference-inspired copy and illustration layout.
- Polished the Partner Portal referral hero background and illustration stage for a lighter, more production-grade referral network presentation.
- Updated the Partner Portal referral invite CTA to use the product theme color.
- Removed the two signal tags from the Partner Portal referral hero.
- Replaced the Partner Portal referral hero visual with a transparent-background illustration that adapts to light and dark themes.
- Registered the referral-network illustration as a governed SVG renderer for icon QA.
- Updated bottom navigation selected icons to use filled icon style with brand color.
- Softened dark-theme semantic text tokens for `darkTerminal` and `midnightBlue` to improve reading comfort while retaining AA contrast for normal text.
- Unified level-2 page navigation titles with dialog and sheet top titles at 20px.
- Removed visible card border styling and standardized icon background containers to borderless fully rounded shapes.
- Refactored global toast feedback to use a dark top-navigation-aware surface with close control, adaptive timing, and motion.
- Added the governed `AppIconFrame` component with default grey, semantic, transparent, and smaller icon background size variants.

### Fixed

- Allowed demo login to enter the app after valid email/phone and password-format checks by marking the local auth session as signed in.
- Closed the portfolio account menu sheet before navigating to deposit, withdrawal, or transfer funding routes.

### Notes

- Funding entry navigation now dismisses its source sheet before opening the target funding page.

## 2026-05-21

### Added

- Initialized production delivery documentation for the existing Expo SDK 54 broker MVP.
- Added product modules, page map, roles, permission rules, business rules, state matrix, routing, platform, risk, performance, a11y, i18n, and team workflow docs.
- Added design system governance, API contract, handoff, QA, test, archive, and i18n scaffolding.
- Organized root files into production directories: `qa/visual/`, `scripts/dev/`, `scripts/qa/`, and `archive/legacy-expo-template/`.

### Notes

- No customer-facing screen behavior was changed.
- Existing local uncommitted work was preserved.
