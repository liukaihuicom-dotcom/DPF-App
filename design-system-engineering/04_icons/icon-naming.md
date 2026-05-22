# Icon Naming

## Semantic Names

Icon names exposed to product code use semantic camelCase names, not raw vendor glyph names.

- Good: `marketTrend`, `accountBank`, `riskShield`, `statusVerified`.
- Avoid in page code: `chart-line-up`, `bank`, `shield-check`, `check-circle`.

## Category Prefixes

- Market and quotes: `market*`, `quote*`, `globalMarket`.
- Trading and execution: `taskChecklist`, `historyClock`, `transferSwitch`.
- Account and funds: `account*`, `user*`, `qrCode`.
- Risk and KYC: `risk*`, `identity*`, `statusVerified`, `infoCircle`.
- System navigation: `navigate*`, `expand*`, `closeX`, `moreDots`, `searchGlass`.
- Support and growth: `support*`, `community*`, `reward*`, `education*`, `achievement*`.

## Vendor Glyphs

Vendor glyph names stay inside `icon-registry.json` and `src/icons/iconRegistry.ts`. They may be used by the low-level renderer only.
