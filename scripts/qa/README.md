# QA Scripts

Run all checks:

```sh
corepack enable
pnpm qa:all
```

Fallback when pnpm is not available in the current shell:

```sh
node scripts/qa/qa-all.js
```

The scripts are intentionally small Node checks so they can run without a separate test framework.

The root `scripts/qa/` directory is the single executable QA source for product delivery, design-system governance, API contract, handoff, accessibility, security, localization, icon, component, and version gates.
