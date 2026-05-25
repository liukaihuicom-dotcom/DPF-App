# Development Scripts

| Script | Package Command | Purpose |
|---|---|---|
| `dev-with-quotes.cjs` | `pnpm start`, `pnpm dev:app`, `pnpm dev:app:tunnel` | Starts Expo and the local quote proxy together on fixed ports |
| `quote-proxy.cjs` | `pnpm quote-proxy` | Runs the local Dupoin quote proxy on port 8091 |

`dev-with-quotes.cjs` fails when Expo / Metro port `8081` or quote proxy port `8091` is already occupied. It does not switch ports automatically.
