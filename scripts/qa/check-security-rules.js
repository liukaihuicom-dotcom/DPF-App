const { complete, requireContains, requireFiles } = require('./qa-utils.cjs');

complete('qa:security', [
  ...requireFiles([
    'docs/09-security-compliance-risk.md',
    'handoff/templates/security-risk-spec.md',
    'api-contracts/error-codes.json',
  ], 'QA_SECURITY_FILE'),
  ...requireContains('docs/09-security-compliance-risk.md', [
    'Do not store card, bank, KYC, document, password, access token, or live trading credentials',
    'audit',
    'risk',
  ], 'QA_SECURITY_RULE'),
]);

