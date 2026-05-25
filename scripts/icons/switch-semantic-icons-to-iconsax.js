const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '../..');
const registryPath = path.join(root, 'design-system-engineering/04_icons/icon-registry.json');
const runtimeRegistryPath = path.join(root, 'src/icons/iconRegistry.ts');

const license = {
  name: 'Iconsax Free License',
  url: 'https://docs.iconsax.io/license-and-terms/license',
  attribution_required: false,
};

const runtimeLicense = {
  attributionRequired: false,
  name: 'Iconsax Free License',
  url: 'https://docs.iconsax.io/license-and-terms/license',
};

const localAssetPath = 'src/icons/local/iconsax/iconsaxGeneratedIcons.tsx';

const semanticIconsaxMapping = {
  'icon.wallet.withdrawal': 'MoneySend',
  'icon.wallet.transfer': 'ArrowSwapHorizontal',
  'icon.account.trading': 'UserTag',
  'icon.notification.bell': 'Notification',
  'icon.system.chevron_down': 'ArrowDown2',
  'icon.system.back': 'ArrowLeft',
  'icon.system.chevron_right': 'ArrowRight2',
  'icon.trading.market': 'BusinessChart',
  'icon.notification.feedback': 'MessageText',
  'icon.copy.community': 'Profile2user',
  'icon.status.check': 'TickCircle',
  'icon.status.verified': 'Verify',
  'icon.trading.history': 'TimeClock',
  'icon.navigation.discover': 'EssetionalDiscover',
  'icon.system.more': 'More',
  'icon.notification.email': 'Sms',
  'icon.account.phone_verified': 'Mobile',
  'icon.promotion.reward': 'Gift',
  'icon.market.global': 'Global',
  'icon.education.academy': 'Teacher',
  'icon.support.headset': 'Headphone',
  'icon.kyc.identity': 'Personalcard',
  'icon.risk.info': 'InfoCircle',
  'icon.market.watchlist': 'ClipboardText',
  'icon.trading.order': 'TaskSquare',
  'icon.security.lock': 'Lock',
  'icon.security.password_rules': 'PasswordCheck',
  'icon.security.key_access': 'Key',
  'icon.system.keyboard_digits': 'Keyboard',
  'icon.system.password_visible': 'Eye',
  'icon.system.search': 'SearchNormal',
  'icon.wallet.deposit': 'MoneyRecive',
  'icon.ib.network': 'Share',
  'icon.security.risk_shield': 'ShieldTick',
  'icon.system.settings': 'Setting2',
  'icon.promotion.ticket': 'Ticket',
  'icon.promotion.achievement': 'Cup',
  'icon.account.user': 'User',
  'icon.account.avatar': 'ProfileCircle',
  'icon.account.add_user': 'UserAdd',
  'icon.system.close': 'CloseCircle',
  'icon.wallet.balance': 'Wallet',
  'icon.account.archive': 'EssetionalArchive',
  'icon.system.delete': 'Trash',
  'icon.system.logout': 'Logout',
  'icon.trading.order_ticket': 'ReceiptText',
  'icon.trading.group_by_symbol': 'Sort',
  'icon.trading.close_position': 'CloseCircle',
  'icon.trading.close_losing_position': 'TrendDown',
  'icon.trading.buy': 'TrendUp',
  'icon.trading.sell': 'TrendDown',
  'icon.status.rejected': 'CloseCircle',
  'icon.feedback.rating': 'Star',
  'icon.support.help_center': 'MessageQuestion',
  'icon.support.about': 'InfoCircle',
  'icon.navigation.function_center': 'Element4',
  'icon.trading.volume': 'Chart2',
  'icon.market.gold': 'Coin',
  'icon.market.index': 'Chart1',
  'icon.market.stock': 'BusinessChart',
};

