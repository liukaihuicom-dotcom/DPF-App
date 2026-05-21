const { complete, requireContains, requireFiles } = require('./qa-utils.cjs');

complete('qa:a11y', [
  ...requireFiles([
    'docs/11-accessibility-rules.md',
    'design-system/07-quality/accessibility-checklist.md',
    'handoff/templates/accessibility-spec.md',
  ], 'QA_A11Y_FILE'),
  ...requireContains('src/components/ActionButton.tsx', ['accessibilityRole="button"', 'accessibilityState'], 'QA_A11Y_BUTTON'),
]);

