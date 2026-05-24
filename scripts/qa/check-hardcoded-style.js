const { complete, fail, pass, read, requireFiles, walk } = require('./qa-utils.cjs');

const allowedFiles = new Set([
  'src/theme/colors.ts',
  'src/theme/tokens.ts',
  'src/icons/phosphor.ts',
  'src/components/InstrumentIcon.tsx',
]);

const typographyAllowedFiles = new Set([
  'src/theme/tokens.ts',
  'src/components/AuthFlowControls.tsx',
  'src/components/Typography.tsx',
  'src/components/ProductControlPanel.tsx',
  'src/components/TextField.tsx',
]);

const textInputAllowedFiles = new Set([
  'src/components/TextField.tsx',
  'src/components/AuthFlowControls.tsx',
  'src/components/AuthShell.tsx',
]);

const textColorAllowedFiles = new Set([
  'src/components/AuthShell.tsx',
  'src/components/CurrencyFlag.tsx',
  'src/components/navigation/TabBarIcon.tsx',
  'src/components/StatusPill.tsx',
]);

const spacingAllowedFiles = new Set([
  'src/components/ActionButton.tsx',
  'src/components/AppTopBar.tsx',
  'src/components/AuthFlowControls.tsx',
  'src/components/AuthShell.tsx',
  'src/components/BackBar.tsx',
  'src/components/BottomSheet.tsx',
  'src/components/FundActionGrid.tsx',
  'src/components/Header.tsx',
  'src/components/InstrumentRow.tsx',
  'src/components/KeyValueList.tsx',
  'src/components/Metric.tsx',
  'src/components/ProductControlPanel.tsx',
  'src/components/QuickActionSheet.tsx',
  'src/components/Screen.tsx',
  'src/components/StatusPill.tsx',
  'src/components/TextField.tsx',
  'src/components/TradingAccountSwitchSheet.tsx',
  'src/components/UpgradeChatCard.tsx',
  'src/feedback/Toast.tsx',
  'src/components/navigation/TabBarIcon.tsx',
]);

const sizeAllowedFiles = new Set([
  'src/components/ActionButton.tsx',
  'src/components/AppTopBar.tsx',
  'src/components/AppViewport.tsx',
  'src/components/AuthFlowControls.tsx',
  'src/components/AuthShell.tsx',
  'src/components/BottomSheet.tsx',
  'src/components/FundActionGrid.tsx',
  'src/components/GlobalMenuList.tsx',
  'src/components/InstrumentIcon.tsx',
  'src/components/InstrumentRow.tsx',
  'src/components/KeyValueList.tsx',
  'src/components/Metric.tsx',
  'src/components/ProductControlPanel.tsx',
  'src/components/QuickActionSheet.tsx',
  'src/components/StatusPill.tsx',
  'src/components/TextField.tsx',
  'src/components/TradingAccountSwitchSheet.tsx',
  'src/components/UpgradeChatCard.tsx',
  'src/feedback/Toast.tsx',
  'src/components/navigation/TabBarIcon.tsx',
]);

const lineWidthAllowedFiles = new Set([
  'app/appearance.tsx',
  'src/components/InstrumentIcon.tsx',
  'src/components/TradingAccountSwitchSheet.tsx',
]);

