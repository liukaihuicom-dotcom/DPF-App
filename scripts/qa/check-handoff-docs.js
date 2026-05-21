const { complete, requireFiles } = require('./qa-utils.cjs');

complete('qa:handoff', requireFiles([
  'handoff/templates/page-spec.md',
  'handoff/templates/field-spec.md',
  'handoff/templates/state-spec.md',
  'handoff/templates/interaction-spec.md',
  'handoff/templates/component-usage.md',
  'handoff/templates/api-contract.md',
  'handoff/templates/i18n-keys.md',
  'handoff/templates/accessibility-spec.md',
  'handoff/templates/performance-spec.md',
  'handoff/templates/security-risk-spec.md',
  'handoff/templates/acceptance-checklist.md',
], 'QA_HANDOFF'));

