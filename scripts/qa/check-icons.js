const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.resolve(__dirname, '../..');
const registryPath = path.join(root, 'design-system-engineering/04_icons/icon-registry.json');
const appIconPath = path.join(root, 'src/components/AppIcon.tsx');
const localIconRoot = path.join(root, 'src/icons/local');
const localIconMapPath = path.join(root, 'src/icons/local/iconComponentMap.ts');
const iconRegistryPath = path.join(root, 'src/icons/iconRegistry.ts');
const iconQaRulesPath = path.join(root, 'design-system-engineering/04_icons/icon-qa.rules.json');
const iconsaxSourceManifestPath = path.join(root, 'design-system-engineering/04_icons/iconsax-source-manifest.json');
const packageJsonPath = path.join(root, 'package.json');
const themeColorsPath = path.join(root, 'src/theme/colors.ts');
const tokenModeMatrixPath = path.join(root, 'design-system-engineering/01_tokens/token-mode.matrix.json');

const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
const iconQaRules = JSON.parse(fs.readFileSync(iconQaRulesPath, 'utf8'));
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const tokenModeMatrix = JSON.parse(fs.readFileSync(tokenModeMatrixPath, 'utf8'));
const appIconSource = fs.existsSync(appIconPath) ? fs.readFileSync(appIconPath, 'utf8') : '';
const localIconMapSource = fs.existsSync(localIconMapPath) ? fs.readFileSync(localIconMapPath, 'utf8') : '';
const iconRegistrySource = fs.existsSync(iconRegistryPath) ? fs.readFileSync(iconRegistryPath, 'utf8') : '';
const iconsaxGeneratedSource = readFileIfExists(path.join(root, 'src/icons/local/iconsax/iconsaxGeneratedIcons.tsx'));
const themeColorsSource = fs.existsSync(themeColorsPath) ? fs.readFileSync(themeColorsPath, 'utf8') : '';
const dependencies = {
  ...packageJson.dependencies,
  ...packageJson.devDependencies,
};

const issues = [];
const approvedSources = new Set(['phosphor', 'remix', 'lucide', 'iconsax', 'custom']);
const governedIconSizes = [8, 12, 16, 20, 24, 32, 40, 48, 64];
const governedIconSizeSet = new Set(governedIconSizes);
const governedIconBackgroundTokens = [
  'color.iconBg.neutral',
  'color.iconBg.subtle',
  'color.iconBg.active',
  'color.iconBg.info',
  'color.iconBg.success',
  'color.iconBg.warning',
  'color.iconBg.danger',
  'color.iconBg.marketUp',
  'color.iconBg.marketDown',
  'color.iconBg.inverse',
];
const defaultIconSize = 24;
const defaultIconGlyphSize = 21;
const defaultIconSafeAreaInset = 1.5;
const defaultIconStrokeWidth = 1.5;
const allowedShapeFits = new Set(['square', 'rectangle', 'circle', 'balanced']);
const allowedLiteralIconTones = new Set([
  'amber',
  'blue',
  'brand',
  'danger',
  'disabled',
  'down',
  'info',
  'inverse',
  'panel',
  'primary',
  'secondary',
  'success',
  'tertiary',
  'text',
  'textDim',
  'textMuted',
  'up',
  'warning',
  'white',
]);
const forbiddenColorLiteralPattern = /^(#(?:[0-9A-Fa-f]{3,8})|rgba?\(|hsla?\()/;
const forbiddenIconContainerBackgroundPatterns = [
  /backgroundColor:\s*`\$\{colors\.brand\.fg\}[0-9A-Fa-f]{2}`/,
  /backgroundColor:\s*`\$\{colors\.status\.[^.]+\.fg\}[0-9A-Fa-f]{2}`/,
  /backgroundColor:\s*`\$\{colors\.market\.[^.]+\.fg\}[0-9A-Fa-f]{2}`/,
  /backgroundColor:\s*colors\.overlay\.(brand|danger|down|info|success|up|warning)\.subtle/,
];
const allowedSemanticIconContainerFiles = new Set([
  'src/screens/discover/DiscoverLayoutScreen.tsx',
  'src/screens/discover/DupoinDiscoverScreen.tsx',
]);
const forbiddenPackagePatterns = [
  '@expo/vector-icons',
  '@hugeicons/core-free-icons',
  '@hugeicons/react-native',
  '@hugeicons-pro/core-duotone-rounded',
  'lucide-react-native',
  'phosphor-react-native',
  'react-native-remix-icon',
  'iconsax-react-native',
];
const allowedSvgRenderers = new Set([
  'app/account-details/[id].tsx',
  'app/instrument/[id].tsx',
  'src/components/FlagIcon.tsx',
  'src/components/data-display/DonutChart.tsx',
  'src/components/InstrumentIcon.tsx',
  'src/components/ReferralNetworkIllustration.tsx',
  'src/components/Sparkline.tsx',
  'src/screens/accounts/AccountDetailsScreen.tsx',
  'src/screens/markets/InstrumentDetailScreen.tsx',
]);
function addIssue(id, severity, message, file = registryPath) {
  issues.push({ file: path.relative(root, file), id, message, severity });
}

function readFileIfExists(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
}

function collectFiles(dir, out = []) {
  if (!fs.existsSync(dir)) {
    return out;
  }

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectFiles(fullPath, out);
    } else if (/\.(ts|tsx|js|jsx|json|md|yaml|yml)$/.test(entry.name)) {
      out.push(fullPath);
    }
  }

  return out;
}

