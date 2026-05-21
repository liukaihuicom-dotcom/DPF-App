const { complete, fail, pass, read, requireFiles, walk } = require('./qa-utils.cjs');

const allowedFiles = new Set([
  'src/theme/colors.ts',
  'src/icons/phosphor.ts',
]);

const sourceFiles = ['app', 'src']
  .flatMap((dir) => walk(dir))
  .filter((file) => /\.(ts|tsx|js|jsx)$/.test(file))
  .filter((file) => !allowedFiles.has(file));

const hexPattern = /#[0-9a-fA-F]{3,8}\b/g;
const hardcodedColorIssues = sourceFiles.flatMap((file) => {
  const matches = read(file).match(hexPattern) ?? [];
  return matches.map((match) => fail('QA_STYLE_HEX', `Hardcoded color ${match} should move to tokens`, file));
});

complete('qa:style', [
  ...requireFiles([
    'DESIGN.md',
    'src/theme/colors.ts',
    'design-system/01-tokens/token-architecture.md',
    'design-system/01-tokens/color-tokens.md',
  ], 'QA_STYLE_FILE'),
  hardcodedColorIssues.length === 0 ? pass('QA_STYLE_HEX', 'No hardcoded hex colors found outside token source files') : fail('QA_STYLE_HEX', 'Hardcoded colors found outside token source files'),
  ...hardcodedColorIssues,
]);

