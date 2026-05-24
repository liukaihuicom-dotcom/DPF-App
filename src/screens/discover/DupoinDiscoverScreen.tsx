import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import { AppIcon, type AppIconName } from '@/src/components/AppIcon';
import { Card } from '@/src/components/Card';
import { NativePressable } from '@/src/components/NativePressable';
import { Screen } from '@/src/components/Screen';
import { StatusPill, type StatusPillTone } from '@/src/components/StatusPill';
import { AppText } from '@/src/components/Typography';
import {
  discoverCampaignDefinitions,
  discoverEntryDefinitions,
  discoverEntryGroups,
  type DiscoverCampaignDefinition,
  type DiscoverEntryDefinition,
  type DiscoverEntryStatus,
} from '@/src/domain/discoverEntries';
import { localizeText } from '@/src/domain/format';
import { useToast } from '@/src/feedback/Toast';
import { impactLight } from '@/src/feedback/haptics';
import { useProductSettings } from '@/src/settings/ProductSettings';
import { lineWidth, radius, size, spacing } from '@/src/theme/tokens';

export default function DupoinDiscoverScreen() {
  const { locale, colors, role, t } = useProductSettings();
  const visibleEntries = discoverEntryDefinitions.filter((entry) => entry.roles.includes(role) || entry.roles.includes('guest'));
  const visibleCampaigns = discoverCampaignDefinitions.filter((campaign) => campaign.roles.includes(role) || campaign.roles.includes('guest')).slice(0, 5);

  return (
    <Screen title={t('tabs.discover')}>
      {discoverEntryGroups.map((group) => {
        const entries = visibleEntries.filter((entry) => entry.group === group.id);
        if (!entries.length) {
          return null;
        }

        return (
          <View key={group.id} style={styles.entryGroup}>
            <View style={styles.groupHeader}>
              <AppText variant="subtitle">{localizeText(group.title, locale)}</AppText>
              <AppText tone="dim" variant="caption">
                {entries.length}
              </AppText>
            </View>
            <Card compact style={styles.entryList}>
              {entries.map((entry, index) => (
                <DiscoverEntryRow entry={entry} key={entry.id} showDivider={index < entries.length - 1} />
              ))}
            </Card>
            {group.id === 'profile' && visibleCampaigns.length ? <LatestCampaigns campaigns={visibleCampaigns} /> : null}
          </View>
        );
      })}
      <AppText tone="dim" variant="caption">
        {locale === 'en-US'
          ? 'Demo and placeholder entries are local product previews. Live trading, funding, KYC, support, and rewards services are not connected.'
          : '演示和占位入口仅用于本地产品预览，真实交易、资金、KYC、客服和奖励服务尚未接入。'}
      </AppText>
    </Screen>
  );
}

function LatestCampaigns({ campaigns }: { campaigns: DiscoverCampaignDefinition[] }) {
  const { locale, colors, setSelectedDiscoverModule, t } = useProductSettings();
  const toast = useToast();

  return (
    <View style={styles.campaignSection}>
      <View style={styles.groupHeader}>
        <AppText variant="subtitle">{t('discover.campaigns.title')}</AppText>
        <AppText tone="dim" variant="caption">
          {t('discover.campaigns.count', { count: campaigns.length })}
        </AppText>
      </View>
      <ScrollView contentContainerStyle={styles.campaignRail} horizontal showsHorizontalScrollIndicator={false}>
        {campaigns.map((campaign) => (
          <NativePressable
            accessibilityHint={t('discover.campaigns.accessibilityHint')}
            accessibilityLabel={localizeText(campaign.title, locale)}
            key={campaign.id}
            minTouch={118}
            onPress={() => {
              setSelectedDiscoverModule(campaign.moduleId);
              void impactLight();
              toast.show({
                message: t('discover.campaigns.toastBody'),
                title: localizeText(campaign.title, locale),
              });
              router.push('/quick' as never);
            }}
            style={StyleSheet.flatten([styles.campaignCard, { backgroundColor: colors.surface.subtle, borderColor: colors.border.subtle }])}>
            <View style={styles.campaignCopy}>
              <View style={StyleSheet.flatten([styles.campaignBadge, { backgroundColor: `${colors.brand.fg}12`, borderColor: `${colors.brand.fg}55` }])}>
                <AppText numberOfLines={1} tone="brand" variant="caption">
                  {localizeText(campaign.badge, locale)}
                </AppText>
              </View>
              <AppText numberOfLines={2} variant="subtitle">
                {localizeText(campaign.title, locale)}
              </AppText>
              <AppText numberOfLines={2} tone="muted" variant="caption">
                {localizeText(campaign.subtitle, locale)}
              </AppText>
            </View>
            <View style={StyleSheet.flatten([styles.campaignIcon, { backgroundColor: `${colors.brand.fg}16` }])}>
              <AppIcon name={campaign.icon} size={size.icon.lg} />
            </View>
          </NativePressable>
        ))}
      </ScrollView>
    </View>
  );
}

