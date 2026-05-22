const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.resolve(__dirname, '../..');
const registryPath = path.join(root, 'design-system-engineering/04_icons/icon-registry.json');
const appIconPath = path.join(root, 'src/components/AppIcon.tsx');
const hugeiconsTypesPath = path.join(root, 'node_modules/@hugeicons/core-free-icons/dist/types/index.d.ts');

const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
const hugeiconsTypes = fs.existsSync(hugeiconsTypesPath) ? fs.readFileSync(hugeiconsTypesPath, 'utf8') : '';
const requiredFields = [
  'provider',
  'providerIcon',
  'proProviderIcon',
  'style',
  'category',
  'platforms',
  'defaultSize',
  'allowedTones',
  'primaryTone',
  'secondaryTone',
  'strokeWidth',
  'visualWeight',
  'financeSemanticScore',
  'states',
  'usage',
  'forbidden',
  'deprecated',
];
const issues = [];

function addIssue(id, severity, message, file = registryPath) {
  issues.push({ file: path.relative(root, file), id, message, severity });
}

if (!registry.icons || typeof registry.icons !== 'object') {
  addIssue('ICON_REGISTRY_MISSING', 'blocker', 'icon-registry.json must expose an icons object.');
}

const entries = Object.entries(registry.icons || {});
for (const [name, icon] of entries) {
  for (const field of requiredFields) {
    if (!(field in icon)) {
      addIssue('ICON_METADATA_MISSING', 'critical', `${name} is missing required field ${field}.`);
    }
  }

  if (!hugeiconsTypes.includes(`declare const ${icon.providerIcon}:`)) {
    addIssue('ICON_PROVIDER_ICON_MISSING', 'blocker', `${name} references missing Hugeicons provider icon ${icon.providerIcon}.`);
  }

  if (!String(icon.provider || '').startsWith('hugeicons-')) {
    addIssue('ICON_PROVIDER_INVALID', 'critical', `${name} must use Hugeicons as the production icon provider.`);
  }

  if (icon.financeSemanticScore < 8 && ['market', 'trading', 'funds', 'risk', 'kyc'].includes(icon.category)) {
    addIssue('ICON_FINANCE_SCORE_LOW', 'critical', `${name} is a core financial icon and must score at least 8.`);
  }

  if (!Array.isArray(icon.allowedTones) || icon.allowedTones.length === 0) {
    addIssue('ICON_TONES_MISSING', 'critical', `${name} must declare at least one allowed tone.`);
  }

  if (!Array.isArray(icon.states) || icon.states.length === 0) {
    addIssue('ICON_STATES_MISSING', 'critical', `${name} must declare at least one state.`);
  }
}

const appFiles = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
    } else if (/\.(ts|tsx)$/.test(entry.name)) {
      appFiles.push(fullPath);
    }
  }
}

walk(path.join(root, 'app'));
walk(path.join(root, 'src'));

const semanticUsage = new Map(entries.map(([name]) => [name, 0]));
for (const file of appFiles) {
  if (file === appIconPath || file.endsWith('src/components/PhosphorIcon.tsx') || file.endsWith('src/icons/phosphor.ts') || file.endsWith('src/icons/iconRegistry.ts')) {
    continue;
  }

  const source = fs.readFileSync(file, 'utf8');
  if (/from ['"].*\/PhosphorIcon['"]/.test(source)) {
    addIssue('LOW_LEVEL_ICON_IMPORT', 'blocker', 'Pages and feature components must import AppIcon instead of PhosphorIcon.', file);
  }

  for (const [name] of entries) {
    const matches = source.match(new RegExp(`['"]${name}['"]`, 'g'));
    if (matches) {
      semanticUsage.set(name, semanticUsage.get(name) + matches.length);
    }
  }
}

for (const [name, count] of semanticUsage) {
  const icon = registry.icons[name];
  if (count === 0 && icon.deprecated !== true) {
    addIssue('UNUSED_SEMANTIC_ICON', 'major', `${name} is registered but not used by app or component code.`);
  }
}

function imageDimensions(file) {
  const output = execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', file], { encoding: 'utf8' });
  const width = Number(output.match(/pixelWidth:\s*(\d+)/)?.[1]);
  const height = Number(output.match(/pixelHeight:\s*(\d+)/)?.[1]);
  return { height, width };
}

for (const key of ['launcherIcon', 'adaptiveIcon', 'splashIcon']) {
  const assetPath = path.join(root, registry.brandAssets[key]);
  if (!fs.existsSync(assetPath)) {
    addIssue('BRAND_ASSET_MISSING', 'critical', `${key} does not exist at ${registry.brandAssets[key]}.`);
    continue;
  }

  const dimensions = imageDimensions(assetPath);
  if (dimensions.width !== 1024 || dimensions.height !== 1024) {
    addIssue('BRAND_ASSET_SIZE', 'critical', `${key} must be 1024x1024; found ${dimensions.width}x${dimensions.height}.`);
  }
}

const blockerOrCritical = issues.some((issue) => issue.severity === 'blocker' || issue.severity === 'critical');
const result = {
  issues,
  name: 'check-icons',
  status: blockerOrCritical ? 'failed' : 'passed',
  summary: {
    issues: issues.length,
    provider: registry.source,
    registeredIcons: entries.length,
  },
};

console.log(JSON.stringify(result, null, 2));
process.exitCode = blockerOrCritical ? 1 : 0;
