# Runtime Mapping

| Existing Runtime Area | Funding Contract Impact |
|---|---|
| `/accounts` and account detail pages | Future funding entry points must remain disabled/demo-labeled until live APIs exist. |
| `src/domain/types.ts` transaction model | Existing `deposit`, `withdrawal`, `adjustment` demo transactions are not sufficient for production funding. |
| `docs/09-security-compliance-risk.md` | Funding contract expands deposit/withdrawal requirements into KYC, ownership, review, and audit rules. |
| Product Console | May simulate funding states later, but must not be treated as production admin. |

