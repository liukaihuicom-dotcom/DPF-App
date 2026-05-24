# Component QA Checklist

- `npm run qa:components` passes.
- `npm run qa:icons` passes with no blocker or critical issues.
- `npm run qa:style` does not add new page-local style exemptions.
- Route files in `app/` are thin Expo Router entrypoints.
- New reusable UI is exported through `src/components/index.ts` or a domain barrel.
- New business UI is registered in both component and business manifests when it affects financial workflows.
