# Design Principles

Source of truth: `design-system/00-overview/design-system-principles.md`.

This engineering layer does not redefine visual direction. It maps the governed design-system documentation into machine-readable assets, QA gates, and code mappings.

## Production Rules

- UI work must consume product contracts before page implementation.
- Components must bind to registered tokens, component manifests, patterns, and icon registry entries.
- New visual decisions require a token, component, pattern, or documented migration record.
- Page-local one-off styles are not production ready unless explicitly recorded as a temporary migration exception.
