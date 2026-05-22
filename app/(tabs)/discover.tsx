import { Link, router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ActionButton } from '@/src/components/ActionButton';
import { AppIcon, type AppIconName } from '@/src/components/AppIcon';
import { Card } from '@/src/components/Card';
import { NativePressable } from '@/src/components/NativePressable';
import { Screen } from '@/src/components/Screen';
import { StatusPill } from '@/src/components/StatusPill';
import { AppText } from '@/src/components/Typography';
import { discoverLayoutDefinitions, type DiscoverLayoutDefinition, type DiscoverLayoutItem } from '@/src/domain/discoverLayout';
import { dupoinInsights, dupoinQuickActions } from '@/src/domain/dupoinMvp';
import { formatPercent, localizeText } from '@/src/domain/format';
import { partnerMetrics } from '@/src/domain/mockData';
import type { DiscoverModuleId } from '@/src/domain/types';
import { impactLight } from '@/src/feedback/haptics';
import { useProductSettings } from '@/src/settings/ProductSettings';
import { radius, spacing } from '@/src/theme/tokens';

type DiscoverLayoutRenderItem = DiscoverLayoutItem & {
  definition: DiscoverLayoutDefinition;
};

export default function DupoinDiscoverScreen() {
  const { discoverLayoutItems, locale, palette, setSelectedDiscoverModule, t } = useProductSettings();
  const openModule = (moduleId: DiscoverModuleId) => {
    setSelectedDiscoverModule(moduleId);
    void impactLight();
    router.replace('/quick' as never);
  };
  const renderItems = discoverLayoutItems
    .map((item) => ({
      ...item,
      definition: discoverLayoutDefinitions.find((definition) => definition.id === item.id),
    }))
    .filter((item): item is DiscoverLayoutRenderItem => Boolean(item.definition));

  return (
    <Screen title={t('tabs.discover')}>
      <View style={styles.layoutFlow}>
        {renderItems.map((item) => (
          <DiscoverLayoutBlock item={item} key={item.id} onOpenModule={openModule} />
        ))}
      </View>

      <Link asChild href="/discover-layout">
        <NativePressable
          accessibilityLabel={locale === 'en-US' ? 'Layout settings' : '布局设置'}
          minTouch={44}
          style={styles.layoutSettingsLink}>
          <AppIcon color={palette.brand} name="settingsSliders" size={16} />
          <AppText tone="brand" variant="caption">
            {locale === 'en-US' ? 'Layout settings' : '布局设置'}
          </AppText>
        </NativePressable>
      </Link>
    </Screen>
  );
}

function DiscoverLayoutBlock({
  item,
  onOpenModule,
}: {
  item: DiscoverLayoutRenderItem;
  onOpenModule: (moduleId: DiscoverModuleId) => void;
}) {
  if (item.viewMode === 'list') {
    return <DiscoverListCard item={item} onOpenModule={onOpenModule} />;
  }

  if (item.viewMode === 'medium') {
    return <DiscoverMediumCard item={item} onOpenModule={onOpenModule} />;
  }

  return <DiscoverLargeCard item={item} onOpenModule={onOpenModule} />;
}

