import { router } from 'expo-router';
import { StyleSheet, View, useWindowDimensions } from 'react-native';

import { ActionButton } from '@/src/components/ActionButton';
import { AppIcon, type AppIconName, type IconTone } from '@/src/components/AppIcon';
import { AppIconFrame, type AppIconFrameBackgroundTone } from '@/src/components/AppIconFrame';
import { Card } from '@/src/components/Card';
import { DonutChart } from '@/src/components/data-display';
import { Metric } from '@/src/components/Metric';
import { NativePressable } from '@/src/components/NativePressable';
import { ProfileAvatar, type ProfileAvatarId } from '@/src/components/ProfileAvatar';
import { ReferralNetworkIllustration } from '@/src/components/ReferralNetworkIllustration';
import { Screen } from '@/src/components/Screen';
import { StatusPill, type StatusPillTone } from '@/src/components/StatusPill';
import { AppText } from '@/src/components/Typography';
import { formatMoney, formatNumber, formatVolumeMillions, localizeText, statusLabel } from '@/src/domain/format';
import { initialAccount, partnerMetrics } from '@/src/domain/mockData';
import type { DiscoverModuleId, PartnerClient } from '@/src/domain/types';
import { impactLight } from '@/src/feedback/haptics';
import { useProductSettings } from '@/src/settings/ProductSettings';
import { useBroker } from '@/src/state/BrokerStore';
import { lineWidth, radius, size, spacing } from '@/src/theme/tokens';

const clientAvatarIds: ProfileAvatarId[] = ['frank', 'mika', 'sophia', 'alex'];

