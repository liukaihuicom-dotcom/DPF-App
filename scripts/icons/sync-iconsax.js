const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const root = path.resolve(__dirname, '../..');
const sourceZipUrl = 'https://raw.githubusercontent.com/lusaxweb/iconsax/master/static/Iconsax.zip';
const sourceRepo = 'https://github.com/lusaxweb/iconsax';
const sourceCommit = 'e5dba15361f69d34d0f3f3f35408a28fe74c5727';
const licenseUrl = 'https://docs.iconsax.io/license-and-terms/license';
const licenseName = 'Iconsax Free License';
const generatedAt = '2026-05-25';
const variants = ['linear', 'bold', 'broken', 'bulk', 'twotone', 'outline'];
const runtimeVariants = ['linear', 'bold'];
const governedSizes = [8, 12, 16, 20, 24, 32, 40, 48, 64];

const cacheRoot = path.join(os.tmpdir(), 'dpf-iconsax-source');
const zipPath = path.join(cacheRoot, 'Iconsax.zip');
const extractedRoot = path.join(cacheRoot, 'extracted');
const categoryRoot = path.join(extractedRoot, 'Iconsax/Svg/Category');
const allRoot = path.join(extractedRoot, 'Iconsax/Svg/All');
const localOutputDir = path.join(root, 'src/icons/local/iconsax');
const generatedComponentsPath = path.join(localOutputDir, 'iconsaxGeneratedIcons.tsx');
const generatedRegistryPath = path.join(root, 'src/icons/iconsaxRegistry.generated.ts');
const sourceManifestPath = path.join(root, 'design-system-engineering/04_icons/iconsax-source-manifest.json');
const iconRegistryJsonPath = path.join(root, 'design-system-engineering/04_icons/icon-registry.json');

function main() {
  ensureOfficialSource();

  const allVariantMap = collectAllVariantSvgMap();
  const categoryIconMap = collectCategoryIcons(allVariantMap);
  const allIconRecords = buildIconRecords(categoryIconMap);
  const runtimeIconRecords = allIconRecords.filter((icon) => runtimeVariants.every((variant) => icon.variants[variant]));
  const skippedIconRecords = allIconRecords.filter((icon) => !runtimeVariants.every((variant) => icon.variants[variant]));
  const duplicateBaseSlugs = findDuplicateBaseSlugs(runtimeIconRecords);
  const sourceZipSha256 = sha256File(zipPath);

  fs.mkdirSync(localOutputDir, { recursive: true });
  writeGeneratedComponents(runtimeIconRecords);
  writeGeneratedRuntimeRegistry(runtimeIconRecords);
  updateGovernedRegistry(runtimeIconRecords);
  writeSourceManifest({
    allIconRecords,
    duplicateBaseSlugs,
    runtimeIconRecords,
    skippedIconRecords,
    sourceZipSha256,
  });

  console.log(JSON.stringify({
    generatedIcons: runtimeIconRecords.length,
    officialUniqueIcons: allIconRecords.length,
    skippedWithoutLinearBold: skippedIconRecords.length,
    sourceZipSha256,
  }, null, 2));
}

function ensureOfficialSource() {
  fs.mkdirSync(cacheRoot, { recursive: true });
  if (!fs.existsSync(zipPath)) {
    execFileSync('curl', ['-L', '-s', '-o', zipPath, sourceZipUrl], { stdio: 'inherit' });
  }

  fs.rmSync(extractedRoot, { recursive: true, force: true });
  fs.mkdirSync(extractedRoot, { recursive: true });
  execFileSync('unzip', ['-q', zipPath, '-d', extractedRoot], { stdio: 'inherit' });

  if (!fs.existsSync(categoryRoot)) {
    throw new Error(`Iconsax source package did not contain ${categoryRoot}`);
  }

  if (!fs.existsSync(allRoot)) {
    throw new Error(`Iconsax source package did not contain ${allRoot}`);
  }
}

