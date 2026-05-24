# Release Rules

| Change Type | Version Impact | Required Record |
|---|---|---|
| New token | Minor | `design-system/08-release/changelog.md` |
| Token value change | Patch or minor | Changelog plus affected components |
| Token semantic change | Major | Migration note and owner review |
| New component variant | Minor | Component doc and changelog |
| Deprecated token or component | Minor | `design-system/08-release/deprecated.md` |
| Page pattern change | Patch or minor | Pattern doc and release note |

No token, component, business component, or pattern should be removed directly. Use deprecated management first.

