# Product Engineering Package

This package implements the product contract for the V1 trading account funding system.

## Scope

- Direct-to-trading-account funding model.
- Indonesia-first IDR deposit and withdrawal with USD trading account settlement.
- Deposit, withdrawal, and same-owner internal transfer.
- Product contract only. No Expo, UI, payment provider, or production API code is implemented here.

## Entry Points

- `00_product_kernel/product.kernel.json`
- `03_business_rules/business-rule.matrix.json`
- `03_business_rules/state-machine.yaml`
- `04_page_contracts/page-contract.index.md`
- `05_api_contracts/openapi.draft.yaml`
- `09_traceability_and_tests/traceability.matrix.md`
- `10_release_management/release-decision.report.md`

