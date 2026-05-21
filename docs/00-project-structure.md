# Project Structure

## Target Structure

```txt
.
├── app/                         Expo Router runtime screens
├── src/                         Production source code
│   ├── components/              Shared UI components
│   ├── domain/                  Trading, formatting, account domain logic
│   ├── feedback/                Toast and haptics
│   ├── i18n/                    Runtime translations
│   ├── icons/                   Icon mapping
│   ├── settings/                Product settings provider
│   ├── state/                   Broker store and state transitions
│   └── theme/                   Runtime tokens and palette
├── assets/                      Expo runtime assets
├── docs/                        Product delivery docs
├── design-system/               Design system governance
├── api-contracts/               API schemas, mocks, errors, OpenAPI
├── handoff/                     Page delivery templates and packages
├── qa/                          QA gate metadata and visual artifacts
├── scripts/
│   ├── dev/                     Local development utilities
│   └── qa/                      Executable QA gate scripts
├── tests/                       Test strategy and future test suites
└── archive/                     Deprecated or legacy files excluded from build
```

## Root Rules

- Root directory keeps only app configuration, package management, top-level docs, and production delivery entry directories.
- Screenshots and visual verification artifacts live in `qa/visual/`.
- Local development scripts live in `scripts/dev/`.
- QA scripts live in `scripts/qa/`.
- Legacy template code lives in `archive/` and is excluded from TypeScript compilation.
- New production source files must go under `src/` or `app/`, not root-level feature folders.

## Migration Record

| From | To | Reason |
|---|---|---|
| Root `*-verification.png` files | `qa/visual/` | Keep visual verification artifacts out of the runtime root |
| Root `trader-productized-home.png` | `qa/visual/` | Same visual QA artifact grouping |
| Root `scripts/check-*.js` | `scripts/qa/` | Separate executable QA gate from local dev utilities |
| Root `scripts/dev-with-quotes.cjs` and `scripts/quote-proxy.cjs` | `scripts/dev/` | Local development utilities |
| Root `components/useClientOnlyValue*` and `components/useColorScheme*` | `archive/legacy-expo-template/components/` | Unused Expo template remnants |
| Empty route groups `app/(partner)` and `app/(trader)` | removed | Empty directories do not define production routes |
| Empty `constants/` and `components/__tests__/` | removed | Avoid misleading ownership boundaries |

## Acceptance

- `pnpm qa:all` passes.
- `pnpm exec tsc --noEmit` passes.
- Root directory contains no visual QA screenshots.
- Runtime code is under `app/`, `src/`, and `assets/`.