function DiscoverLargeCard({
  item,
  onOpenModule,
}: {
  item: DiscoverLayoutRenderItem;
  onOpenModule: (moduleId: DiscoverModuleId) => void;
}) {
  const { locale, palette, t } = useProductSettings();
  const title = localizeText(item.definition.title, locale);
  const body = localizeText(item.definition.body, locale);
  const press = () => {
    if (item.definition.moduleId) {
      onOpenModule(item.definition.moduleId);
    }
  };

  if (item.id === 'profile') {
    return (
      <NativePressable
        accessibilityLabel={title}
        minTouch={96}
        onPress={press}
        style={StyleSheet.flatten([styles.profileEntryCard, { backgroundColor: palette.panelHigh, borderColor: palette.line }])}>
        <View style={StyleSheet.flatten([styles.profileEntryIcon, { backgroundColor: `${palette.brand}12`, borderColor: `${palette.brand}55` }])}>
          <AppIcon color={palette.brand} name={item.definition.icon} size={22} />
        </View>
        <View style={styles.profileEntryBody}>
          <View style={styles.profileEntryTitleRow}>
            <AppText variant="subtitle">{title}</AppText>
            <StatusPill compact label={t('discover.module.profile.short')} tone="brand" />
          </View>
          <AppText numberOfLines={2} tone="muted" variant="caption">
            {body}
          </AppText>
        </View>
        <View style={StyleSheet.flatten([styles.profileEntryArrow, { backgroundColor: palette.panelSoft }])}>
          <AppIcon color={palette.textMuted} name="navigateNext" size={15} />
        </View>
      </NativePressable>
    );
  }

  if (item.id === 'functionCenter') {
    return (
      <Card style={styles.fullWidthCard}>
        <DiscoverCardHeader body={body} icon={item.definition.icon} title={title} />
        <View style={styles.quickGrid}>
          {dupoinQuickActions.map((action) => (
            <NativePressable
              accessibilityLabel={localizeText(action.title, locale)}
              accessibilityRole="button"
              key={action.id}
              minTouch={76}
              onPress={() => router.push(action.route as never)}
              style={StyleSheet.flatten([styles.quickAction, { backgroundColor: palette.panelSoft, borderColor: palette.lineSoft }])}>
              <View style={StyleSheet.flatten([styles.quickIcon, { backgroundColor: `${palette.brand}12` }])}>
                <AppIcon color={palette.brand} name={action.icon} size={18} />
              </View>
              <View style={styles.quickText}>
                <AppText numberOfLines={1} variant="subtitle">
                  {localizeText(action.title, locale)}
                </AppText>
                <AppText numberOfLines={1} tone="muted" variant="caption">
                  {localizeText(action.subtitle, locale)}
                </AppText>
              </View>
            </NativePressable>
          ))}
        </View>
      </Card>
    );
  }

  if (item.id === 'partnerPreview') {
    return (
      <Card style={styles.fullWidthCard}>
        <View style={styles.sectionHeader}>
          <DiscoverCardHeader body={body} icon={item.definition.icon} title={title} />
          <ActionButton label={t('tabs.partner')} onPress={press} style={styles.partnerButton} tone="neutral" />
        </View>
        <View style={styles.partnerStats}>
          <PartnerStat label={t('partner.monthClients')} value={String(partnerMetrics.clients)} />
          <PartnerStat label={t('partner.activeClients')} value={String(partnerMetrics.activeClients)} />
          <PartnerStat label={locale === 'en-US' ? 'Conversion' : '转化率'} value={formatPercent(partnerMetrics.conversionRate)} />
        </View>
      </Card>
    );
  }

  if (item.id === 'marketBrief') {
    return (
      <Card style={styles.fullWidthCard}>
        <DiscoverCardHeader body={body} icon={item.definition.icon} title={title} />
        <View style={styles.newsList}>
          {dupoinInsights.map((insight) => (
            <View key={insight.id} style={StyleSheet.flatten([styles.newsRow, { borderTopColor: palette.lineSoft }])}>
              <View style={styles.newsText}>
                <AppText tone="brand" variant="eyebrow">
                  {localizeText(insight.category, locale)}
                </AppText>
                <AppText variant="subtitle">{localizeText(insight.title, locale)}</AppText>
                <AppText tone="muted" variant="caption">
                  {localizeText(insight.body, locale)}
                </AppText>
              </View>
              <AppText tone="dim" variant="caption">
                {localizeText(insight.time, locale)}
              </AppText>
            </View>
          ))}
        </View>
      </Card>
    );
  }

  return (
    <Card style={styles.fullWidthCard}>
      <DiscoverCardHeader body={body} icon={item.definition.icon} title={title} />
      {item.definition.moduleId ? (
        <ActionButton label={locale === 'en-US' ? 'Open' : '打开'} onPress={press} style={styles.largeOpenButton} tone="neutral" />
      ) : null}
    </Card>
  );
}

function DiscoverMediumCard({
  item,
  onOpenModule,
}: {
  item: DiscoverLayoutRenderItem;
  onOpenModule: (moduleId: DiscoverModuleId) => void;
}) {
  const { locale, palette } = useProductSettings();
  const title = localizeText(item.definition.title, locale);
  const body = localizeText(item.definition.body, locale);

  return (
    <NativePressable
      accessibilityLabel={title}
      minTouch={124}
      onPress={() => item.definition.moduleId && onOpenModule(item.definition.moduleId)}
      style={StyleSheet.flatten([styles.mediumCard, { backgroundColor: palette.panel, borderColor: palette.lineSoft }])}>
      <View style={StyleSheet.flatten([styles.moduleIcon, { backgroundColor: `${palette.brand}12` }])}>
        <AppIcon color={palette.brand} name={item.definition.icon} size={18} />
      </View>
      <AppText numberOfLines={1} variant="subtitle">
        {title}
      </AppText>
      <AppText numberOfLines={3} tone="muted" variant="caption">
        {body}
      </AppText>
    </NativePressable>
  );
}

