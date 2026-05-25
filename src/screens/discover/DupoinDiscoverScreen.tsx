import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppIcon, type IconTone } from '@/src/components/AppIcon';
import { AppIconFrame } from '@/src/components/AppIconFrame';
import { Card } from '@/src/components/Card';
import { NativePressable } from '@/src/components/NativePressable';
import { Screen } from '@/src/components/Screen';
import { AppText } from '@/src/components/Typography';
import {
  getDiscoverLayoutWidgetById,
  type DiscoverLayoutItem,
  type DiscoverLayoutViewMode,
  type DiscoverLayoutWidget,
} from '@/src/domain/discoverLayout';
import type { DiscoverCampaignDefinition, DiscoverEntryDefinition } from '@/src/domain/discoverEntries';
import { localizeText } from '@/src/domain/format';
import { useToast } from '@/src/feedback/Toast';
import { impactLight } from '@/src/feedback/haptics';
import { useProductSettings } from '@/src/settings/ProductSettings';
import type { ThemeColors } from '@/src/theme/colors';
import { layout, lineWidth, radius, size, spacing } from '@/src/theme/tokens';

type DiscoverWidgetRenderItem = {
  item: DiscoverLayoutItem;
  widget: DiscoverLayoutWidget;
};

export default function DupoinDiscoverScreen() {
  const { colors, discoverLayoutItems, locale, role, t } = useProductSettings();
  const widgets = discoverLayoutItems
    .map((item) => {
      const widget = getDiscoverLayoutWidgetById(item.id);
      return widget ? { item, widget } : null;
    })
    .filter((item): item is DiscoverWidgetRenderItem => Boolean(item))
    .filter(({ widget }) => widget.definition.roles.includes(role) || widget.definition.roles.includes('guest'));

  return (
    <Screen title={t('tabs.discover')}>
      <View style={styles.widgetFlow}>
        {widgets.map(({ item, widget }) => (
          <View key={item.id} style={getWidgetSlotStyle(item.viewMode)}>
            <DiscoverWidgetCard mode={item.viewMode} widget={widget} />
          </View>
        ))}
      </View>
      <View style={styles.footerCopy}>
        <NativePressable
          accessibilityLabel={locale === 'en-US' ? 'Edit' : '编辑'}
          minTouch={44}
          onPress={() => {
            void impactLight();
            router.push('/discover-layout' as never);
          }}
          style={StyleSheet.flatten([styles.editTextButton, { backgroundColor: colors.surface.subtle }])}>
          <AppText tone="muted" variant="caption">
            {locale === 'en-US' ? 'Edit' : '编辑'}
          </AppText>
        </NativePressable>
      </View>
    </Screen>
  );
}

function DiscoverWidgetCard({ mode, widget }: { mode: DiscoverLayoutViewMode; widget: DiscoverLayoutWidget }) {
  const { locale, colors, setSelectedDiscoverModule, t } = useProductSettings();
  const toast = useToast();
  const isEntry = widget.kind === 'entry';
  const title = localizeText(widget.definition.title, locale);
  const subtitle = localizeText(widget.definition.subtitle, locale);
  const iconTone = widget.kind === 'entry' ? getDiscoverEntryIconTone(widget.definition) : getDiscoverCampaignIconTone(widget.definition);
  const isSmall = mode === 'smallCard' || mode === 'smallList';
  const isList = mode === 'largeList' || mode === 'smallList';
  const isLargeList = mode === 'largeList';
  const isLargeCard = mode === 'largeCard';

  const openWidget = () => {
    setSelectedDiscoverModule(widget.definition.moduleId);
    void impactLight();

    if (isEntry) {
      router.push(widget.definition.route as never);
      return;
    }

    toast.show({
      message: t('discover.campaigns.toastBody'),
      title,
    });
    router.push('/quick' as never);
  };

  if (isList) {
    return (
      <Card compact style={StyleSheet.flatten([styles.widgetSurface, isSmall ? styles.smallListSurface : styles.largeListSurface])}>
        <NativePressable
          accessibilityLabel={title}
          minTouch={isSmall ? 58 : 76}
          onPress={openWidget}
          style={StyleSheet.flatten([styles.listWidget, isSmall && styles.smallListWidget])}>
          <AppIconFrame
            iconSizeVariant="md"
            name={widget.definition.icon}
            sizeVariant="md"
            style={StyleSheet.flatten([styles.widgetIconFrame, { backgroundColor: getDiscoverIconBackgroundColor(colors, iconTone) }])}
            tone={iconTone}
          />
          <View style={styles.listCopy}>
            <AppText numberOfLines={isSmall ? 2 : 1} style={styles.widgetTitle} variant="subtitle">
              {title}
            </AppText>
            {isLargeList ? (
              <AppText numberOfLines={2} tone="muted" variant="caption">
                {subtitle}
              </AppText>
            ) : null}
          </View>
          <AppIcon name="icon.system.chevron_right" size={size.icon.md} />
        </NativePressable>
      </Card>
    );
  }

  return (
    <NativePressable
      accessibilityLabel={title}
      minTouch={isLargeCard ? 132 : 146}
      onPress={openWidget}
      style={StyleSheet.flatten([styles.cardWidget, isSmall && styles.smallCardWidget, { backgroundColor: colors.surface.panel }])}>
      <View style={styles.cardCopy}>
        {widget.kind === 'campaign' ? (
          <View style={StyleSheet.flatten([styles.campaignBadge, { backgroundColor: colors.overlay.brand.subtle }])}>
            <AppText numberOfLines={1} tone="brand" variant="caption">
              {localizeText(widget.definition.badge, locale)}
            </AppText>
          </View>
        ) : null}
        <AppText numberOfLines={isSmall ? 2 : 2} style={styles.widgetTitle} variant="subtitle">
          {title}
        </AppText>
        <AppText numberOfLines={isSmall ? 2 : 3} tone="muted" variant="caption">
          {subtitle}
        </AppText>
      </View>
      <View style={isSmall ? styles.smallCardIconSlot : styles.largeCardIconSlot}>
        <AppIconFrame
          iconSizeVariant={isSmall ? 'md' : 'lg'}
          name={widget.definition.icon}
          sizeVariant={isSmall ? 'md' : 'display'}
          style={StyleSheet.flatten([styles.widgetIconFrame, { backgroundColor: getDiscoverIconBackgroundColor(colors, iconTone) }])}
          tone={iconTone}
        />
      </View>
    </NativePressable>
  );
}