const legacyPageSpacingBaseline = new Set([
  'app/(tabs)/_layout.tsx',
  'app/(tabs)/account.tsx',
  'app/(tabs)/discover.tsx',
  'app/(tabs)/markets.tsx',
  'app/(tabs)/partner-tools.tsx',
  'app/(tabs)/portfolio.tsx',
  'app/(tabs)/quick.tsx',
  'app/+not-found.tsx',
  'app/account-details/[id].tsx',
  'app/appearance.tsx',
  'app/auth/account-review.tsx',
  'app/auth/forgot-password.tsx',
  'app/auth/index.tsx',
  'app/auth/onboarding.tsx',
  'app/auth/register.tsx',
  'app/auth/verify.tsx',
  'app/client/[id].tsx',
  'app/instrument/[id].tsx',
  'app/order/[id].tsx',
  'src/screens/accounts/AccountDetailsScreen.tsx',
  'src/screens/accounts/AccountScreen.tsx',
  'src/screens/client/ClientProfileScreen.tsx',
  'src/screens/discover/DupoinDiscoverScreen.tsx',
  'src/screens/discover/PartnerToolsScreen.tsx',
  'src/screens/navigation/TabLayout.tsx',
  'src/screens/settings/AppearanceScreen.tsx',
  'src/screens/trading/OrderTicketScreen.tsx',
  'src/screens/accounts/AccountBalanceScreen.tsx',
  'src/screens/accounts/AccountBasicScreen.tsx',
  'src/screens/discover/DiscoverLayoutScreen.tsx',
  'src/screens/discover/DiscoverModuleScreen.tsx',
  'src/screens/markets/InstrumentDetailScreen.tsx',
  'src/screens/markets/MarketsScreen.tsx',
  'src/screens/portfolio/PortfolioScreen.tsx',
]);

const legacyPageSizeBaseline = new Set([
  'app/(tabs)/_layout.tsx',
  'app/(tabs)/account.tsx',
  'app/(tabs)/discover.tsx',
  'app/(tabs)/markets.tsx',
  'app/(tabs)/partner-tools.tsx',
  'app/(tabs)/portfolio.tsx',
  'app/(tabs)/quick.tsx',
  'app/account-balance/[id].tsx',
  'app/account-basic/[id].tsx',
  'app/account-details/[id].tsx',
  'app/appearance.tsx',
  'app/auth/account-review.tsx',
  'app/auth/forgot-password.tsx',
  'app/auth/index.tsx',
  'app/auth/onboarding.tsx',
  'app/auth/register.tsx',
  'app/auth/verify.tsx',
  'app/client/[id].tsx',
  'app/discover-layout.tsx',
  'app/instrument/[id].tsx',
  'app/launch.tsx',
  'app/order/[id].tsx',
  'src/screens/accounts/AccountBalanceScreen.tsx',
  'src/screens/accounts/AccountBasicScreen.tsx',
  'src/screens/accounts/AccountDetailsScreen.tsx',
  'src/screens/accounts/AccountScreen.tsx',
  'src/screens/client/ClientProfileScreen.tsx',
  'src/screens/discover/DiscoverLayoutScreen.tsx',
  'src/screens/discover/DiscoverModuleScreen.tsx',
  'src/screens/discover/DupoinDiscoverScreen.tsx',
  'src/screens/discover/PartnerToolsScreen.tsx',
  'src/screens/markets/InstrumentDetailScreen.tsx',
  'src/screens/markets/MarketsScreen.tsx',
  'src/screens/navigation/TabLayout.tsx',
  'src/screens/portfolio/PortfolioScreen.tsx',
  'src/screens/settings/AppearanceScreen.tsx',
  'src/screens/trading/OrderTicketScreen.tsx',
]);

const sourceFiles = ['app', 'src']
  .flatMap((dir) => walk(dir))
  .filter((file) => /\.(ts|tsx|js|jsx)$/.test(file))
  .filter((file) => !allowedFiles.has(file));

const colorPattern = /#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(/g;
const hardcodedColorIssues = sourceFiles.flatMap((file) => {
  const matches = read(file).match(colorPattern) ?? [];
  return matches.map((match) => fail('QA_STYLE_COLOR', `Hardcoded color ${match} should move to tokens`, file));
});

const typographyPattern = /\b(fontSize|fontWeight|lineHeight|letterSpacing)\s*:/g;
const hardcodedTypographyIssues = sourceFiles
  .filter((file) => !typographyAllowedFiles.has(file))
  .flatMap((file) => {
    const matches = read(file).match(typographyPattern) ?? [];
    return matches.map((match) => fail('QA_STYLE_TYPOGRAPHY', `Typography style ${match.trim()} should use typography tokens or AppText variants`, file));
  });

const directTextInputIssues = sourceFiles
  .filter((file) => !textInputAllowedFiles.has(file))
  .flatMap((file) => {
    const text = read(file);
    return /\bTextInput\b/.test(text) ? [fail('QA_STYLE_TEXT_INPUT', 'Direct TextInput usage should go through TextField', file)] : [];
  });

