const { complete, requireContains, requireFiles } = require('./qa-utils.cjs');

complete('qa:i18n', [
  ...requireFiles([
    'src/i18n/translations.ts',
    'docs/12-i18n-rules.md',
    'handoff/templates/i18n-keys.md',
    'i18n/en-US.json',
    'i18n/zh-CN.json',
  ], 'QA_I18N_FILE'),
  ...requireContains('src/i18n/translations.ts', ["'en-US'", "'zh-CN'"], 'QA_I18N_LOCALE'),
]);