export default function PartnerToolsScreen() {
  const { partnerClients } = useBroker();
  const {
    colors,
    locale,
    profileAvatarId,
    profileNickname,
    role,
    selectedDiscoverModuleId,
    setSelectedDiscoverModule,
    t,
  } = useProductSettings();
  const totalDeposits = initialAccount.transactions
    .filter((transaction) => transaction.type === 'deposit')
    .reduce((total, transaction) => total + Math.abs(transaction.amount), 0);
  const totalWithdrawals = initialAccount.transactions
    .filter((transaction) => transaction.type === 'withdrawal')
    .reduce((total, transaction) => total + Math.abs(transaction.amount), 0);
  const verifiedClients = partnerClients.filter((client) => client.status === 'active' || client.status === 'funded').length;
  const totalVolume = partnerClients.reduce((total, client) => total + client.monthlyVolume, 0);
  const totalEquity = partnerClients.reduce((total, client) => total + client.netDeposit, 0);
  const totalBalance = totalEquity + partnerMetrics.settledCommission + partnerMetrics.pendingCommission;
  const visibleClients = partnerClients.slice(0, 4);
  const referralDistribution = buildReferralDistribution(partnerMetrics.clients, partnerClients, colors);
  const selectedModuleLabel = t(`discover.module.${selectedDiscoverModuleId}.short`);
  const { width } = useWindowDimensions();
  const compactHero = width < 380;
  const features: PartnerFeatureTile[] = [
    {
      body: t('partner.home.feature.commission.body'),
      icon: 'icon.wallet.withdrawal',
      id: 'accounts',
      route: '/partner/commission',
      title: t('partner.home.feature.commission.title'),
      tone: 'blue',
    },
    {
      body: t('partner.home.feature.activity.body'),
      icon: 'icon.trading.order',
      id: 'markets',
      route: '/partner/clients',
      title: t('partner.home.feature.activity.title'),
      tone: 'brand',
    },
    {
      body: t('partner.home.feature.links.body'),
      icon: 'icon.ib.network',
      id: 'partner',
      title: t('partner.home.feature.links.title'),
      tone: 'blue',
    },
  ];

  const selectModule = (moduleId: DiscoverModuleId) => {
    setSelectedDiscoverModule(moduleId);
    void impactLight();
    router.push('/quick' as never);
  };

  return (
    <Screen
      rightActions={[
        { icon: 'icon.notification.email', label: t('top.notifications') },
        { icon: 'icon.system.search', label: t('top.search') },
      ]}
      subtitle={profileNickname || t('partner.home.defaultPartnerName')}
      title={t('partner.home.title')}>
      <Card
        highlight
        style={StyleSheet.flatten([
          styles.referralHero,
          compactHero && styles.referralHeroCompact,
          {
            backgroundColor: colors.surface.panel,
            borderColor: colors.border.subtle,
          },
        ])}>
        <View style={StyleSheet.flatten([styles.heroRibbon, { backgroundColor: colors.overlay.info.subtle }])} />
        <View style={StyleSheet.flatten([styles.heroRibbonAlt, { backgroundColor: colors.overlay.brand.subtle }])} />

        <View style={StyleSheet.flatten([styles.referralHeroContent, compactHero && styles.referralHeroContentCompact])}>
          <View style={styles.heroCopy}>
            <AppText style={styles.heroTitle} variant="title.section">
              {t('partner.home.refer.title')}
            </AppText>
            <AppText style={styles.heroBody} tone="muted" variant="body.secondary">
              {t('partner.home.refer.body')}
            </AppText>
            <ActionButton
              icon="icon.ib.network"
              label={t('partner.home.invite')}
              onPress={() => selectModule('partner')}
              style={styles.inviteButton}
              tone="brand"
              variant="filled"
            />
          </View>

          <ReferralNetworkIllustration />
        </View>
      </Card>

      <View style={styles.featureGrid}>
        {features.map((feature) => (
          <FeatureTile
            feature={feature}
            key={feature.id}
            onPress={() => {
              if (feature.route) {
                void impactLight();
                router.push(feature.route as never);
                return;
              }

              selectModule(feature.id);
            }}
            selected={selectedDiscoverModuleId === feature.id}
          />
        ))}
      </View>

      <Card compact>
        <View style={styles.walletHeader}>
          <View style={styles.iconMetricLead}>
            <AppIconFrame backgroundTone="down" name="icon.wallet.balance" sizeVariant="lg" />
            <View style={styles.flexCopy}>
              <View style={styles.balanceRow}>
                <AppText adjustsFontSizeToFit numberOfLines={1} variant="title">
                  {formatMoney(initialAccount.equity, initialAccount.currency, 2, locale)}
                </AppText>
                <AppText numberOfLines={1} tone="down" variant="caption">
                  +{formatMoney(partnerMetrics.pendingCommission, 'USD', 2, locale)}
                </AppText>
              </View>
              <AppText numberOfLines={1} tone="muted" variant="caption">
                {t('partner.home.walletBalance')} {initialAccount.currency}
              </AppText>
            </View>
          </View>
          <AppIcon name="icon.system.chevron_right" size={size.icon.md} />
        </View>
        <View style={styles.walletActions}>
          <ActionButton
            icon="icon.wallet.withdrawal"
            label={t('funding.action.withdrawal')}
            onPress={() => router.push('/funding/withdrawal' as never)}
            style={styles.walletAction}
            tone="neutral"
          />
          <ActionButton
            icon="icon.wallet.transfer"
            label={t('funding.action.transfer')}
            onPress={() => router.push('/funding/transfer' as never)}
            style={styles.walletAction}
            tone="neutral"
          />
        </View>
      </Card>

      <View style={styles.sectionTitle}>
        <AppText variant="title.section">{t('partner.home.performance')}</AppText>
        <StatusPill compact icon="icon.trading.history" label={t('partner.home.today')} tone="neutral" />
      </View>

      <Card compact>
        <View style={styles.performanceStack}>
          <AppIconFrame backgroundTone="warning" name="icon.wallet.deposit" sizeVariant="lg" />
          <Metric label={t('accountDetails.deposit')} value={formatMoney(totalDeposits, 'USD', 2, locale)} />
          <Metric label={t('accountDetails.withdrawal')} value={formatMoney(totalWithdrawals, 'USD', 2, locale)} />
        </View>
      </Card>

      <View style={styles.metricCards}>
        <SmallMetricCard
          caption={t('partner.home.verified', { count: verifiedClients })}
          icon="icon.account.add_user"
          label={t('partner.home.signups')}
          tone="blue"
          value={formatNumber(partnerMetrics.clients, 0, locale)}
        />
        <SmallMetricCard
          icon="icon.trading.volume"
          label={t('partner.home.volume')}
          tone="up"
          value={formatVolumeMillions(totalVolume, locale)}
        />
      </View>

      <Card compact>
        <View style={styles.distributionCard}>
          <View style={styles.distributionHeader}>
            <AppIconFrame backgroundTone="down" name="icon.promotion.reward" sizeVariant="lg" />
            <View style={styles.flexCopy}>
              <AppText variant="subtitle">{t('partner.home.distribution.title')}</AppText>
              <AppText tone="muted" variant="caption">
                {t('partner.home.distribution.body')}
              </AppText>
            </View>
          </View>
          <ReferralDistributionVisual data={referralDistribution} />
          <ActionButton
            label={t('partner.home.analytics')}
            onPress={() => selectModule('partner')}
            style={styles.fullWidthButton}
            tone="neutral"
          />
        </View>
      </Card>

      <View style={styles.sectionTitle}>
        <AppText variant="title.section">{t('partner.home.network', { count: partnerMetrics.clients })}</AppText>
        <NativePressable accessibilityRole="button" minTouch={44} onPress={() => router.push('/partner/clients' as never)} style={styles.linkButton}>
          <AppText tone="link" variant="caption">
            {t('partner.home.viewAll')}
          </AppText>
        </NativePressable>
      </View>

      <Card compact>
        <View style={styles.networkSummary}>
          <Metric label={t('partner.home.totalEquity')} value={formatCompactPartnerMoney(totalEquity, locale)} />
          <Metric label={t('partner.home.totalBalance')} value={formatCompactPartnerMoney(totalBalance, locale)} />
        </View>
      </Card>

      {visibleClients.map((client, index) => (
        <PartnerClientCard
          client={client}
          key={client.id}
          avatarId={index === 0 ? profileAvatarId : clientAvatarIds[index % clientAvatarIds.length]}
          compact={index === 1}
        />
      ))}

      <NativePressable
        accessibilityRole="button"
        minTouch={48}
        onPress={() => router.push('/partner/clients' as never)}
        style={StyleSheet.flatten([styles.viewAllReferrals, { backgroundColor: colors.surface.panel }])}>
        <AppText tone="link" variant="subtitle">
          {t('partner.home.viewAllReferrals')}
        </AppText>
      </NativePressable>

      <AppText tone="dim" variant="caption">
        {role === 'partner' ? t('partner.complianceHint') : `${t('role.partner')} · ${selectedModuleLabel} · ${t('partner.complianceHint')}`}
      </AppText>
    </Screen>
  );
}

