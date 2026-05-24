# Design System Engineering Scripts

Executable QA scripts are centralized in root `scripts/qa/`.

This directory records design-system script ownership and prevents duplicate QA implementations from drifting away from the release gate.

| Design-system area | Root script |
|---|---|
| Tokens and hardcoded styles | `scripts/qa/check-hardcoded-style.js` |
| Component manifest | `scripts/qa/check-component-manifest.js` |
| Component boundary | `scripts/qa/check-component-boundary.js` |
| Icons | `scripts/qa/check-icons.js` |
| Accessibility baseline | `scripts/qa/check-accessibility-baseline.js` |
| Full gate | `scripts/qa/qa-all.js` |
