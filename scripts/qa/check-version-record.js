const { complete, requireFiles } = require('./qa-utils.cjs');

complete('qa:version', requireFiles([
  'docs/14-release-notes.md',
  'design-system/08-release/versioning.md',
  'design-system/08-release/changelog.md',
  'design-system/08-release/deprecated.md',
], 'QA_VERSION'));