type PartnerFeatureTile = {
  body: string;
  icon: AppIconName;
  id: DiscoverModuleId;
  route?: '/partner/clients' | '/partner/commission';
  title: string;
  tone: IconTone;
};

function FeatureTile({ feature, onPress, selected }: { feature: PartnerFeatureTile; onPress: () => void; selected: boolean }) {
  const { colors } = useProductSettings();

  return (
    <NativePressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      minTouch={96}
      onPress={onPress}
      style={StyleSheet.flatten([
        styles.featureTile,
        {
          backgroundColor: colors.surface.panel,
          borderColor: selected ? colors.brand.fg : colors.border.subtle,
        },
      ])}>
      <AppIcon name={feature.icon} sizeVariant="lg" tone={feature.tone === 'blue' ? 'info' : feature.tone} />
      <View style={styles.flexCopy}>
        <AppText numberOfLines={1} variant="subtitle">
          {feature.title}
        </AppText>
        <AppText numberOfLines={3} tone="muted" variant="caption">
          {feature.body}
        </AppText>
      </View>
    </NativePressable>
  );
}

function SmallMetricCard({
  caption,
  icon,
  label,
  tone,
  value,
}: {
  caption?: string;
  icon: AppIconName;
  label: string;
  tone: IconTone;
  value: string;
}) {
  return (
    <Card compact style={styles.smallMetricCard}>
      <AppIconFrame backgroundTone={mapIconToneToBackgroundTone(tone)} name={icon} sizeVariant="lg" />
      <Metric caption={caption} label={label} tone={tone === 'up' ? 'up' : tone === 'blue' ? 'blue' : 'default'} value={value} />
    </Card>
  );
}

type ReferralDistributionItem = {
  color: string;
  count: number;
  label: string;
};