function assertPackageClean() {
  for (const packageName of forbiddenPackagePatterns) {
    if (dependencies[packageName]) {
      addIssue('BLOCKED_ICON_PROVIDER_DEPENDENCY', 'blocker', `${packageName} is blocked by the current icon source policy.`, packageJsonPath);
    }
  }
}

function assertRegistryPolicy() {
  if (!registry.source_policy || registry.source_policy.primary_library !== 'phosphor') {
    addIssue('ICON_SOURCE_POLICY_INVALID', 'blocker', 'Registry primary source must be phosphor.');
  }

  const approved = new Set((registry.source_policy?.approved_libraries || []).map((item) => item.library));
  for (const source of approvedSources) {
    if (!approved.has(source)) {
      addIssue('ICON_SOURCE_POLICY_MISSING_LIBRARY', 'critical', `Registry must approve ${source}.`);
    }
  }

  for (const blocked of registry.source_policy?.blocked_libraries || []) {
    if (String(blocked.library).includes('hugeicons') && !blocked.reason) {
      addIssue('BLOCKED_LIBRARY_REASON_MISSING', 'critical', `${blocked.library} must include a block reason.`);
    }
  }

  if (registry.source_policy?.runtime_policy?.delivery !== 'local-vendored-assets') {
    addIssue('ICON_RUNTIME_POLICY_INVALID', 'blocker', 'Registry runtime policy must require local-vendored-assets.');
  }

  if (registry.source_policy?.runtime_policy?.asset_root !== 'src/icons/local') {
    addIssue('ICON_LOCAL_ASSET_ROOT_INVALID', 'blocker', 'Registry local asset root must be src/icons/local.');
  }

  if (!fs.existsSync(iconsaxSourceManifestPath)) {
    addIssue('ICONSAX_SOURCE_MANIFEST_MISSING', 'blocker', 'Iconsax source manifest must exist for licensed local-vendored library assets.', iconsaxSourceManifestPath);
  } else {
    const manifest = JSON.parse(fs.readFileSync(iconsaxSourceManifestPath, 'utf8'));
    const iconsaxCount = (registry.icons || []).filter((icon) => icon.icon_key?.startsWith('icon.iconsax.') && icon.source_library === 'iconsax').length;
    if (manifest.source_library !== 'iconsax' || manifest.counts?.generated_runtime_icons !== iconsaxCount) {
      addIssue('ICONSAX_SOURCE_MANIFEST_COUNT_MISMATCH', 'blocker', `Iconsax manifest generated count must equal registry count. Manifest=${manifest.counts?.generated_runtime_icons}, registry=${iconsaxCount}.`, iconsaxSourceManifestPath);
    }
    if (manifest.runtime_contract?.runtime_dependency !== 'none' || manifest.runtime_contract?.blocked_runtime_package !== 'iconsax-react-native') {
      addIssue('ICONSAX_RUNTIME_POLICY_INVALID', 'blocker', 'Iconsax runtime must use local vendored assets and block iconsax-react-native.', iconsaxSourceManifestPath);
    }
    if (!manifest.source_zip_sha256 || !manifest.license?.url) {
      addIssue('ICONSAX_SOURCE_METADATA_MISSING', 'critical', 'Iconsax manifest must include source zip checksum and license URL.', iconsaxSourceManifestPath);
    }
  }
}