function getWidgetSlotStyle(mode: DiscoverLayoutViewMode) {
  return mode === 'largeCard' || mode === 'largeList' ? styles.fullWidgetSlot : styles.halfWidgetSlot;
}

function getDiscoverEntryIconTone(entry: DiscoverEntryDefinition): IconTone {
  const toneByEntryId: Record<DiscoverEntryDefinition['id'], IconTone> = {
    challenge: 'success',
    community: 'info',
    education: 'warning',
    openAccount: 'info',
    partnerPortal: 'brand',
    profile: 'brand',
    rewards: 'warning',
    support: 'info',
  };

  return toneByEntryId[entry.id];
}

function getDiscoverCampaignIconTone(campaign: DiscoverCampaignDefinition): IconTone {
  const toneByCampaignId: Record<DiscoverCampaignDefinition['id'], IconTone> = {
    academySprint: 'warning',
    paperChallenge: 'success',
    partnerBooster: 'brand',
    referCommission: 'warning',
    riskQuizCredit: 'info',
  };

  return toneByCampaignId[campaign.id];
}

function getDiscoverIconBackgroundColor(colors: ThemeColors, tone: IconTone) {
  switch (tone) {
    case 'brand':
      return colors.overlay.brand.subtle;
    case 'danger':
      return colors.overlay.danger.subtle;
    case 'info':
      return colors.overlay.info.subtle;
    case 'success':
      return colors.overlay.success.subtle;
    case 'up':
      return colors.overlay.up.subtle;
    case 'down':
      return colors.overlay.down.subtle;
    case 'warning':
      return colors.overlay.warning.subtle;
    default:
      return colors.iconBg.neutral;
  }
}

const styles = StyleSheet.create({
  cardCopy: {
    flex: 1,
    gap: spacing.sm,
    minWidth: 0,
  },
  cardWidget: {
    borderRadius: radius.md,
    borderWidth: lineWidth.none,
    flexDirection: 'row',
    gap: spacing.md,
    minHeight: 142,
    overflow: 'hidden',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  campaignBadge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: radius.full,
    maxWidth: 116,
    minHeight: 26,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  editTextButton: {
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: radius.full,
    justifyContent: 'center',
    minHeight: 36,
    minWidth: 72,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
  },
  footerCopy: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  fullWidgetSlot: {
    width: '100%',
  },
  halfWidgetSlot: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: '47%',
    minWidth: 0,
  },
  largeCardIconSlot: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  largeListSurface: {
    paddingVertical: 0,
  },
  listCopy: {
    flex: 1,
    gap: 4,
    minWidth: 0,
  },
  listWidget: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    minHeight: 76,
    paddingVertical: spacing.md,
  },
  smallCardIconSlot: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  smallCardWidget: {
    flexDirection: 'column',
    minHeight: 164,
  },
  smallListSurface: {
    paddingHorizontal: spacing.md,
    paddingVertical: 0,
  },
  smallListWidget: {
    minHeight: 58,
    paddingVertical: spacing.none,
  },
  widgetFlow: {
    columnGap: spacing.md,
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: spacing.md,
  },
  widgetIconFrame: {
    flexShrink: 0,
  },
  widgetSurface: {
    borderWidth: lineWidth.none,
  },
  widgetTitle: {
    minWidth: 0,
  },
});