function DiscoverEntryRow({ entry, showDivider }: { entry: DiscoverEntryDefinition; showDivider: boolean }) {
  const { locale, colors, setSelectedDiscoverModule } = useProductSettings();

  return (
    <NativePressable
      accessibilityLabel={localizeText(entry.title, locale)}
      minTouch={68}
      onPress={() => {
        setSelectedDiscoverModule(entry.moduleId);
        void impactLight();
        router.push('/quick' as never);
      }}
      style={StyleSheet.flatten([styles.entryRow, showDivider && { borderBottomColor: colors.border.subtle, borderBottomWidth: lineWidth.hairline }])}>
      <View style={StyleSheet.flatten([styles.entryIcon, { backgroundColor: `${colors.brand.fg}12` }])}>
        <AppIcon name={entry.icon} size={18} />
      </View>
      <View style={styles.entryCopy}>
        <View style={styles.entryTitleRow}>
          <AppText numberOfLines={1} style={styles.entryTitle} variant="subtitle">
            {localizeText(entry.title, locale)}
          </AppText>
          <EntryStatusPill status={entry.status} />
        </View>
        <AppText numberOfLines={2} tone="muted" variant="caption">
          {localizeText(entry.subtitle, locale)}
        </AppText>
      </View>
      <AppIcon name="icon.system.chevron_right" size={16} />
    </NativePressable>
  );
}

function EntryStatusPill({ status }: { status: DiscoverEntryStatus }) {
  const { locale } = useProductSettings();
  const labelByStatus: Record<DiscoverEntryStatus, { label: string; tone: StatusPillTone }> = {
    demo: { label: locale !== 'zh-CN' ? 'Demo' : '演示', tone: 'neutral' },
    placeholder: { label: locale !== 'zh-CN' ? 'Preview' : '预览', tone: 'warning' },
    ready: { label: locale !== 'zh-CN' ? 'Ready' : '可用', tone: 'brand' },
  };
  const statusConfig = labelByStatus[status];

  return <StatusPill compact label={statusConfig.label} tone={statusConfig.tone} />;
}

const styles = StyleSheet.create({
  entryCopy: {
    flex: 1,
    gap: 4,
    minWidth: 0,
  },
  entryGroup: {
    gap: spacing.sm,
  },
  entryIcon: {
    alignItems: 'center',
    borderRadius: radius.full,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  entryList: {
    gap: 0,
    paddingVertical: 0,
  },
  entryRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    minHeight: 76,
    paddingVertical: spacing.md,
  },
  entryTitle: {
    flex: 1,
    minWidth: 0,
  },
  entryTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
    minWidth: 0,
  },
  groupHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xs,
  },
  campaignBadge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: radius.full,
    borderWidth: lineWidth.hairline,
    maxWidth: 112,
    minHeight: 26,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  campaignCard: {
    borderRadius: radius.md,
    borderWidth: lineWidth.none,
    flexDirection: 'row',
    gap: spacing.md,
    minHeight: 142,
    overflow: 'hidden',
    padding: spacing.md,
    width: 282,
  },
  campaignCopy: {
    flex: 1,
    gap: spacing.sm,
    justifyContent: 'center',
    minWidth: 0,
  },
  campaignIcon: {
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: radius.full,
    height: 64,
    justifyContent: 'center',
    width: 64,
  },
  campaignRail: {
    gap: spacing.sm,
    paddingHorizontal: spacing.xs,
    paddingRight: spacing.lg,
  },
  campaignSection: {
    gap: spacing.sm,
  },
});