function collectAllVariantSvgMap() {
  const variantMap = Object.fromEntries(variants.map((variant) => [variant, new Map()]));

  for (const variant of variants) {
    const variantDirs = [path.join(allRoot, variant), path.join(allRoot, 'Crypto', variant)];
    for (const variantDir of variantDirs) {
      if (!fs.existsSync(variantDir)) {
        continue;
      }

      for (const svgPath of collectFiles(variantDir, '.svg')) {
        const iconSlug = normalizeIconSlug(path.basename(svgPath, '.svg'));
        if (isValidSourceIconSlug(iconSlug)) {
          variantMap[variant].set(iconSlug, svgPath);
        }
      }
    }
  }

  return variantMap;
}

function collectCategoryIcons(allVariantMap) {
  const categories = fs.readdirSync(categoryRoot).filter((name) => !name.startsWith('.')).sort();
  const categoryIconMap = new Map();

  for (const sourceCategory of categories) {
    const categorySlug = toSlug(sourceCategory);
    const categoryIconSlugs = new Set();

    for (const variant of variants) {
      const variantDir = path.join(categoryRoot, sourceCategory, 'vuesax', variant);
      if (!fs.existsSync(variantDir)) {
        continue;
      }

      for (const svgPath of collectFiles(variantDir, '.svg')) {
        const iconSlug = normalizeIconSlug(path.basename(svgPath, '.svg'));
        if (isValidSourceIconSlug(iconSlug)) {
          categoryIconSlugs.add(iconSlug);
        }
      }
    }

    for (const iconSlug of Array.from(categoryIconSlugs).sort()) {
      const entry = {
        baseSlug: iconSlug,
        categorySlug,
        sourceCategory,
        sourceIconName: iconSlug.replace(/_/g, '-'),
        variants: {},
      };

      for (const variant of variants) {
        const allVariantSvg = allVariantMap[variant].get(iconSlug);
        if (allVariantSvg) {
          entry.variants[variant] = allVariantSvg;
        }
      }

      categoryIconMap.set(`${categorySlug}/${iconSlug}`, entry);
    }
  }

  return categoryIconMap;
}

function buildIconRecords(categoryIconMap) {
  const records = Array.from(categoryIconMap.values())
    .sort((a, b) => `${a.categorySlug}/${a.baseSlug}`.localeCompare(`${b.categorySlug}/${b.baseSlug}`));
  const duplicateBaseSlugs = findDuplicateBaseSlugs(records);

  return records.map((icon) => {
    const sourceIconName = duplicateBaseSlugs[icon.baseSlug]
      ? `${toPascalCase(icon.categorySlug)}${toPascalCase(icon.baseSlug)}`
      : toPascalCase(icon.baseSlug);

    return {
      ...icon,
      componentName: `LocalIconsax${toPascalCase(icon.categorySlug)}${toPascalCase(icon.baseSlug)}Icon`,
      iconKey: `icon.iconsax.${icon.categorySlug}.${icon.baseSlug}`,
      localAssetPath: 'src/icons/local/iconsax/iconsaxGeneratedIcons.tsx',
      sourceIconName,
    };
  });
}

function findDuplicateBaseSlugs(records) {
  const bySlug = new Map();
  for (const record of records) {
    const categories = bySlug.get(record.baseSlug) || [];
    categories.push(record.categorySlug);
    bySlug.set(record.baseSlug, categories);
  }

  return Object.fromEntries(
    Array.from(bySlug.entries())
      .filter(([, categories]) => categories.length > 1)
      .sort(([a], [b]) => a.localeCompare(b)),
  );
}

