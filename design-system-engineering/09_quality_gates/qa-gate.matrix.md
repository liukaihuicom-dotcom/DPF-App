# Design System QA Gate Matrix

| Gate | Evidence | Decision |
|---|---|---|
| Token QA | `token-qa.rules.json`, `scripts/qa/check-hardcoded-style.js` | Block on missing schema or direct primitive use |
| Component QA | `component-qa.rules.json`, `scripts/qa/check-component-manifest.js` | Block on missing manifest entries |
| Business Component QA | `business-component-qa.rules.json` | Block on missing business state or risk ownership |
| Icon QA | `icon-qa.rules.json`, `scripts/qa/check-icons.js` | Block on unregistered icons |
| Pattern QA | `pattern-qa.rules.json` | Block on missing recovery states |
| Platform QA | `platform-qa.rules.json`, route boundary checks | Block on unsupported platform behavior |
| AI Runtime QA | `ai-qa.rules.json` | Block on skipped read order |
| Code Mapping QA | `code-mapping-qa.rules.json` | Block on missing runtime mapping |