const appTextStyleColorPattern = /<AppText\b[^>]*style=\{[^}\n]*color\s*:/g;
const appTextStyleColorIssues = sourceFiles
  .filter((file) => !textColorAllowedFiles.has(file))
  .flatMap((file) => {
    const matches = read(file).match(appTextStyleColorPattern) ?? [];
    return matches.map(() => fail('QA_STYLE_TEXT_COLOR', 'Ordinary AppText color should use semantic `tone`, not direct style.color', file));
  });

const hardcodedSpacingPattern = /\b(padding|paddingHorizontal|paddingVertical|paddingTop|paddingBottom|paddingLeft|paddingRight|margin|marginTop|marginBottom|marginLeft|marginRight|gap|rowGap|columnGap)\s*:\s*-?\d+(?:\.\d+)?\b/g;
const hardcodedSpacingIssues = sourceFiles
  .filter((file) => !spacingAllowedFiles.has(file) && !legacyPageSpacingBaseline.has(file))
  .flatMap((file) => {
    const matches = read(file).match(hardcodedSpacingPattern) ?? [];
    return matches.map((match) => fail('QA_STYLE_SPACING', `Hardcoded spacing ${match.trim()} should use spacing or layout tokens`, file));
  });

const hardcodedSizePattern = /\b(height|width|minHeight|minWidth|maxHeight|maxWidth)\s*:\s*-?\d+(?:\.\d+)?\b/g;
const layoutUtilitySizePattern = /\b(minWidth|height|width)\s*:\s*0\b/g;
const hardcodedSizeIssues = sourceFiles
  .filter((file) => !sizeAllowedFiles.has(file) && !legacyPageSizeBaseline.has(file))
  .flatMap((file) => {
    const text = read(file).replace(layoutUtilitySizePattern, '');
    const matches = text.match(hardcodedSizePattern) ?? [];
    return matches.map((match) => fail('QA_STYLE_SIZE', `Hardcoded size ${match.trim()} should use size, layout, or component tokens`, file));
  });

const hardcodedLineWidthPattern = /\b(borderWidth|borderTopWidth|borderBottomWidth|borderLeftWidth|borderRightWidth)\s*:\s*(?!0\b)\d+(?:\.\d+)?\b|\b(height|width)\s*:\s*1\b/g;
const hardcodedLineWidthIssues = sourceFiles
  .filter((file) => !lineWidthAllowedFiles.has(file))
  .flatMap((file) => {
    const matches = read(file).match(hardcodedLineWidthPattern) ?? [];
    return matches.map((match) => fail('QA_STYLE_LINE_WIDTH', `Hardcoded line width ${match.trim()} should use lineWidth tokens`, file));
  });

const ts = require('typescript');