function exportedNamesForPackage(sourceLibrary) {
  if (sourceLibrary === 'phosphor') {
    const indexPath = path.join(root, 'node_modules/phosphor-react-native/lib/typescript/index.d.ts');
    const source = readFileIfExists(indexPath);
    return new Set(Array.from(source.matchAll(/export \* from '\.\/icons\/([^']+)'/g)).map((match) => match[1]));
  }

  if (sourceLibrary === 'lucide') {
    const indexPath = path.join(root, 'node_modules/lucide-react-native/dist/lucide-react-native.d.ts');
    const source = readFileIfExists(indexPath);
    return new Set(Array.from(source.matchAll(/declare const ([A-Za-z0-9_]+)\b/g)).map((match) => match[1]));
  }

  if (sourceLibrary === 'remix') {
    const indexPath = path.join(root, 'node_modules/react-native-remix-icon/src/index.d.ts');
    const source = readFileIfExists(indexPath);
    return new Set(Array.from(source.matchAll(/\| "([^"]+)"/g)).map((match) => match[1]));
  }

  return new Set();
}

function assertRegistryEntries() {
  if (!Array.isArray(registry.icons)) {
    addIssue('ICON_REGISTRY_INVALID_SHAPE', 'blocker', 'icon-registry.json must use an icons array.');
    return;
  }

  const seen = new Set();
  const registryKeys = new Set();
  const exportedBySource = {
    lucide: exportedNamesForPackage('lucide'),
    phosphor: exportedNamesForPackage('phosphor'),
    remix: exportedNamesForPackage('remix'),
  };

  for (const icon of registry.icons) {
    const key = icon.icon_key;
    registryKeys.add(key);

    if (!/^icon\.[a-z0-9_]+(\.[a-z0-9_]+)+$/.test(key || '')) {
      addIssue('ICON_KEY_INVALID', 'critical', `${key || '(missing key)'} must follow icon.{category}.{meaning}.`);
    }

    if (seen.has(key)) {
      addIssue('ICON_KEY_DUPLICATE', 'critical', `${key} is duplicated.`);
    }
    seen.add(key);

    if (!approvedSources.has(icon.source_library)) {
      addIssue('ICON_SOURCE_LIBRARY_BLOCKED', 'blocker', `${key} uses unapproved source ${icon.source_library}.`);
    }

    if (String(icon.source_library).includes('hugeicons') || String(icon.source_icon_name).includes('Huge')) {
      addIssue('HUGEICONS_REGISTRY_REFERENCE', 'blocker', `${key} still references Hugeicons.`);
    }

    for (const field of ['category', 'meaning', 'source_icon_name', 'style', 'sizes', 'states', 'token_binding', 'usage', 'license', 'status']) {
      if (!(field in icon)) {
        addIssue('ICON_METADATA_MISSING', 'critical', `${key} is missing required field ${field}.`);
      }
    }

    if (icon.status !== 'approved') {
      addIssue('ICON_NOT_APPROVED', icon.status === 'blocked' ? 'blocker' : 'critical', `${key} is ${icon.status}; production registry entries must be approved.`);
    }

    if (!Array.isArray(icon.usage) || icon.usage.length === 0) {
      addIssue('ICON_USAGE_MISSING', 'critical', `${key} must declare usage.`);
    }

    if (!icon.license?.name || !icon.license?.url || typeof icon.license.attribution_required !== 'boolean') {
      addIssue('ICON_LICENSE_MISSING', 'critical', `${key} must declare complete license metadata.`);
    }

    if (!/^color\.icon\./.test(icon.token_binding?.color || '') || !/^size\.icon\./.test(icon.token_binding?.size || '')) {
      addIssue('ICON_TOKEN_BINDING_INVALID', 'critical', `${key} must bind to color.icon.* and size.icon.* tokens.`);
    }

    if (!Array.isArray(icon.sizes) || icon.sizes.some((size) => !governedIconSizeSet.has(size))) {
      addIssue('ICON_SIZE_TOKEN_INVALID', 'critical', `${key} must use governed icon sizes ${governedIconSizes.join('/')}.`);
    }

    if (icon.category !== 'brand' && icon.default_size !== defaultIconSize) {
      addIssue('DEFAULT_ICON_SIZE_INVALID', 'critical', `${key} must default to ${defaultIconSize}px unless it is a brand asset exception.`);
    }

    if (icon.category !== 'brand' && icon.token_binding?.size !== 'size.icon.md') {
      addIssue('ICON_TOKEN_BINDING_INVALID', 'critical', `${key} default size must bind to size.icon.md.`);
    }

    if (icon.category !== 'brand') {
      if (icon.default_canvas_size !== defaultIconSize || icon.view_box !== defaultIconSize) {
        addIssue('DEFAULT_ICON_CANVAS_INVALID', 'critical', `${key} must declare a ${defaultIconSize}px canvas and viewBox.`);
      }

      if (icon.default_glyph_size !== defaultIconGlyphSize) {
        addIssue('DEFAULT_ICON_GLYPH_INVALID', 'critical', `${key} must declare a ${defaultIconGlyphSize}px default glyph.`);
      }

      if (icon.safe_area_inset !== defaultIconSafeAreaInset) {
        addIssue('ICON_SAFE_AREA_INVALID', 'critical', `${key} must declare a ${defaultIconSafeAreaInset}px safe-area inset.`);
      }

      if (!allowedShapeFits.has(icon.shape_fit)) {
        addIssue('ICON_SHAPE_FIT_INVALID', 'critical', `${key} must declare shape_fit as square, rectangle, circle, or balanced.`);
      }
    }

    if (icon.style?.default !== 'line' || icon.style?.active !== 'fill') {
      addIssue('ICON_STYLE_CONTRACT_INVALID', 'critical', `${key} must declare line as default style and fill as active style.`);
    }

    if (icon.source_library !== 'custom') {
      const exports = exportedBySource[icon.source_library];
      if (exports?.size && !exports.has(icon.source_icon_name)) {
        addIssue('REGISTRY_GLYPH_MISSING_FROM_SOURCE', 'blocker', `${key} references missing ${icon.source_library} glyph ${icon.source_icon_name}.`);
      }
    }

    if (icon.source_library === 'iconsax') {
      const expectedScope = key.startsWith('icon.iconsax.') ? 'library_asset' : 'semantic';
      if (icon.registry_scope !== expectedScope) {
        addIssue('ICONSAX_REGISTRY_SCOPE_INVALID', 'critical', `${key} must declare registry_scope as ${expectedScope}.`);
      }
      if (!icon.source_category || !icon.source_category_slug || !icon.source_icon_slug) {
        addIssue('ICONSAX_SOURCE_METADATA_MISSING', 'critical', `${key} must declare source category and icon slug metadata.`);
      }
      if (icon.license?.name !== 'Iconsax Free License' || icon.license?.url !== 'https://docs.iconsax.io/license-and-terms/license') {
        addIssue('ICONSAX_LICENSE_INVALID', 'critical', `${key} must declare Iconsax Free License metadata.`);
      }
    }

    if (!icon.local_asset_path || !icon.local_asset_path.startsWith('src/icons/local/')) {
      addIssue('ICON_LOCAL_ASSET_PATH_MISSING', 'blocker', `${key} must declare a local_asset_path under src/icons/local.`);
    } else {
      const localAssetPath = path.join(root, icon.local_asset_path);
      if (!fs.existsSync(localAssetPath)) {
        addIssue('ICON_LOCAL_ASSET_MISSING', 'blocker', `${key} local asset is missing at ${icon.local_asset_path}.`);
      }
    }

    const componentKey = `${icon.source_library}:${icon.source_icon_name}`;
    if (!localIconMapSource.includes(`"${componentKey}"`) && !iconsaxGeneratedSource.includes(`"${componentKey}"`)) {
      addIssue('REGISTRY_GLYPH_NOT_MAPPED', 'blocker', `${key} local glyph ${componentKey} is not mapped by iconComponentMap.`);
    }
  }

  for (const [legacy, target] of Object.entries(registry.migration || {})) {
    if (!registryKeys.has(target)) {
      addIssue('ICON_MIGRATION_TARGET_MISSING', 'critical', `${legacy} migrates to missing ${target}.`);
    }
    if (!iconRegistrySource.includes(`"${legacy}":`)) {
      addIssue('ICON_RUNTIME_MIGRATION_MISSING', 'critical', `${legacy} must exist in legacyIconNameMap.`);
    }
  }
}

function assertTokenPolicy() {
  if (iconQaRules.tokenRules?.backgroundColorPattern !== '^color\\.iconBg\\.') {
    addIssue('ICON_BG_TOKEN_POLICY_INVALID', 'critical', 'Icon QA must require color.iconBg.* for icon container backgrounds.', iconQaRulesPath);
  }

  for (const token of governedIconBackgroundTokens) {
    if (!iconQaRules.iconBackgroundTokens?.includes(token)) {
      addIssue('ICON_BG_TOKEN_POLICY_INVALID', 'critical', `${token} must be declared as a governed icon background token.`, iconQaRulesPath);
    }
  }

  if (!Array.isArray(registry.token_contract?.glyph_size) || registry.token_contract.glyph_size.some((token) => !/^size\.iconGlyph\./.test(token))) {
    addIssue('ICON_GLYPH_TOKEN_POLICY_INVALID', 'critical', 'Registry token_contract.glyph_size must declare size.iconGlyph.* tokens.', registryPath);
  }

  for (const mode of ['darkTerminal', 'lightBroker', 'midnightBlue']) {
    const iconBg = tokenModeMatrix.modes?.[mode]?.colors?.iconBg;
    if (!iconBg) {
      addIssue('ICON_BG_TOKEN_MISSING', 'critical', `${mode}.colors.iconBg must exist in token-mode.matrix.json.`, tokenModeMatrixPath);
      continue;
    }

    for (const token of governedIconBackgroundTokens) {
      const key = token.replace('color.iconBg.', '');
      if (typeof iconBg[key] !== 'string') {
        addIssue('ICON_BG_TOKEN_MISSING', 'critical', `${mode}.colors.iconBg.${key} must be defined.`, tokenModeMatrixPath);
      }
    }
  }

  if (!/iconBg:\s*\{/.test(themeColorsSource) || !/marketUp:\s*string/.test(themeColorsSource) || !/marketDown:\s*string/.test(themeColorsSource)) {
    addIssue('ICON_BG_RUNTIME_CONTRACT_MISSING', 'critical', 'ThemeColors must expose iconBg plus marketUp/marketDown icon foregrounds.', themeColorsPath);
  }
}

function assertCodeUsage() {
  const productionFiles = [
    ...collectFiles(path.join(root, 'app')),
    ...collectFiles(path.join(root, 'src')),
  ].filter((file) => fs.existsSync(file));
  const configFiles = [
    packageJsonPath,
    path.join(root, 'pnpm-lock.yaml'),
    path.join(root, 'tsconfig.json'),
  ].filter((file) => fs.existsSync(file));
  const qaFiles = collectFiles(path.join(root, 'scripts')).filter((file) => fs.existsSync(file));
  const policyFiles = [
    registryPath,
    path.join(root, 'design-system-engineering/04_icons/icon-qa.rules.json'),
    path.join(root, 'design-system-engineering/04_icons/icon-usage-rules.md'),
    path.join(root, 'design-system-engineering/04_icons/icon-changelog.md'),
  ].filter((file) => fs.existsSync(file));

  const registryKeys = new Set((registry.icons || []).map((icon) => icon.icon_key));
  const semanticUsage = new Map(Array.from(registryKeys).map((key) => [key, 0]));
  const legacyNames = new Set(Object.keys(registry.migration || {}));

  for (const file of [...productionFiles, ...configFiles]) {
    const relativeFile = path.relative(root, file);
    const source = readFileIfExists(file);

    if (/(hugeicons|Hugeicons|@hugeicons)/.test(source)) {
      addIssue('HUGEICONS_CODE_REFERENCE', 'blocker', 'Hugeicons references are blocked by the current icon source policy.', file);
    }

    if (/from ['"]react-native-svg['"]/.test(source) && !allowedSvgRenderers.has(relativeFile)) {
      const isLocalIconAsset = relativeFile.startsWith('src/icons/local/');
      if (!isLocalIconAsset) {
        addIssue('UNREGISTERED_LOCAL_SVG_ICON', 'blocker', 'Functional icons must use AppIcon and the semantic registry. Local SVG is only allowed for governed local icon assets, charts, or instrument renderers.', file);
      }
    }

    if (/from ['"](@expo\/vector-icons|phosphor-react-native|lucide-react-native|react-native-remix-icon)['"]/.test(source)) {
      addIssue('LOW_LEVEL_ICON_IMPORT', 'blocker', 'Runtime icon libraries are blocked; AppIcon must render local vendored assets from src/icons/local.', file);
    }

    if (/styles\.[A-Za-z0-9_]*(Icon|icon)\b/.test(source) && !allowedSemanticIconContainerFiles.has(relativeFile)) {
      for (const pattern of forbiddenIconContainerBackgroundPatterns) {
        if (pattern.test(source)) {
          addIssue(
            'NON_GREY_ICON_CONTAINER_BACKGROUND',
            'major',
            'Rounded functional icon containers must use AppIconFrame or colors.iconBg.* grey backgrounds, not brand/status/market alpha backgrounds.',
            file,
          );
          break;
        }
      }
    }

    if (allowedSemanticIconContainerFiles.has(relativeFile)) {
      const hasGovernedDiscoverSemanticIconPairing =
        /getDiscoverEntryIconTone/.test(source) &&
        /getDiscover(Campaign)?IconTone/.test(source) &&
        /getDiscoverIconBackgroundColor/.test(source) &&
        /colors\.overlay\.(brand|danger|down|info|success|up|warning)\.subtle/.test(source);
      if (!hasGovernedDiscoverSemanticIconPairing) {
        addIssue(
          'SEMANTIC_ICON_CONTAINER_EXCEPTION_INVALID',
          'major',
          'Discover entry semantic icon containers must keep an explicit tone/background mapping through color.icon.* and color.overlay.*.subtle.',
          file,
        );
      }
    }

    const literalAppIconToneMatches = source.matchAll(/<AppIcon\b[^>]*\btone=(['"])([^'"]+)\1/g);
    for (const match of literalAppIconToneMatches) {
      const tone = match[2];
      if (forbiddenColorLiteralPattern.test(tone) || !allowedLiteralIconTones.has(tone)) {
        addIssue(
          'APP_ICON_LITERAL_TONE_NOT_GOVERNED',
          'critical',
          `AppIcon literal tone "${tone}" is not allowed. Use a governed IconTone that resolves through color.icon.* instead of passing a raw color.`,
          file,
        );
      }
    }

    const expressionIconToneMatches = source.matchAll(/<AppIcon(?:Frame)?\b[^>]*\btone=\{([^}]+)\}/g);
    for (const match of expressionIconToneMatches) {
      const expression = match[1].trim();
      if (/^colors\./.test(expression) || /#[0-9A-Fa-f]{3,8}/.test(expression) || /rgba?\(|hsla?\(/.test(expression) || /\b(hex|rgb|hsl|color)\b/i.test(expression)) {
        addIssue(
          'APP_ICON_COLOR_VALUE_TONE',
          'critical',
          `Icon tone expression "${expression}" passes a color value. Use a governed IconTone and let AppIcon resolve color.icon.* tokens.`,
          file,
        );
      }
    }

    const literalAppIconStyleMatches = source.matchAll(/<AppIcon\b[^>]*\bstyleVariant=(['"])([^'"]+)\1/g);
    for (const match of literalAppIconStyleMatches) {
      const styleVariant = match[2];
      if (!['line', 'fill'].includes(styleVariant)) {
        addIssue('APP_ICON_STYLE_VARIANT_NOT_GOVERNED', 'critical', `AppIcon styleVariant "${styleVariant}" must be line or fill.`, file);
      }
    }

    for (const key of registryKeys) {
      const matches = source.match(new RegExp(`['"]${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`, 'g'));
      if (matches) {
        semanticUsage.set(key, semanticUsage.get(key) + matches.length);
      }
    }

    if (!relativeFile.startsWith('design-system-engineering/04_icons') && relativeFile !== 'src/icons/iconRegistry.ts') {
      for (const legacy of legacyNames) {
        const legacyMatch = source.match(new RegExp(`['"]${legacy}['"]`, 'g'));
        if (legacyMatch) {
          const allowedBusinessId =
            legacy === 'functionCenter' &&
            (relativeFile === 'src/domain/discoverLayout.ts' || relativeFile === 'src/screens/discover/DupoinDiscoverScreen.tsx');
          if (!allowedBusinessId) {
            addIssue('LEGACY_ICON_NAME_USED', 'critical', `${legacy} must be migrated to ${registry.migration[legacy]}.`, file);
          }
        }
      }
    }
  }

  for (const file of qaFiles) {
    const relativeFile = path.relative(root, file);
    const source = readFileIfExists(file);
    for (const legacy of legacyNames) {
      const legacyMatch = source.match(new RegExp(`['"]${legacy}['"]`, 'g'));
      if (legacyMatch) {
        const allowedBusinessId =
          legacy === 'functionCenter' &&
          relativeFile === 'scripts/qa/check-icons.js';
        if (!allowedBusinessId) {
          addIssue('LEGACY_ICON_NAME_USED', 'critical', `${legacy} must be migrated to ${registry.migration[legacy]}.`, file);
        }
      }
    }
  }

  for (const file of policyFiles) {
    const source = readFileIfExists(file);
    if (/from ['"]@hugeicons/.test(source)) {
      addIssue('HUGEICONS_POLICY_IMPORT_REFERENCE', 'blocker', 'Policy files may mention blocked Hugeicons libraries only as blocked library names, not runtime imports.', file);
    }
  }

  for (const [key, count] of semanticUsage) {
    const icon = (registry.icons || []).find((item) => item.icon_key === key);
    if (count === 0 && icon?.registry_scope !== 'library_asset') {
      addIssue('UNUSED_REGISTRY_ICON', 'major', `${key} is registered but not used by app, component, or docs code.`);
    }
  }
}

function imageDimensions(file) {
  const output = execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', file], { encoding: 'utf8' });
  const width = Number(output.match(/pixelWidth:\s*(\d+)/)?.[1]);
  const height = Number(output.match(/pixelHeight:\s*(\d+)/)?.[1]);
  return { height, width };
}

function assertBrandAssets() {
  const brandAssets = registry.brand_assets || {};

  for (const key of ['launcherIcon', 'adaptiveIcon', 'splashIcon']) {
    const relativeAssetPath = brandAssets[key];
    if (!relativeAssetPath) {
      addIssue('BRAND_ASSET_MISSING', 'critical', `${key} must be declared in brand_assets.`);
      continue;
    }

    const assetPath = path.join(root, relativeAssetPath);
    if (!fs.existsSync(assetPath)) {
      addIssue('BRAND_ASSET_MISSING', 'critical', `${key} does not exist at ${relativeAssetPath}.`);
      continue;
    }

    const dimensions = imageDimensions(assetPath);
    if (dimensions.width !== 1024 || dimensions.height !== 1024) {
      addIssue('BRAND_ASSET_SIZE', 'critical', `${key} must be 1024x1024; found ${dimensions.width}x${dimensions.height}.`);
    }
  }
}

function assertRuntimeContract() {
  if (!appIconSource.includes("sizeVariant = 'md'")) {
    addIssue('APP_ICON_DEFAULT_SIZE_VARIANT_INVALID', 'critical', 'AppIcon must default sizeVariant to md / 24px.', appIconPath);
  }

  if (!appIconSource.includes("styleVariant = 'line'")) {
    addIssue('APP_ICON_DEFAULT_STYLE_VARIANT_INVALID', 'critical', 'AppIcon must default styleVariant to line.', appIconPath);
  }

  if (!appIconSource.includes('lineWidth.icon.default')) {
    addIssue('ICON_STROKE_WIDTH_INVALID', 'critical', 'AppIcon must pass lineWidth.icon.default to local icon renderers.', appIconPath);
  }

  if (!iconRegistrySource.includes("case 'brand':") || !iconRegistrySource.includes('return colors.icon.active;')) {
    addIssue('ICON_BRAND_TONE_MAPPING_INVALID', 'critical', 'Icon tone "brand" must resolve through colors.icon.active, not colors.brand.fg.', iconRegistryPath);
  }

  const tokenSource = readFileIfExists(path.join(root, 'src/theme/tokens.ts'));
  if (!/iconGlyph:\s*\{/.test(tokenSource) || !/md:\s*21/.test(tokenSource)) {
    addIssue('DEFAULT_ICON_GLYPH_INVALID', 'critical', `size.iconGlyph.md must be ${defaultIconGlyphSize}.`, path.join(root, 'src/theme/tokens.ts'));
  }

  if (!tokenSource.includes('default: 1.5')) {
    addIssue('ICON_STROKE_WIDTH_INVALID', 'critical', `lineWidth.icon.default must be ${defaultIconStrokeWidth}.`, path.join(root, 'src/theme/tokens.ts'));
  }

  if (!appIconSource.includes('resolvedCanvasSize') || !appIconSource.includes('resolvedGlyphSize') || !appIconSource.includes('styles.canvas')) {
    addIssue('APP_ICON_CANVAS_GLYPH_CONTRACT_INVALID', 'critical', 'AppIcon must render a stable canvas wrapper and centered governed glyph size.', appIconPath);
  }
}

assertPackageClean();
assertRegistryPolicy();
assertTokenPolicy();
assertRegistryEntries();
assertCodeUsage();
assertBrandAssets();
assertRuntimeContract();

const blockerOrCritical = issues.some((issue) => issue.severity === 'blocker' || issue.severity === 'critical');
const result = {
  issues,
  name: 'check-icons',
  status: blockerOrCritical ? 'failed' : 'passed',
  summary: {
    issues: issues.length,
    registeredIcons: Array.isArray(registry.icons) ? registry.icons.length : 0,
    sourcePolicy: registry.source_policy?.primary_library,
    sources: Array.isArray(registry.icons)
      ? registry.icons.reduce((acc, icon) => {
          acc[icon.source_library] = (acc[icon.source_library] || 0) + 1;
          return acc;
        }, {})
      : {},
  },
};

console.log(JSON.stringify(result, null, 2));
process.exitCode = blockerOrCritical ? 1 : 0;
