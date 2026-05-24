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
├── design-system-engineering/   Machine-readable design-system governance
├── product-engineering-package/ Contract-driven product delivery package
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
- Product delivery validation ownership lives in `product-engineering-package/11_validation_scripts/` and maps to `scripts/qa/`.
- Machine-readable design-system governance lives in `design-system-engineering/`; human-readable design guidance remains in `design-system/`.
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
| `qa/*.png` visual artifacts | `qa/visual/` | Keep all visual verification artifacts in one QA-owned location |
| Product validation ownership | `product-engineering-package/11_validation_scripts/README.md` | Map L5 validation to shared `scripts/qa/` entrypoints |
| Design-system machine-readable governance | `design-system-engineering/` | Separate AI/QA/code-consumable assets from human-readable guidance |

## Acceptance

- `corepack enable` can activate the declared `packageManager`.
- `pnpm qa:all` passes in the standard package-manager environment.
- `node scripts/qa/qa-all.js` passes as the direct Node fallback.
- `pnpm exec tsc --noEmit` or `./node_modules/.bin/tsc --noEmit` passes.
- Root directory contains no visual QA screenshots.
- `qa/` root contains no visual QA screenshots; screenshots live in `qa/visual/`.
- Runtime code is under `app/`, `src/`, and `assets/`.
