# i18n Registry

Runtime translations currently live in `src/i18n/translations.ts`.

Rules:

- Add every user-visible key to both `en-US` and `zh-CN`.
- Use API `messageKey` values from `api-contracts/error-codes.json`.
- Keep business copy out of component internals where possible.

