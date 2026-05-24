# Permission Matrix

| Capability | Guest | Trader | Partner | Funding Reviewer | Risk Compliance | Internal Operator |
|---|---:|---:|---:|---:|---:|---:|
| View own funding summary | no | yes | no | no | no | no |
| Create deposit | no | yes | no | no | no | no |
| Create withdrawal | no | yes, KYC required | no | no | no | no |
| Create same-owner transfer | no | yes, KYC required | no | no | no | no |
| View authorized client funding summary | no | no | summary only | no | no | no |
| View funding review queue | no | no | no | yes | yes | no |
| Approve/reject review | no | no | no | yes | yes | no |
| Configure channels | no | no | no | no | yes | yes |
| Configure limits/fees/FX policy | no | no | no | no | yes | no |

## Blocking Rules

- Guest access to funding pages must redirect to auth or show permission-denied.
- Partner cannot initiate deposit, withdrawal, or transfer for clients in V1.
- Demo, read-only, disabled, and archived accounts cannot execute production funding mutations.
- KYC must be approved before withdrawal or transfer.

