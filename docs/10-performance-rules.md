# Performance Rules

| Area | Risk | Strategy |
|---|---|---|
| Quote stream | Frequent updates can rerender lists | Map only changed instruments and keep sparkline arrays bounded |
| Long lists | Client, order, and transaction lists may grow | Use virtualized lists before production scale |
| Forms | Duplicate submit | Use submitting state and disabled controls |
| Images and icons | Unnecessary bundles | Prefer existing icon set and avoid large bitmap assets for utility UI |
| Web startup | Local proxy dependency | Surface quote failure and continue with last known mock quotes |
| i18n | Re-render churn | Keep dictionary lookup stable through settings provider |

## Acceptance

- New data pages must define loading, empty, and error states.
- New operations must define retry and duplicate-submit behavior.
- New real-time features must define throttling or batching strategy.