function main() {
  const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
  const iconsaxBySourceName = new Map(
    registry.icons
      .filter((icon) => icon.source_library === 'iconsax' && icon.registry_scope === 'library_asset')
      .map((icon) => [icon.source_icon_name, icon]),
  );

  const missingTargets = Object.entries(semanticIconsaxMapping)
    .filter(([, sourceIconName]) => !iconsaxBySourceName.has(sourceIconName))
    .map(([iconKey, sourceIconName]) => `${iconKey} -> ${sourceIconName}`);

  if (missingTargets.length > 0) {
    throw new Error(`Missing Iconsax target glyphs:\n${missingTargets.join('\n')}`);
  }

  const mappedKeys = new Set(Object.keys(semanticIconsaxMapping));
  const changedRegistryKeys = [];
  registry.version = '3.6.1';
  registry.generated_at = '2026-05-25';
  registry.icons = registry.icons.map((icon) => {
    const targetSourceIconName = semanticIconsaxMapping[icon.icon_key];
    if (!targetSourceIconName) {
      return icon;
    }

    const target = iconsaxBySourceName.get(targetSourceIconName);
    changedRegistryKeys.push(icon.icon_key);
    return {
      ...icon,
      source_library: 'iconsax',
      source_category: target.source_category,
      source_category_slug: target.source_category_slug,
      source_icon_slug: target.source_icon_slug,
      source_icon_name: target.source_icon_name,
      registry_scope: 'semantic',
      license,
      modified: false,
      local_asset_path: localAssetPath,
    };
  });

  const semanticStillNotIconsax = registry.icons
    .filter((icon) => !icon.icon_key.startsWith('icon.iconsax.') && icon.icon_key !== 'icon.brand.apple' && icon.source_library !== 'iconsax')
    .map((icon) => `${icon.icon_key}:${icon.source_library}`);

  const unmappedRegistryKeys = Array.from(mappedKeys).filter((key) => !changedRegistryKeys.includes(key));
  if (unmappedRegistryKeys.length > 0 || semanticStillNotIconsax.length > 0) {
    throw new Error(
      [
        unmappedRegistryKeys.length ? `Semantic mapping keys missing from registry:\n${unmappedRegistryKeys.join('\n')}` : '',
        semanticStillNotIconsax.length ? `Semantic icons still not using Iconsax:\n${semanticStillNotIconsax.join('\n')}` : '',
      ]
        .filter(Boolean)
        .join('\n\n'),
    );
  }

  fs.writeFileSync(registryPath, `${JSON.stringify(registry, null, 2)}\n`);
  updateRuntimeRegistry(iconsaxBySourceName);

  console.log(
    JSON.stringify(
      {
        changedSemanticIcons: changedRegistryKeys.length,
        keptBrandExceptions: ['icon.brand.apple'],
        version: registry.version,
      },
      null,
      2,
    ),
  );
}

function updateRuntimeRegistry(iconsaxBySourceName) {
  const source = fs.readFileSync(runtimeRegistryPath, 'utf8');
  const match = source.match(/export const iconRegistry = \{\n([\s\S]*?)\n  \.\.\.iconsaxIconRegistry,/);
  if (!match) {
    throw new Error('Could not find semantic iconRegistry block.');
  }

  const semanticBlock = match[1];
  const entries = parseTopLevelObjectEntries(semanticBlock);
  const mappedKeys = new Set(Object.keys(semanticIconsaxMapping));
  const changedRuntimeKeys = [];

  const nextEntries = entries.map(({ key, value }) => {
    if (!mappedKeys.has(key)) {
      return { key, value };
    }

    const target = iconsaxBySourceName.get(semanticIconsaxMapping[key]);
    const nextValue = {
      ...value,
      license: runtimeLicense,
      localAssetPath,
      modified: false,
      registryScope: 'semantic',
      sourceCategory: target.source_category,
      sourceIconName: target.source_icon_name,
      sourceLibrary: 'iconsax',
    };
    changedRuntimeKeys.push(key);
    return { key, value: nextValue };
  });

  const nextSemanticBlock = nextEntries
    .map(({ key, value }) => `  ${JSON.stringify(key)}: ${JSON.stringify(value, null, 4).replace(/\n/g, '\n  ')},`)
    .join('\n');
  const nextSource = source.replace(semanticBlock, nextSemanticBlock);

  const missingRuntimeKeys = Array.from(mappedKeys).filter((key) => !changedRuntimeKeys.includes(key));
  if (missingRuntimeKeys.length > 0) {
    throw new Error(`Semantic mapping keys missing from runtime registry:\n${missingRuntimeKeys.join('\n')}`);
  }

  fs.writeFileSync(runtimeRegistryPath, nextSource);
}

function parseTopLevelObjectEntries(block) {
  const entries = [];
  let index = 0;

  while (index < block.length) {
    const keyStart = block.indexOf('"', index);
    if (keyStart === -1) {
      break;
    }

    const keyEnd = block.indexOf('":', keyStart + 1);
    if (keyEnd === -1) {
      break;
    }

    const key = block.slice(keyStart + 1, keyEnd);
    const objectStart = block.indexOf('{', keyEnd);
    if (objectStart === -1) {
      break;
    }

    const objectEnd = findMatchingBrace(block, objectStart);
    const objectSource = block.slice(objectStart, objectEnd + 1);
    entries.push({ key, value: JSON.parse(objectSource) });
    index = objectEnd + 1;
  }

  return entries;
}

function findMatchingBrace(source, startIndex) {
  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = startIndex; index < source.length; index += 1) {
    const char = source[index];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === '\\') {
        escaped = true;
      } else if (char === '"') {
        inString = false;
      }
      continue;
    }

    if (char === '"') {
      inString = true;
    } else if (char === '{') {
      depth += 1;
    } else if (char === '}') {
      depth -= 1;
      if (depth === 0) {
        return index;
      }
    }
  }

  throw new Error('Unbalanced runtime registry object.');
}

main();
