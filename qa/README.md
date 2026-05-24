# QA Gate

Run all production delivery checks with:

```sh
corepack enable
pnpm qa:all
```

Fallback when pnpm is not available in the current shell:

```sh
node scripts/qa/qa-all.js
```

The scripts validate the initialized production delivery package, design-system governance assets, API contract scaffold, handoff templates, and baseline security rules.

Visual verification artifacts must live in `qa/visual/`, not the `qa/` root.