function DiscoverListCard({
  item,
  onOpenModule,
}: {
  item: DiscoverLayoutRenderItem;
  onOpenModule: (moduleId: DiscoverModuleId) => void;
}) {
  const { locale, palette } = useProductSettings();
  const title = localizeText(item.definition.title, locale);
  const body = localizeText(item.definition.body, locale);

  return (
    <NativePressable
      accessibilityLabel={title}
      minTouch={64}
      onPress={() => item.definition.moduleId && onOpenModule(item.definition.moduleId)}
      style={StyleSheet.flatten([styles.listCard, { backgroundColor: palette.panel, borderColor: palette.lineSoft }])}>
      <View style={StyleSheet.flatten([styles.listIcon, { backgroundColor: `${palette.brand}12` }])}>
        <AppIcon color={palette.brand} name={item.definition.icon} size={18} />
      </View>
      <View style={styles.listText}>
        <AppText numberOfLines={1} variant="subtitle">
          {title}
        </AppText>
        <AppText numberOfLines={1} tone="muted" variant="caption">
          {body}
        </AppText>
      </View>
      <AppIcon color={palette.textDim} name="navigateNext" size={16} />
    </NativePressable>
  );
}

function DiscoverCardHeader({ body, icon, title }: { body: string; icon: AppIconName; title: string }) {
  const { palette } = useProductSettings();

  return (
    <View style={styles.headerWithIcon}>
      <View style={StyleSheet.flatten([styles.headerIcon, { backgroundColor: `${palette.brand}12` }])}>
        <AppIcon color={palette.brand} name={icon} size={18} />
      </View>
      <View style={styles.headerCopy}>
        <AppText variant="subtitle">{title}</AppText>
        <AppText numberOfLines={2} tone="muted" variant="caption">
          {body}
        </AppText>
      </View>
    </View>
  );
}

function PartnerStat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.partnerStat}>
      <AppText adjustsFontSizeToFit numberOfLines={1} variant="number">
        {value}
      </AppText>
      <AppText numberOfLines={1} tone="muted" variant="caption">
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  headerCopy: {
    flex: 1,
    gap: 3,
    minWidth: 0,
  },
  fullWidthCard: {
    width: '100%',
  },
  headerIcon: {
    alignItems: 'center',
    borderRadius: radius.full,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  headerWithIcon: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.md,
  },
  largeOpenButton: {
    marginTop: spacing.lg,
    minHeight: 38,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  layoutFlow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
  },
  layoutSettingsLink: {
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  listCard: {
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    width: '100%',
  },
  listIcon: {
    alignItems: 'center',
    borderRadius: radius.full,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  listText: {
    flex: 1,
    minWidth: 0,
  },
  mediumCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: 7,
    minHeight: 142,
    padding: 13,
    width: '48.6%',
  },
  moduleIcon: {
    alignItems: 'center',
    borderRadius: radius.full,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  newsList: {
    gap: 2,
    marginTop: spacing.lg,
  },
  newsRow: {
    alignItems: 'flex-start',
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    paddingTop: spacing.md,
  },
  newsText: {
    flex: 1,
    gap: 3,
    minWidth: 0,
  },
  partnerButton: {
    minHeight: 36,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  partnerStat: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  partnerStats: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  profileEntryArrow: {
    alignItems: 'center',
    borderRadius: radius.full,
    height: 30,
    justifyContent: 'center',
    width: 30,
  },
  profileEntryBody: {
    flex: 1,
    gap: 4,
    minWidth: 0,
  },
  profileEntryCard: {
    alignItems: 'center',
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    padding: 14,
    width: '100%',
  },
  profileEntryIcon: {
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    height: 46,
    justifyContent: 'center',
    width: 46,
  },
  profileEntryTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },
  quickAction: {
    alignItems: 'center',
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    minHeight: 72,
    padding: spacing.md,
    width: '48.6%',
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
    marginTop: spacing.lg,
  },
  quickIcon: {
    alignItems: 'center',
    borderRadius: radius.full,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  quickText: {
    flex: 1,
    minWidth: 0,
  },
  sectionHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
});
