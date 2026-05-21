# API Client Mapping

## Current Runtime Sources

| Domain | Current Source | Future API |
|---|---|---|
| Instruments | `src/domain/mockData.ts` plus quote proxy | `GET /instruments`, quote stream |
| Account | `initialAccount`, recalculated in `src/domain/trading.ts` | `GET /accounts/current` |
| Orders | Local state in `BrokerStore` | `POST /orders`, order list endpoints |
| Positions | Local state from filled orders | Position endpoints and quote stream |
| Partner clients | `partnerClients` mock data | `GET /partner/clients` |
| Upgrade request | Local state with web localStorage persistence | Partner upgrade endpoints |

## Error Mapping

API errors must return stable `code` and `messageKey` fields. UI must resolve `messageKey` through `src/i18n/translations.ts`.

## Security Notes

Before live API integration, add authentication, idempotency, audit IDs, quote freshness, and server-side margin validation.