const bottomSheetIssues = sourceFiles.flatMap((file) => {
  const text = read(file);
  if (!text.includes('bottomSheet.show')) {
    return [];
  }

  const sourceFile = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, file.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const issues = [];
  const visit = (node) => {
    if (
      ts.isCallExpression(node)
      && ts.isPropertyAccessExpression(node.expression)
      && node.expression.name.text === 'show'
      && ts.isIdentifier(node.expression.expression)
      && node.expression.expression.text === 'bottomSheet'
    ) {
      const firstArg = node.arguments[0];

      const isPresetCall = firstArg
        && ts.isCallExpression(firstArg)
        && ts.isPropertyAccessExpression(firstArg.expression)
        && ts.isIdentifier(firstArg.expression.expression)
        && firstArg.expression.expression.text === 'bottomSheetPresets';

      if (isPresetCall) {
        return;
      }

      if (!firstArg || !ts.isObjectLiteralExpression(firstArg)) {
        issues.push(fail('QA_STYLE_BOTTOM_SHEET', 'Global bottomSheet.show must use structured options with an explicit header mode', file));
        return;
      }

      const hasHeader = firstArg.properties.some((property) => ts.isPropertyAssignment(property) && property.name && ts.isIdentifier(property.name) && property.name.text === 'header');
      const hasLegacyHeader = firstArg.properties.some(
        (property) => ts.isPropertyAssignment(property) && property.name && ts.isIdentifier(property.name) && ['title', 'subtitle'].includes(property.name.text),
      );

      if (!hasHeader) {
        issues.push(fail('QA_STYLE_BOTTOM_SHEET', 'Global bottomSheet.show options must declare `header` or `header: false`', file));
      }

      if (hasLegacyHeader) {
        issues.push(fail('QA_STYLE_BOTTOM_SHEET', 'Global bottomSheet.show must not rely on legacy title/subtitle compatibility props', file));
      }

      const headerProperty = firstArg.properties.find((property) => ts.isPropertyAssignment(property) && property.name && ts.isIdentifier(property.name) && property.name.text === 'header');
      if (headerProperty && ts.isPropertyAssignment(headerProperty) && ts.isObjectLiteralExpression(headerProperty.initializer)) {
        const deprecatedHeaderProps = headerProperty.initializer.properties.filter(
          (property) =>
            ts.isPropertyAssignment(property)
            && property.name
            && ts.isIdentifier(property.name)
            && ['onRightPress', 'rightAccessibilityLabel', 'rightIcon', 'subtitle'].includes(property.name.text),
        );

        deprecatedHeaderProps.forEach((property) => {
          issues.push(fail('QA_STYLE_BOTTOM_SHEET', `Global bottom sheet header must use fixed-height title bar with rightAction/leftAction, not ${property.name.getText(sourceFile)}`, file));
        });
      }
    }

    ts.forEachChild(node, visit);
  };

  visit(sourceFile);
  return issues;
});

