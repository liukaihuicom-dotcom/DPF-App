# Page Contract Index

| Page Group | Contract | Purpose | Next Stage |
|---|---|---|---|
| App/H5 Funding | `pages/app-funding.page-contract.json` | Trader deposit, withdrawal, transfer, and funding history. | Requires Design System, Financial Copy, UI Build, UX Gate before implementation. |
| Admin Funding | `pages/admin-funding.page-contract.json` | Manual review, channel config, limit/fee config, exception reconciliation. | Requires Admin permission design and risk/compliance approval. |
| App/H5 Partner Client List | `pages/app-partner-client-list.page-contract.json` | Partner second-level downline client list and profile review entry. | Requires privacy, permission, audit, long-list, and API integration before production. |

## Required States

Every page must support:

- default
- loading
- empty
- error
- disabled
- submitting
- success
- failed
- permission-denied
- restricted

## Implementation Note

This package does not add Expo routes. Route ids are drafts in `01_modules_and_navigation/route.map.json`.