function writeGeneratedComponents(records) {
  const lines = [
    '/* Generated by scripts/icons/sync-iconsax.js from the official Iconsax Free source package. Do not edit manually. */',
    "import { IconsaxIconBase, type IconsaxNode } from '@/src/icons/local/IconsaxIconBase';",
    "import type { LocalIconComponent, LocalIconProps } from '@/src/icons/local/types';",
    '',
  ];

  const mapEntries = [];
  for (const record of records) {
    const linearNodes = parseSvg(record.variants.linear);
    const boldNodes = parseSvg(record.variants.bold);
    lines.push(`const ${record.componentName}LinearNodes = ${JSON.stringify(linearNodes)} as const satisfies readonly IconsaxNode[];`);
    lines.push(`const ${record.componentName}BoldNodes = ${JSON.stringify(boldNodes)} as const satisfies readonly IconsaxNode[];`);
    lines.push('');
    lines.push(`function ${record.componentName}(props: LocalIconProps) {`);
    lines.push(`  return <IconsaxIconBase boldNodes={${record.componentName}BoldNodes} linearNodes={${record.componentName}LinearNodes} {...props} />;`);
    lines.push('}');
    lines.push('');
    mapEntries.push(`  "iconsax:${record.sourceIconName}": ${record.componentName},`);
  }

  lines.push('export const iconsaxIconComponents = {');
  lines.push(...mapEntries);
  lines.push('} as const satisfies Record<string, LocalIconComponent>;');
  lines.push('');

  fs.writeFileSync(generatedComponentsPath, lines.join('\n'));
}

function writeGeneratedRuntimeRegistry(records) {
  const entries = records.map((record) => {
    const def = toRuntimeRegistryEntry(record);
    return `  ${JSON.stringify(record.iconKey)}: ${JSON.stringify(def, null, 4).replace(/\n/g, '\n  ')},`;
  });

  const source = [
    '/* Generated by scripts/icons/sync-iconsax.js from the official Iconsax Free source package. Do not edit manually. */',
    "import type { AppIconDefinition } from '@/src/icons/iconRegistry';",
    '',
    'export const iconsaxIconRegistry = {',
    ...entries,
    '} as const satisfies Record<string, AppIconDefinition>;',
    '',
  ].join('\n');

  fs.writeFileSync(generatedRegistryPath, source);
}

function updateGovernedRegistry(records) {
  const registry = JSON.parse(fs.readFileSync(iconRegistryJsonPath, 'utf8'));
  registry.version = '3.6.0';
  registry.generated_at = generatedAt;
  registry.source_policy = {
    ...registry.source_policy,
    supplement_libraries: Array.from(new Set([...(registry.source_policy.supplement_libraries || []), 'remix', 'lucide', 'iconsax'])),
    approved_libraries: upsertApprovedLibrary(registry.source_policy.approved_libraries || []),
    runtime_policy: {
      ...registry.source_policy.runtime_policy,
      blocked_runtime_dependencies: Array.from(new Set([...(registry.source_policy.runtime_policy.blocked_runtime_dependencies || []), 'iconsax-react-native'])),
    },
  };

  const existingNonIconsax = (registry.icons || []).filter((icon) => !icon.icon_key?.startsWith('icon.iconsax.'));
  registry.icons = [...existingNonIconsax, ...records.map(toGovernedRegistryEntry)];
  fs.writeFileSync(iconRegistryJsonPath, `${JSON.stringify(registry, null, 2)}\n`);
}

function upsertApprovedLibrary(libraries) {
  const withoutIconsax = libraries.filter((library) => library.library !== 'iconsax');
  return [
    ...withoutIconsax,
    {
      library: 'iconsax',
      role: 'governed-library-asset',
      package: 'official-iconsax-source-package',
      license: licenseName,
      license_url: licenseUrl,
      attribution_required: false,
      source_url: sourceZipUrl,
      source_repository: sourceRepo,
      source_commit: sourceCommit,
    },
  ];
}

