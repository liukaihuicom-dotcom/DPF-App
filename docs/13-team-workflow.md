# Team Workflow

## Branches

- Feature branches should use the `codex/` prefix unless the task specifies another branch.
- Delivery changes must not overwrite unrelated local work.

## Review Gates

| Review | Required For |
|---|---|
| Product review | New module, route, state, or business rule |
| Design review | Token, component, business component, or pattern change |
| Engineering review | Runtime, navigation, state management, or API contract change |
| QA review | Acceptance checklist, state coverage, i18n, a11y, and scripts |
| Risk review | KYC, funds, bank, order execution, partner approval, sensitive data |

## Change Records

Every production delivery change must update one of:

- `docs/14-release-notes.md`
- `design-system/08-release/changelog.md`
- A page-specific handoff changelog

