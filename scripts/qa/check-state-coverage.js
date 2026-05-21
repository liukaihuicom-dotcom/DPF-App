const { complete, requireContains } = require('./qa-utils.cjs');

complete('qa:state', requireContains('docs/06-state-machine.md', [
  'default',
  'loading',
  'empty',
  'error',
  'disabled',
  'inputting',
  'validating',
  'submitting',
  'success',
  'failed',
  'permission-denied',
  'restricted',
  'reviewing',
  'expired',
  'timeout',
], 'QA_STATE'));

