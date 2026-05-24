const ts = require('typescript');
const { complete, fail, pass, read, walk } = require('./qa-utils.cjs');

const routeDefaultExportNames = new Set([
  'Root',
  'RootLayout',
  'TabLayout',
  'IndexRoute',
  'NotFoundScreen',
  'LaunchScreen',
  'BrandSplashScreen',
  'LoginScreen',
  'RegisterEmailScreen',
  'RegisterPhoneScreen',
  'RegisterEmailCodeScreen',
  'RegisterPhoneCodeScreen',
  'RegisterPasswordScreen',
  'ForgotPasswordScreen',
  'OnboardingScreen',
  'PinSetupScreen',
  'VerifyDeprecatedScreen',
]);

const expoSpecialFiles = new Set(['app/+html.tsx']);

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

function isUppercaseName(name) {
  return /^[A-Z][A-Za-z0-9_]*$/.test(name);
}

function hasExportDefault(node) {
  const modifiers = ts.canHaveModifiers(node) ? ts.getModifiers(node) : undefined;
  return Boolean(
    modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)
      && modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.DefaultKeyword),
  );
}

function isAllowedRouteDefault(file, node, name) {
  if (expoSpecialFiles.has(file)) {
    return true;
  }

  return hasExportDefault(node) && routeDefaultExportNames.has(name);
}

function inspectFile(file) {
  const sourceText = read(file);
  const sourceFile = ts.createSourceFile(file, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const checks = [];

  function addIssue(name, node) {
    const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
    checks.push(
      fail(
        'QA_COMPONENT_BOUNDARY',
        `Move local UI component ${name} out of app/ into src/screens or src/components.`,
        `${file}:${line + 1}:${character + 1}`,
      ),
    );
  }

  sourceFile.forEachChild((node) => {
    if (ts.isFunctionDeclaration(node) && node.name && isUppercaseName(node.name.text) && containsJsx(node)) {
      if (!isAllowedRouteDefault(file, node, node.name.text)) {
        addIssue(node.name.text, node.name);
      }
    }

    if (ts.isVariableStatement(node)) {
      for (const declaration of node.declarationList.declarations) {
        if (
          ts.isIdentifier(declaration.name)
          && isUppercaseName(declaration.name.text)
          && declaration.initializer
          && containsJsx(declaration.initializer)
        ) {
          addIssue(declaration.name.text, declaration.name);
        }
      }
    }
  });

  return checks;
}

const files = walk('app').filter((file) => file.endsWith('.tsx'));
const issues = files.flatMap(inspectFile);
complete('check-component-boundary', [
  pass('QA_COMPONENT_BOUNDARY_SCAN', `Scanned ${files.length} app route files`, 'app'),
  ...issues,
]);
