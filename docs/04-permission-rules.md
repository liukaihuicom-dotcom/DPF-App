# Permission Rules

| Feature | guest | trader | partner | Notes |
|---|---:|---:|---:|---|
| View onboarding | yes | yes | yes | Local demo only |
| View markets | limited | yes | yes | Partner can review market context |
| Place demo order | no | yes | no by default | Partner order access requires explicit trader role |
| View account assets | no | yes | yes | Partner sees relevant account and commission views |
| View partner clients | no | no | yes | Client data must remain simulated |
| Approve or reject upgrade request | no | no | yes | Requires partner role and pending state |
| Change product console settings | local only | local only | local only | Development overlay |

## UI Permission Behavior

- Hidden: routes that are not relevant to the role.
- Disabled: visible actions blocked by current state, with clear reason copy.
- Redirected: guest users attempting trading actions should be sent to onboarding or login.
- Restricted: risk or compliance blocks must show a next step, not a dead end.

