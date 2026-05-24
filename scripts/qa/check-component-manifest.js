const fs = require('fs');
const path = require('path');
const ts = require('typescript');
const { complete, fail, pass, read, root, walk } = require('./qa-utils.cjs');

const manifestPath = 'design-system-engineering/02_components/component-manifest.json';
const manifest = JSON.parse(read(manifestPath));
const componentEntries = manifest.components || {};
const requiredFields = [
  'category',
  'path',
  'exports',
  'props',
  'variants',
  'states',
  'a11y',
  'platforms',
  'tokenBindings',
  'usage',
  'forbidden',
];

function containsJsx(node) {
  let found = false;
  function visit(child) {
    if (ts.isJsxElement(child) || ts.isJsxSelfClosingElement(child) || ts.isJsxFragment(child)) {
      found = true;
      return;
    }
    if (!found) {
      ts.forEachChild(child, visit);
    }
  }
  visit(node);
  return found;
}

function isExported(node) {
  const modifiers = ts.canHaveModifiers(node) ? ts.getModifiers(node) : undefined;
  return Boolean(modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword));
}

function exportedComponentNames(file) {
  const sourceText = fs.readFileSync(path.join(root, file), 'utf8');
  const sourceFile = ts.createSourceFile(file, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const names = [];

  sourceFile.forEachChild((node) => {
    if (ts.isFunctionDeclaration(node) && node.name && /^[A-Z]/.test(node.name.text) && isExported(node) && containsJsx(node)) {
      names.push(node.name.text);
    }

    if (ts.isVariableStatement(node) && isExported(node)) {
      for (const declaration of node.declarationList.declarations) {
        if (
          ts.isIdentifier(declaration.name)
          && /^[A-Z]/.test(declaration.name.text)
          && declaration.initializer
          && containsJsx(declaration.initializer)
        ) {
          names.push(declaration.name.text);
        }
      }
    }
  });

  return names;
}

const componentFiles = walk('src/components').filter((file) => file.endsWith('.tsx'));
const exportedComponents = componentFiles.flatMap((file) => exportedComponentNames(file).map((name) => ({ file, name })));
const checks = [
  pass('QA_COMPONENT_MANIFEST_SCAN', `Scanned ${exportedComponents.length} exported TSX components`, 'src/components'),
];

for (const { file, name } of exportedComponents) {
  const entry = componentEntries[name]
    || Object.values(componentEntries).find((candidate) => Array.isArray(candidate.exports) && candidate.exports.includes(name));

  if (!entry) {
    checks.push(fail('QA_COMPONENT_MANIFEST_MISSING', `${name} is exported from ${file} but is not registered in component-manifest.json`, file));
    continue;
  }

  for (const field of requiredFields) {
    const value = entry[field];
    const missing = Array.isArray(value) ? value.length === 0 : value === undefined || value === null || value === '';
    if (missing) {
      checks.push(fail('QA_COMPONENT_MANIFEST_FIELD', `${name} manifest entry is missing ${field}`, manifestPath));
    }
  }

  if (entry.path && !fs.existsSync(path.join(root, entry.path))) {
    checks.push(fail('QA_COMPONENT_MANIFEST_PATH', `${name} manifest path does not exist: ${entry.path}`, manifestPath));
  }
}

for (const [name, entry] of Object.entries(componentEntries)) {
  if (!entry.path || !fs.existsSync(path.join(root, entry.path))) {
    checks.push(fail('QA_COMPONENT_MANIFEST_PATH', `${name} manifest path does not exist: ${entry.path}`, manifestPath));
  }
}

complete('check-component-manifest', checks);
