const { complete, requireFiles } = require('./qa-utils.cjs');

complete('qa:page', requireFiles([
  'README.md',
  'docs/00-project-structure.md',
  'docs/01-product-modules.md',
  'docs/02-page-map.md',
  'handoff/README.md',
  'handoff/templates/page-spec.md',
  'design-system/05-patterns/list-pattern.md',
  'design-system/05-patterns/detail-pattern.md',
  'design-system/05-patterns/form-pattern.md',
], 'QA_PAGE'));