function writeSourceManifest({ allIconRecords, duplicateBaseSlugs, runtimeIconRecords, skippedIconRecords, sourceZipSha256 }) {
  const categoryCounts = {};
  const variantCounts = Object.fromEntries(variants.map((variant) => [variant, 0]));

  for (const icon of allIconRecords) {
    categoryCounts[icon.categorySlug] = categoryCounts[icon.categorySlug] || {
      runtime_linear_bold_icons: 0,
      source_unique_icons: 0,
      source_category: icon.sourceCategory,
    };
    categoryCounts[icon.categorySlug].source_unique_icons += 1;
    for (const variant of variants) {
      if (icon.variants[variant]) {
        variantCounts[variant] += 1;
      }
    }
  }

  for (const icon of runtimeIconRecords) {
    categoryCounts[icon.categorySlug].runtime_linear_bold_icons += 1;
  }

  const manifest = {
    version: '3.6.0',
    generated_at: generatedAt,
    source_library: 'iconsax',
    source_repository: sourceRepo,
    source_commit: sourceCommit,
    source_zip_url: sourceZipUrl,
    source_zip_sha256: sourceZipSha256,
    license: {
      name: licenseName,
      url: licenseUrl,
      attribution_required: false,
      restrictions: [
        'Do not resell or redistribute Iconsax as a standalone icon pack.',
        'Do not claim Iconsax artwork ownership or authorship.',
        'Project usage is internal/private app asset vendoring, not standalone icon package distribution.',
      ],
    },
    runtime_contract: {
      renderer: 'src/icons/local/IconsaxIconBase.tsx',
      local_asset_module: 'src/icons/local/iconsax/iconsaxGeneratedIcons.tsx',
      app_icon_style_mapping: {
        line: 'Iconsax Linear',
        fill: 'Iconsax Bold',
      },
      runtime_dependency: 'none',
      blocked_runtime_package: 'iconsax-react-native',
    },
    counts: {
      source_categories: Object.keys(categoryCounts).length,
      source_unique_icons: allIconRecords.length,
      generated_runtime_icons: runtimeIconRecords.length,
      skipped_without_linear_and_bold: skippedIconRecords.length,
      source_variant_files_by_style: variantCounts,
    },
    category_counts: categoryCounts,
    duplicate_base_slugs: duplicateBaseSlugs,
    skipped_icons: skippedIconRecords.map((icon) => ({
      category_slug: icon.categorySlug,
      icon_slug: icon.baseSlug,
      available_variants: variants.filter((variant) => icon.variants[variant]),
    })),
    generated_icon_keys: runtimeIconRecords.map((icon) => icon.iconKey),
  };

  fs.writeFileSync(sourceManifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
}

function toRuntimeRegistryEntry(record) {
  const governed = toGovernedRegistryEntry(record);
  return {
    category: governed.category,
    defaultSize: governed.default_size,
    defaultCanvasSize: governed.default_canvas_size,
    defaultGlyphSize: governed.default_glyph_size,
    defaultTone: governed.default_tone,
    forbidden: governed.forbidden,
    legacyNames: governed.legacy_names,
    license: {
      attributionRequired: governed.license.attribution_required,
      name: governed.license.name,
      url: governed.license.url,
    },
    localAssetPath: governed.local_asset_path,
    meaning: governed.meaning,
    modified: governed.modified,
    platforms: governed.platforms,
    registryScope: governed.registry_scope,
    safeAreaInset: governed.safe_area_inset,
    shapeFit: governed.shape_fit,
    sizes: governed.sizes,
    sourceCategory: governed.source_category,
    sourceIconName: governed.source_icon_name,
    sourceLibrary: governed.source_library,
    states: governed.states,
    status: governed.status,
    style: governed.style,
    tokenBinding: {
      color: governed.token_binding.color,
      size: governed.token_binding.size,
    },
    toneTokens: governed.tone_tokens,
    usage: governed.usage,
    viewBox: governed.view_box,
  };
}

function toGovernedRegistryEntry(record) {
  return {
    icon_key: record.iconKey,
    legacy_names: [],
    category: 'library_asset',
    meaning: `Iconsax ${record.sourceCategory} ${record.baseSlug} library asset`,
    source_library: 'iconsax',
    source_category: record.sourceCategory,
    source_category_slug: record.categorySlug,
    source_icon_slug: record.baseSlug,
    source_icon_name: record.sourceIconName,
    registry_scope: 'library_asset',
    style: {
      default: 'line',
      active: 'fill',
      disabled: 'line',
    },
    sizes: governedSizes,
    default_size: 24,
    default_canvas_size: 24,
    default_glyph_size: 21,
    view_box: 24,
    safe_area_inset: 1.5,
    shape_fit: inferShapeFit(record.baseSlug),
    states: ['default', 'active', 'disabled'],
    tone_tokens: ['primary', 'secondary', 'tertiary', 'disabled', 'inverse'],
    default_tone: 'primary',
    token_binding: {
      color: 'color.icon.primary',
      size: 'size.icon.md',
    },
    usage: [
      'Governed Iconsax Free library asset. Use directly only after semantic review; production UI should prefer existing semantic icon.* keys.',
    ],
    forbidden: [
      'Do not use as a page-local replacement for existing semantic icons without updating icon governance.',
      'Do not redistribute Iconsax as a standalone icon pack or claim ownership of the artwork.',
    ],
    platforms: ['app', 'h5', 'web', 'admin'],
    license: {
      name: licenseName,
      url: licenseUrl,
      attribution_required: false,
    },
    modified: false,
    status: 'approved',
    local_asset_path: record.localAssetPath,
  };
}

function inferShapeFit(slug) {
  if (/(arrow|chevron|horizontal|vertical|left|right|up|down)/.test(slug)) {
    return 'rectangle';
  }
  if (/(circle|avatar|profile|user|face|emoji)/.test(slug)) {
    return 'circle';
  }
  if (/(card|wallet|document|folder|chart|screen|monitor|mobile|tablet|keyboard)/.test(slug)) {
    return 'rectangle';
  }
  return 'balanced';
}

function parseSvg(svgPath) {
  const source = fs.readFileSync(svgPath, 'utf8');
  const body = source.replace(/<svg\b[^>]*>/, '').replace(/<\/svg>\s*$/, '').trim();
  return parseNodes(body);
}

function parseNodes(source) {
  const nodes = [];
  const tagPattern = /<([a-zA-Z][a-zA-Z0-9-]*)([^>]*)>(.*?)<\/\1>|<([a-zA-Z][a-zA-Z0-9-]*)([^>]*)\/>/gs;
  let match;

  while ((match = tagPattern.exec(source))) {
    const tag = match[1] || match[4];
    if (tag === 'title' || tag === 'desc') {
      continue;
    }

    const attrs = parseAttrs(match[2] || match[5] || '');
    const childSource = match[3];
    const children = childSource ? parseNodes(childSource) : undefined;
    nodes.push(children?.length ? [tag, attrs, children] : [tag, attrs]);
  }

  return nodes;
}

function parseAttrs(source) {
  const attrs = {};
    const attrPattern = /([:\w-]+)="([^"]*)"/g;
  let match;

  while ((match = attrPattern.exec(source))) {
    const key = match[1];
    const value = match[2];
    if (['xmlns', 'width', 'height', 'viewBox'].includes(key) || key.startsWith('data-')) {
      continue;
    }
    if (['fill', 'stroke', 'stop-color'].includes(key) && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value)) {
      attrs[key] = 'currentColor';
    } else {
      attrs[key] = numericSvgAttrs.has(key) && /^-?\d+(\.\d+)?$/.test(value) ? Number(value) : value;
    }
  }

  return attrs;
}

const numericSvgAttrs = new Set([
  'cx',
  'cy',
  'fx',
  'fy',
  'height',
  'offset',
  'opacity',
  'r',
  'rx',
  'ry',
  'stroke-miterlimit',
  'stroke-opacity',
  'stroke-width',
  'width',
  'x',
  'x1',
  'x2',
  'y',
  'y1',
  'y2',
]);

function collectFiles(dir, extension, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectFiles(fullPath, extension, out);
    } else if (entry.name.endsWith(extension)) {
      out.push(fullPath);
    }
  }
  return out.sort();
}

function toSlug(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-')
    .replace(/-/g, '_');
}

function normalizeIconSlug(value) {
  return toSlug(value);
}

function isValidSourceIconSlug(iconSlug) {
  return iconSlug !== 'frame' && !/^frame_[0-9]+$/.test(iconSlug) && iconSlug !== 'icon' && !/^icon_[0-9]+$/.test(iconSlug);
}

function toPascalCase(value) {
  return value
    .replace(/[_-]+/g, ' ')
    .replace(/[^a-zA-Z0-9 ]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join('');
}

function sha256File(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

main();
