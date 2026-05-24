# i18n Rules

## Runtime Source

The current runtime source is `src/i18n/translations.ts` with `en-US` and `zh-CN` dictionaries.

## Key Rules

- User-visible business copy must use a translation key.
- New keys must be added to both locales in the same change.
- Error messages must map from stable error codes.
- Currency, date, and number formatting must use locale-aware helpers before production API integration.
- Route IDs, enum values, and API codes must not be translated.

## Naming

Use namespaced keys:

- `module.page.element`
- `order.error.margin`
- `auth.register.submit`
- `partner.upgrade.pending`

## Handoff

Each new page handoff must include an i18n key table with key, English copy, Chinese copy, usage, and fallback behavior.