const bottomSheetRuntimeText = read('src/components/BottomSheet.tsx');
const screenRuntimeText = read('src/components/Screen.tsx');
const runtimeTokenText = read('src/theme/tokens.ts');
const fundActionGridText = read('src/components/FundActionGrid.tsx');
const quickActionSheetText = read('src/components/QuickActionSheet.tsx');
const headerIconButtonText = read('src/components/HeaderIconButton.tsx');
const bottomSheetFooterIssues = [];
if (!/screenPaddingX: spacing\.lg/.test(runtimeTokenText)) {
  bottomSheetFooterIssues.push(fail('QA_STYLE_LAYOUT_SPACING', 'Page and global sheet module horizontal padding must be 16px through layout.screenPaddingX', 'src/theme/tokens.ts'));
}
if (!/paddingHorizontal: layout\.screenPaddingX/.test(screenRuntimeText)) {
  bottomSheetFooterIssues.push(fail('QA_STYLE_LAYOUT_SPACING', 'Screen page content must use layout.screenPaddingX for 16px module alignment', 'src/components/Screen.tsx'));
}
if (!/footerComponent=\{options\.footer \? footerComponent : undefined\}/.test(bottomSheetRuntimeText) || !/GorhomBottomSheetFooter animatedFooterPosition=\{animatedFooterPosition\}/.test(bottomSheetRuntimeText)) {
  bottomSheetFooterIssues.push(fail('QA_STYLE_BOTTOM_SHEET_FOOTER', 'Global BottomSheet footer actions must render through the component-owned fixed footer zone', 'src/components/BottomSheet.tsx'));
}
if (!/content:\s*\{[\s\S]*?padding: layout\.screenPaddingX/.test(bottomSheetRuntimeText)
  || !/footer:\s*\{[\s\S]*?paddingHorizontal: layout\.screenPaddingX/.test(bottomSheetRuntimeText)
  || !/header:\s*\{[\s\S]*?paddingHorizontal: layout\.screenPaddingX/.test(bottomSheetRuntimeText)) {
  bottomSheetFooterIssues.push(fail('QA_STYLE_LAYOUT_SPACING', 'Global BottomSheet header, content, and footer must use layout.screenPaddingX for 16px module alignment', 'src/components/BottomSheet.tsx'));
}
if (!/<BottomSheetContent hasFooter=\{Boolean\(options\.footer\)\}>/.test(bottomSheetRuntimeText) || !/enableFooterMarginAdjustment=\{hasFooter\}/.test(bottomSheetRuntimeText)) {
  bottomSheetFooterIssues.push(fail('QA_STYLE_BOTTOM_SHEET_FOOTER', 'Global BottomSheet scroll content must reserve space for the fixed footer actions', 'src/components/BottomSheet.tsx'));
}
if (!/icon\?: AppIconName/.test(bottomSheetRuntimeText) || !/icon=\{action\.icon\}/.test(bottomSheetRuntimeText)) {
  bottomSheetFooterIssues.push(fail('QA_STYLE_BOTTOM_SHEET_FOOTER', 'Global BottomSheet footer actions must support registered action icons', 'src/components/BottomSheet.tsx'));
}
if (!/sheetHeaderHeight/.test(bottomSheetRuntimeText) || !/height: SHEET_HEADER_HEIGHT/.test(bottomSheetRuntimeText)) {
  bottomSheetFooterIssues.push(fail('QA_STYLE_BOTTOM_SHEET_HEADER', 'Global BottomSheet header must use the fixed sheetHeaderHeight token', 'src/components/BottomSheet.tsx'));
}
if (!/sheetTitle:\s*\{\s*fontSize: 20,/.test(runtimeTokenText) || !/variant="sheetTitle"/.test(bottomSheetRuntimeText)) {
  bottomSheetFooterIssues.push(fail('QA_STYLE_BOTTOM_SHEET_HEADER', 'Global BottomSheet title must use the 20px sheetTitle typography token', 'src/components/BottomSheet.tsx'));
}
if (!/function BottomSheetHeaderSpacer\(\)/.test(bottomSheetRuntimeText) || !/hasHeader \? <BottomSheetHeaderSpacer \/> : null/.test(bottomSheetRuntimeText)) {
  bottomSheetFooterIssues.push(fail('QA_STYLE_BOTTOM_SHEET_HEADER', 'Global BottomSheet content must insert the component-owned header spacer only when a header is present', 'src/components/BottomSheet.tsx'));
}
if (!/headerSpacer:\s*\{\s*height: SHEET_HEADER_HEIGHT,\s*\}/m.test(bottomSheetRuntimeText)) {
  bottomSheetFooterIssues.push(fail('QA_STYLE_BOTTOM_SHEET_HEADER', 'Global BottomSheet header spacer must use the same sheetHeaderHeight token as the visual header', 'src/components/BottomSheet.tsx'));
}
if (!/position: 'absolute'/.test(bottomSheetRuntimeText) || !/zIndex: 2/.test(bottomSheetRuntimeText)) {
  bottomSheetFooterIssues.push(fail('QA_STYLE_BOTTOM_SHEET_HEADER', 'Global BottomSheet visual header must be a fixed component-owned layer above scroll content', 'src/components/BottomSheet.tsx'));
}
if (!/contentWithHeader:\s*\{\s*paddingTop: 0,\s*\}/m.test(bottomSheetRuntimeText)) {
  bottomSheetFooterIssues.push(fail('QA_STYLE_BOTTOM_SHEET_HEADER', 'Global BottomSheet must not simulate header height with content padding', 'src/components/BottomSheet.tsx'));
}
if (/header:\s*\{[\s\S]*?borderBottomWidth:/m.test(bottomSheetRuntimeText)) {
  bottomSheetFooterIssues.push(fail('QA_STYLE_BOTTOM_SHEET_HEADER', 'Global BottomSheet header title bar must not render a divider line', 'src/components/BottomSheet.tsx'));
}
if (!/HeaderIconButton[\s\S]*?tone="default"[\s\S]*?HeaderIconButton/m.test(bottomSheetRuntimeText) || !/AppIcon tone="text" name=\{header\.leftIcon\}/.test(bottomSheetRuntimeText)) {
  bottomSheetFooterIssues.push(fail('QA_STYLE_BOTTOM_SHEET_HEADER', 'Global BottomSheet header reserved/action icons must use text-color contrast, not muted icon color', 'src/components/BottomSheet.tsx'));
}
if (/rightIcon\s*=\s*header\.rightIcon\s*\?\?\s*['"](closeX|icon\.system\.close)['"]/.test(bottomSheetRuntimeText) || /onRightPress\s*\?\?\s*hide/.test(bottomSheetRuntimeText)) {
  bottomSheetFooterIssues.push(fail('QA_STYLE_BOTTOM_SHEET_HEADER', 'Global BottomSheet header right slot must not default to close', 'src/components/BottomSheet.tsx'));
}
if (!/push: \(options: BottomSheetOptions\) => void/.test(bottomSheetRuntimeText) || !/back: \(\) => void/.test(bottomSheetRuntimeText)) {
  bottomSheetFooterIssues.push(fail('QA_STYLE_BOTTOM_SHEET_HEADER', 'Global BottomSheet context must expose push/back for nested sheet navigation', 'src/components/BottomSheet.tsx'));
}
if (!/BottomSheetStackDepthContext/.test(bottomSheetRuntimeText) || !/isNested=\{stackDepth > 1\}/.test(bottomSheetRuntimeText) || !/icon: 'icon.system.back'/.test(bottomSheetRuntimeText)) {
  bottomSheetFooterIssues.push(fail('QA_STYLE_BOTTOM_SHEET_HEADER', 'Nested global BottomSheet layers must automatically use the left back action', 'src/components/BottomSheet.tsx'));
}
if (!/resolvedThemeMode === 'darkTerminal' \|\| resolvedThemeMode === 'midnightBlue' \? palette\.bg : palette\.text/.test(bottomSheetRuntimeText)) {
  bottomSheetFooterIssues.push(fail('QA_STYLE_BOTTOM_SHEET_BACKDROP', 'Global BottomSheet backdrop must use a visible token-derived overlay for both light and dark themes', 'src/components/BottomSheet.tsx'));
}
if (/\$\{color\}12/.test(fundActionGridText) || /\$\{color\}55/.test(fundActionGridText) || /icon:\s*\{[^}]*borderWidth:/m.test(fundActionGridText)) {
  bottomSheetFooterIssues.push(fail('QA_STYLE_ICON_CONTAINER', 'Fund action icons must render as quiet finance icons without tinted circular backgrounds or outline frames', 'src/components/FundActionGrid.tsx'));
}
if (
  !/fundActionIconSize:\s*size\.icon\.fundAction/.test(runtimeTokenText)
  || !/fundActionIconBoxSize:\s*size\.icon\.fundActionBox/.test(runtimeTokenText)
  || !/size=\{layout\.fundActionIconSize\}/.test(fundActionGridText)
) {
  bottomSheetFooterIssues.push(fail('QA_STYLE_ICON_SIZE', 'Fund action icons must use the 24px icon.fund-action size inside a 40px reserved box', 'src/components/FundActionGrid.tsx'));
}
if (!/deposit: palette\.down/.test(fundActionGridText) || !/withdraw: palette\.amber/.test(fundActionGridText) || !/transfer: palette\.blue/.test(fundActionGridText)) {
  bottomSheetFooterIssues.push(fail('QA_STYLE_ICON_COLOR', 'Fund action tones must map deposit to green, withdraw to yellow, and transfer to blue', 'src/components/FundActionGrid.tsx'));
}
if (/tone: ['"](down|amber|blue)['"]/.test(fundActionGridText)) {
  bottomSheetFooterIssues.push(fail('QA_STYLE_ICON_COLOR', 'Fund action defaults must use business tones: deposit, withdraw, and transfer', 'src/components/FundActionGrid.tsx'));
}
if (/\$\{action\.tone\}12/.test(quickActionSheetText) || /\$\{action\.tone\}55/.test(quickActionSheetText) || /actionIcon:\s*\{[^}]*borderWidth:/m.test(quickActionSheetText)) {
  bottomSheetFooterIssues.push(fail('QA_STYLE_ICON_CONTAINER', 'Quick action sheet icons must render without AI-like tinted circular backgrounds or outline frames', 'src/components/QuickActionSheet.tsx'));
}
if (/button:\s*\{[^}]*borderWidth:/m.test(headerIconButtonText)) {
  bottomSheetFooterIssues.push(fail('QA_STYLE_ICON_CONTAINER', 'Header icon buttons must keep touch area without rendering an outlined circular frame', 'src/components/HeaderIconButton.tsx'));
}
if (/decorativeHeaderIcon:\s*\{[^}]*borderWidth:/m.test(bottomSheetRuntimeText) || /decorativeHeaderIcon:\s*\{[^}]*backgroundColor:/m.test(bottomSheetRuntimeText)) {
  bottomSheetFooterIssues.push(fail('QA_STYLE_ICON_CONTAINER', 'BottomSheet reserved header icons must be plain semantic icons without a decorative background frame', 'src/components/BottomSheet.tsx'));
}

complete('qa:style', [
  ...requireFiles([
    'DESIGN.md',
    'src/theme/colors.ts',
    'src/theme/tokens.ts',
    'design-system/01-tokens/token-architecture.md',
    'design-system/01-tokens/color-tokens.md',
    'design-system/01-tokens/typography-tokens.md',
    'design-system/01-tokens/spacing-tokens.md',
    'design-system/01-tokens/line-width-tokens.md',
  ], 'QA_STYLE_FILE'),
  hardcodedColorIssues.length === 0 ? pass('QA_STYLE_COLOR', 'No hardcoded colors found outside token source files') : fail('QA_STYLE_COLOR', 'Hardcoded colors found outside token source files'),
  ...hardcodedColorIssues,
  hardcodedTypographyIssues.length === 0
    ? pass('QA_STYLE_TYPOGRAPHY', 'No hardcoded typography styles found outside typography surfaces')
    : fail('QA_STYLE_TYPOGRAPHY', 'Hardcoded typography styles found outside typography surfaces'),
  ...hardcodedTypographyIssues,
  directTextInputIssues.length === 0
    ? pass('QA_STYLE_TEXT_INPUT', 'No direct TextInput usage outside shared wrappers')
    : fail('QA_STYLE_TEXT_INPUT', 'Direct TextInput usage found outside shared wrappers'),
  ...directTextInputIssues,
  appTextStyleColorIssues.length === 0
    ? pass('QA_STYLE_TEXT_COLOR', 'No page-level AppText style.color usage found outside registered foreground exceptions')
    : fail('QA_STYLE_TEXT_COLOR', 'AppText style.color usage found outside registered foreground exceptions'),
  ...appTextStyleColorIssues,
  hardcodedSpacingIssues.length === 0
    ? pass('QA_STYLE_SPACING', 'No hardcoded spacing found outside registered spacing exceptions and legacy baseline')
    : fail('QA_STYLE_SPACING', 'Hardcoded spacing found outside registered spacing exceptions and legacy baseline'),
  ...hardcodedSpacingIssues,
  hardcodedSizeIssues.length === 0
    ? pass('QA_STYLE_SIZE', 'No hardcoded size dimensions found outside registered size exceptions and legacy baseline')
    : fail('QA_STYLE_SIZE', 'Hardcoded size dimensions found outside registered size exceptions and legacy baseline'),
  ...hardcodedSizeIssues,
  hardcodedLineWidthIssues.length === 0
    ? pass('QA_STYLE_LINE_WIDTH', 'No hardcoded ordinary line widths found outside registered line-width exceptions')
    : fail('QA_STYLE_LINE_WIDTH', 'Hardcoded ordinary line widths found outside registered line-width exceptions'),
  ...hardcodedLineWidthIssues,
  bottomSheetIssues.length === 0
    ? pass('QA_STYLE_BOTTOM_SHEET', 'Global bottom sheet calls declare explicit header modes')
    : fail('QA_STYLE_BOTTOM_SHEET', 'Global bottom sheet header mode issues found'),
  ...bottomSheetIssues,
  bottomSheetFooterIssues.length === 0
    ? pass('QA_STYLE_BOTTOM_SHEET_FOOTER', 'Global bottom sheet actions render in the fixed bottom footer')
    : fail('QA_STYLE_BOTTOM_SHEET_FOOTER', 'Global bottom sheet footer placement issues found'),
  ...bottomSheetFooterIssues,
]);