function ReferralDistributionVisual({ data }: { data: ReferralDistributionItem[] }) {
  const { colors, locale } = useProductSettings();
  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <View style={styles.distributionVisual}>
      <View style={styles.donutWrap}>
        <DonutChart
          label={locale === 'zh-CN' ? '客户' : 'Clients'}
          segments={data.map((item) => ({ color: item.color, value: item.count }))}
          value={formatNumber(total, 0, locale)}
        />
      </View>
      <View style={styles.distributionLegend}>
        {data.map((item) => {
          const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;

          return (
            <View key={item.label} style={styles.legendRow}>
              <View style={styles.legendLabel}>
                <View style={StyleSheet.flatten([styles.legendDot, { backgroundColor: item.color }])} />
                <AppText numberOfLines={1} variant="caption">
                  {item.label}
                </AppText>
              </View>
              <AppText numberOfLines={1} tone="muted" variant="caption">
                {formatNumber(item.count, 0, locale)} ({percentage}%)
              </AppText>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function PartnerClientCard({ avatarId, client, compact }: { avatarId: ProfileAvatarId; client: PartnerClient; compact?: boolean }) {
  const { colors, locale, t } = useProductSettings();
  const roleTone: StatusPillTone = client.role === 'partner' ? 'info' : 'success';
  const depthTone: StatusPillTone = client.role === 'partner' ? 'danger' : 'brand';
  const statusTone: StatusPillTone = client.status === 'active' ? 'success' : client.status === 'funded' ? 'warning' : 'neutral';

  return (
    <NativePressable
      accessibilityLabel={client.name}
      accessibilityRole="button"
      minTouch={compact ? 82 : 148}
      onPress={() => router.push(`/client/${client.id}`)}
      style={StyleSheet.flatten([styles.clientCard, { backgroundColor: colors.surface.panel }])}>
      <View style={styles.clientTop}>
        <ProfileAvatar id={avatarId} size={44} />
        <View style={styles.clientMain}>
          <View style={styles.clientTitleRow}>
            <AppText numberOfLines={1} variant="subtitle">
              {compact ? maskName(client.name) : client.name}
            </AppText>
            {!compact ? (
              <AppText tone="dim" variant="caption">
                {client.role === 'partner' ? t('partner.home.owner') : statusLabel(client.status, locale)}
              </AppText>
            ) : null}
          </View>
          <View style={styles.pillRow}>
            {!compact ? <StatusPill compact icon="icon.ib.network" label={t(`role.${client.role}`)} tone={roleTone} /> : null}
            <StatusPill
              compact
              icon={compact ? 'icon.trading.history' : 'icon.ib.network'}
              label={compact ? statusLabel(client.status, locale) : t('partner.home.depth', { depth: client.role === 'partner' ? 2 : 1 })}
              tone={compact ? statusTone : depthTone}
            />
          </View>
        </View>
      </View>

      {!compact ? (
        <>
          <View style={styles.clientMetrics}>
            <Metric label={t('accountDetails.deposit')} value={formatCompactPartnerMoney(client.netDeposit, locale)} />
            <Metric label={t('accountDetails.withdrawal')} value={formatCompactPartnerMoney(estimateClientWithdrawal(client), locale)} />
            <Metric label={t('partner.home.volume')} value={formatNumber(client.monthlyVolume / 1_000_000, 2, locale)} />
          </View>
          <View style={StyleSheet.flatten([styles.clientDivider, { backgroundColor: colors.border.subtle }])} />
          <AppText numberOfLines={1} tone="muted" variant="caption">
            {t('account.equity')} {formatCompactPartnerMoney(client.netDeposit, locale)} · {t('account.balance')}{' '}
            {formatCompactPartnerMoney(Math.max(client.netDeposit * 0.007, 0), locale)}
          </AppText>
        </>
      ) : null}

      <AppText numberOfLines={1} tone="dim" variant="caption">
        {t('partner.home.clientMeta', {
          active: localizeText(client.lastActive, locale),
          date: formatJoinedDate(client.joinedAt),
        })}
      </AppText>
    </NativePressable>
  );
}

function estimateClientWithdrawal(client: PartnerClient) {
  if (client.status === 'invited') {
    return 0;
  }

  return Math.max(client.netDeposit * 0.25, 0);
}

function formatCompactPartnerMoney(value: number, locale: 'en-US' | 'zh-CN' | 'id-ID') {
  if (Math.abs(value) >= 1000) {
    return `${formatNumber(value / 1000, value >= 100000 ? 1 : 2, locale)}K`;
  }

  return formatNumber(value, 2, locale);
}

function formatJoinedDate(date: string) {
  const [year, month, day] = date.split('-');
  return `${day}/${month}/${year}`;
}

function maskName(name: string) {
  return name.length <= 1 ? '*' : `${name[0]}****`;
}

function buildReferralDistribution(totalClients: number, clients: PartnerClient[], colors: ReturnType<typeof useProductSettings>['colors']): ReferralDistributionItem[] {
  const directCount = clients.filter((client) => client.role === 'trader').length;
  const partnerCount = clients.filter((client) => client.role === 'partner').length;
  const activeCount = clients.filter((client) => client.status === 'active' || client.status === 'funded').length;
  const depth1 = Math.max(Math.round(totalClients * 0.62), directCount);
  const depth2 = Math.max(Math.round(totalClients * 0.27), partnerCount + activeCount);
  const depth3 = Math.max(totalClients - depth1 - depth2, 0);

  return [
    { color: colors.accent.blue.fg, count: depth1, label: 'Depth1' },
    { color: colors.status.danger.fg, count: depth2, label: 'Depth2' },
    { color: colors.accent.purple.fg, count: depth3, label: 'Depth3+' },
  ];
}

function mapIconToneToBackgroundTone(tone: IconTone): AppIconFrameBackgroundTone {
  switch (tone) {
    case 'amber':
      return 'warning';
    case 'blue':
      return 'info';
    case 'brand':
      return 'brand';
    case 'danger':
      return 'danger';
    case 'down':
      return 'down';
    case 'up':
      return 'up';
    default:
      return 'neutral';
  }
}

const styles = StyleSheet.create({
  balanceRow: {
    alignItems: 'baseline',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  clientCard: {
    borderRadius: radius.md,
    gap: spacing.md,
    padding: spacing.md,
  },
  clientDivider: {
    height: lineWidth.hairline,
  },
  clientMain: {
    flex: 1,
    gap: spacing.xs,
    minWidth: 0,
  },
  clientMetrics: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  clientTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
    minWidth: 0,
  },
  clientTop: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  distributionCard: {
    gap: spacing.md,
  },
  distributionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  distributionLegend: {
    flex: 1,
    gap: spacing.sm,
    minWidth: 0,
  },
  distributionVisual: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.lg,
  },
  donutWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  featureTile: {
    borderRadius: radius.md,
    borderWidth: lineWidth.hairline,
    flexBasis: '31%',
    flexGrow: 1,
    gap: spacing.md,
    minHeight: 132,
    minWidth: 104,
    padding: spacing.md,
  },
  flexCopy: {
    flex: 1,
    gap: spacing.xs,
    minWidth: 0,
  },
  fullWidthButton: {
    width: '100%',
  },
  heroCopy: {
    alignItems: 'flex-start',
    flex: 1,
    gap: spacing.sm,
    minWidth: 0,
    zIndex: 1,
  },
  heroBody: {
    maxWidth: 260,
  },
  heroRibbon: {
    borderBottomLeftRadius: radius.xl,
    borderTopLeftRadius: radius.full,
    height: 118,
    position: 'absolute',
    right: -40,
    top: -46,
    transform: [{ rotate: '15deg' }],
    width: 210,
  },
  heroRibbonAlt: {
    borderBottomRightRadius: radius.full,
    borderTopRightRadius: radius.xl,
    bottom: -42,
    height: 96,
    left: -40,
    position: 'absolute',
    transform: [{ rotate: '-10deg' }],
    width: 180,
  },
  heroTitle: {
    textAlign: 'left',
  },
  iconMetricLead: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: spacing.md,
    minWidth: 0,
  },
  inviteButton: {
    marginTop: spacing.xs,
    minHeight: 48,
    minWidth: 136,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
  },
  linkButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  legendDot: {
    borderRadius: radius.full,
    height: 9,
    width: 9,
  },
  legendLabel: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: spacing.xs,
    minWidth: 0,
  },
  legendRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  metricCards: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  networkSummary: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  performanceStack: {
    gap: spacing.sm,
  },
  pillRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  referralHero: {
    alignItems: 'stretch',
    borderWidth: lineWidth.hairline,
    justifyContent: 'center',
    minHeight: 210,
    overflow: 'hidden',
    padding: spacing.lg,
  },
  referralHeroCompact: {
    minHeight: 238,
  },
  referralHeroContent: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
    zIndex: 1,
  },
  referralHeroContentCompact: {
    gap: spacing.sm,
  },
  sectionTitle: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  smallMetricCard: {
    flex: 1,
    gap: spacing.sm,
  },
  viewAllReferrals: {
    alignItems: 'center',
    borderRadius: radius.sm,
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  walletAction: {
    flex: 1,
  },
  walletActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  walletHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
});
