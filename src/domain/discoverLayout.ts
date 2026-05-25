import {
  discoverCampaignDefinitions,
  discoverEntryDefinitions,
  type DiscoverCampaignDefinition,
  type DiscoverEntryDefinition,
} from './discoverEntries';

export type DiscoverLayoutItemId = `entry:${DiscoverEntryDefinition['id']}` | `campaign:${DiscoverCampaignDefinition['id']}`;

export type DiscoverLayoutViewMode = 'largeCard' | 'smallCard' | 'largeList' | 'smallList';

export type DiscoverLayoutItem = {
  id: DiscoverLayoutItemId;
  viewMode: DiscoverLayoutViewMode;
};

export type DiscoverLayoutWidgetKind = 'entry' | 'campaign';

export type DiscoverLayoutWidget =
  | {
      definition: DiscoverEntryDefinition;
      id: DiscoverLayoutItemId;
      kind: 'entry';
    }
  | {
      definition: DiscoverCampaignDefinition;
      id: DiscoverLayoutItemId;
      kind: 'campaign';
    };

const defaultViewModeByItemId: Partial<Record<DiscoverLayoutItemId, DiscoverLayoutViewMode>> = {
  'campaign:paperChallenge': 'smallCard',
  'campaign:riskQuizCredit': 'largeCard',
  'entry:challenge': 'largeList',
  'entry:community': 'largeList',
  'entry:education': 'largeList',
  'entry:openAccount': 'largeList',
  'entry:partnerPortal': 'largeList',
  'entry:profile': 'largeList',
  'entry:rewards': 'largeList',
};

export const discoverLayoutWidgets: DiscoverLayoutWidget[] = [
  ...discoverEntryDefinitions.map((definition) => ({
    definition,
    id: `entry:${definition.id}` as DiscoverLayoutItemId,
    kind: 'entry' as const,
  })),
  ...discoverCampaignDefinitions.map((definition) => ({
    definition,
    id: `campaign:${definition.id}` as DiscoverLayoutItemId,
    kind: 'campaign' as const,
  })),
];

export const discoverLayoutItemIds = discoverLayoutWidgets.map((item) => item.id);
export const discoverLayoutViewModes: DiscoverLayoutViewMode[] = ['largeCard', 'smallCard', 'largeList', 'smallList'];

export const defaultDiscoverLayoutItems: DiscoverLayoutItem[] = [
  'entry:profile',
  'entry:partnerPortal',
  'campaign:riskQuizCredit',
  'campaign:paperChallenge',
  'entry:openAccount',
  'entry:education',
  'entry:challenge',
  'entry:rewards',
  'entry:community',
  'entry:support',
  'campaign:academySprint',
  'campaign:referCommission',
  'campaign:partnerBooster',
].map((id) => ({
  id: id as DiscoverLayoutItemId,
  viewMode: defaultViewModeByItemId[id as DiscoverLayoutItemId] ?? 'smallCard',
}));

const legacyIdMap: Record<string, DiscoverLayoutItemId> = {
  academy: 'entry:education',
  challenge: 'entry:challenge',
  functionCenter: 'entry:openAccount',
  marketBrief: 'campaign:paperChallenge',
  partnerPreview: 'entry:partnerPortal',
  profile: 'entry:profile',
  risk: 'campaign:riskQuizCredit',
  support: 'entry:support',
};

const legacyViewModeMap: Record<string, DiscoverLayoutViewMode> = {
  large: 'largeCard',
  list: 'largeList',
  medium: 'smallCard',
};

export function getDiscoverLayoutWidgetById(id: DiscoverLayoutItemId) {
  return discoverLayoutWidgets.find((item) => item.id === id);
}

function placePartnerPortalAfterProfile(items: DiscoverLayoutItem[]) {
  const profileIndex = items.findIndex((item) => item.id === 'entry:profile');
  const partnerIndex = items.findIndex((item) => item.id === 'entry:partnerPortal');

  if (profileIndex < 0 || partnerIndex < 0 || partnerIndex === profileIndex + 1) {
    return items;
  }

  const next = [...items];
  const [partnerPortal] = next.splice(partnerIndex, 1);
  const nextProfileIndex = next.findIndex((item) => item.id === 'entry:profile');
  next.splice(nextProfileIndex + 1, 0, partnerPortal);

  return next;
}

export function normalizeDiscoverLayoutItems(value: unknown): DiscoverLayoutItem[] {
  if (!Array.isArray(value)) {
    return defaultDiscoverLayoutItems;
  }

  const seen = new Set<DiscoverLayoutItemId>();
  const normalized: DiscoverLayoutItem[] = [];

  value.forEach((item) => {
    if (!item || typeof item !== 'object') {
      return;
    }

    const candidate = item as Partial<DiscoverLayoutItem>;
    const rawId = typeof candidate.id === 'string' ? candidate.id : '';
    const normalizedId = discoverLayoutItemIds.includes(rawId as DiscoverLayoutItemId)
      ? (rawId as DiscoverLayoutItemId)
      : legacyIdMap[rawId];

    if (!normalizedId || seen.has(normalizedId)) {
      return;
    }

    const rawViewMode = typeof candidate.viewMode === 'string' ? candidate.viewMode : '';
    const normalizedViewMode = discoverLayoutViewModes.includes(rawViewMode as DiscoverLayoutViewMode)
      ? (rawViewMode as DiscoverLayoutViewMode)
      : legacyViewModeMap[rawViewMode] ?? defaultViewModeByItemId[normalizedId] ?? 'largeList';

    normalized.push({
      id: normalizedId,
      viewMode: normalizedViewMode,
    });
    seen.add(normalizedId);
  });

  defaultDiscoverLayoutItems.forEach((item) => {
    if (!seen.has(item.id)) {
      normalized.push(item);
    }
  });

  return placePartnerPortalAfterProfile(normalized);
}
