import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import type { DimensionValue } from 'react-native';

import { ActionButton } from '@/src/components/ActionButton';
import { Card } from '@/src/components/Card';
import { Metric } from '@/src/components/Metric';
import { NativePressable } from '@/src/components/NativePressable';
import { PhosphorIcon, type PhosphorIconName } from '@/src/components/PhosphorIcon';
import { getQuoteChangeVisual } from '@/src/components/quoteVisuals';
import { Screen } from '@/src/components/Screen';
import { Sparkline } from '@/src/components/Sparkline';
import { StatusPill } from '@/src/components/StatusPill';
import { AppText } from '@/src/components/Typography';
import { dupoinInsights, dupoinOnboardingSteps } from '@/src/domain/dupoinMvp';
import { formatCompactMoney, formatMoney, formatPercent, formatPrice, localizeText } from '@/src/domain/format';
import { partnerMetrics } from '@/src/domain/mockData';
import { getDisplayChange } from '@/src/domain/trading';
import type { Account, DiscoverModuleId, Instrument } from '@/src/domain/types';
import { useToast } from '@/src/feedback/Toast';
import { impactLight, notifySuccess, notifyWarning } from '@/src/feedback/haptics';
import { useProductSettings } from '@/src/settings/ProductSettings';
import { useBroker } from '@/src/state/BrokerStore';

export default function DiscoverModuleScreen() {
  const { account, instruments, positions, role, submitUpgradeRequest, upgradeRequest } = useBroker();
  const { locale, palette, selectedDiscoverModuleId, setSelectedDiscoverModule, t } = useProductSettings();
  const selectedInstrument = getPrimaryInstrument(selectedDiscoverModuleId, instruments);
  const moduleMeta = getModuleMeta(selectedDiscoverModuleId, palette);

  if (selectedDiscoverModuleId === 'profile') {
    return (
      <Screen
        contentInsetBottom={12}
        rightActions={[
          { icon: 'headphones', label: t('top.support') },
          { icon: 'envelope-open', label: t('top.notifications') },
          { icon: 'sliders-horizontal', label: locale === 'en-US' ? 'Settings' : '设置' },
        ]}
        title={t('discover.module.profile.title')}>
        <ProfileModule account={account} role={role} upgradeStatus={upgradeRequest.status} />
      </Screen>
    );
  }

  return (
    <Screen
      rightActions={[{ icon: 'compass', label: t('tabs.discover'), onPress: () => router.push('/partner-tools' as never) }]}
      subtitle={t('discover.subtitle')}
      title={t(`discover.module.${selectedDiscoverModuleId}.title`)}>
      <Card highlight>
        <View style={styles.hero}>
          <View style={styles.heroCopy}>
            <View style={StyleSheet.flatten([styles.heroIcon, { backgroundColor: `${moduleMeta.color}14`, borderColor: `${moduleMeta.color}66` }])}>
              <PhosphorIcon color={moduleMeta.color} name={moduleMeta.icon} size={22} />
            </View>
            <View style={styles.flex}>
              <AppText tone="dim" variant="eyebrow">
                {t('discover.statusEntry')}
              </AppText>
              <AppText variant="largeNumber">{t(`discover.module.${selectedDiscoverModuleId}.short`)}</AppText>
              <AppText numberOfLines={3} tone="muted" variant="caption">
                {t(`discover.module.${selectedDiscoverModuleId}.hint`)}
              </AppText>
            </View>
          </View>
          <ActionButton label={t('discover.menuTitle')} onPress={() => router.push('/partner-tools' as never)} style={styles.heroAction} tone="neutral" />
        </View>
      </Card>

      {selectedDiscoverModuleId === 'challenge' ? <ChallengeModule instrument={selectedInstrument} /> : null}
      {selectedDiscoverModuleId === 'education' ? <EducationModule /> : null}
      {selectedDiscoverModuleId === 'community' ? <CommunityModule /> : null}
      {selectedDiscoverModuleId === 'onboarding' ? <OnboardingModule /> : null}
      {selectedDiscoverModuleId === 'partner' ? <PartnerModule role={role} submitUpgradeRequest={submitUpgradeRequest} upgradeStatus={upgradeRequest.status} /> : null}
      {selectedDiscoverModuleId === 'markets' ? <MarketsModule instruments={instruments} /> : null}
      {selectedDiscoverModuleId === 'accounts' ? <AccountsModule account={account} positionsCount={positions.length} /> : null}
      {selectedDiscoverModuleId === 'support' ? <SupportModule /> : null}
      {selectedDiscoverModuleId === 'rewards' ? <RewardsModule /> : null}

      <View style={styles.moduleRailTitle}>
        <AppText variant="subtitle">{t('discover.functionCenter')}</AppText>
        <AppText tone="dim" variant="caption">
          {role === 'partner' ? t('role.partner') : t('role.trader')}
        </AppText>
      </View>
      <ScrollView contentContainerStyle={styles.moduleRail} horizontal showsHorizontalScrollIndicator={false}>
        {getModuleIds().map((moduleId) => {
          const meta = getModuleMeta(moduleId, palette);
          const selected = selectedDiscoverModuleId === moduleId;

          return (
            <NativePressable
              accessibilityLabel={t(`discover.module.${moduleId}.title`)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              key={moduleId}
              minTouch={92}
              onPress={() => {
                setSelectedDiscoverModule(moduleId);
                void impactLight();
                router.replace('/quick' as never);
              }}
              style={StyleSheet.flatten([
                styles.modulePill,
                {
                  backgroundColor: selected ? `${palette.brand}12` : palette.panel,
                  borderColor: selected ? palette.brand : palette.lineSoft,
                },
              ])}>
              <View style={StyleSheet.flatten([styles.modulePillIcon, { backgroundColor: `${meta.color}12`, borderColor: `${meta.color}55` }])}>
                <PhosphorIcon color={meta.color} name={meta.icon} size={16} />
              </View>
              <AppText numberOfLines={1} tone={selected ? 'brand' : 'default'} variant="caption">
                {t(`discover.module.${moduleId}.short`)}
              </AppText>
            </NativePressable>
          );
        })}
      </ScrollView>
    </Screen>
  );
}

function ChallengeModule({ instrument }: { instrument: Instrument }) {
  const { locale, palette } = useProductSettings();
  const { changePercent } = getDisplayChange(instrument);
  const quoteVisual = getQuoteChangeVisual(changePercent, palette);
  const rows = [
    { label: locale === 'en-US' ? 'Weekly ROI' : '周收益率', tone: 'down', value: '+18.6%' },
    { label: locale === 'en-US' ? 'Risk score' : '风险评分', tone: 'amber', value: '82' },
    { label: locale === 'en-US' ? 'Rank' : '排名', tone: 'brand', value: '#12' },
  ] as const;

  return (
    <>
      <Card>
        <View style={styles.marketFocusTop}>
          <View style={styles.flex}>
            <AppText tone="dim" variant="eyebrow">
              {locale === 'en-US' ? 'Challenge market' : '模拟赛品种'}
            </AppText>
            <AppText variant="subtitle">{instrument.symbol}</AppText>
            <AppText numberOfLines={1} tone="muted" variant="caption">
              {localizeText(instrument.name, locale)}
            </AppText>
          </View>
          <View style={StyleSheet.flatten([styles.changeBadge, { backgroundColor: `${quoteVisual.color}12` }])}>
            <AppText tone={quoteVisual.tone} variant="caption">
              {formatPercent(changePercent)}
            </AppText>
          </View>
        </View>
        <View style={styles.sparklineWrap}>
          <Sparkline color={quoteVisual.color} height={58} values={instrument.sparkline} width={232} />
        </View>
        <ActionButton label={locale === 'en-US' ? 'Open challenge ticket' : '打开模拟赛订单'} onPress={() => router.push(`/order/${instrument.id}?direction=buy` as never)} tone="brand" />
      </Card>
      <Card compact>
        <View style={styles.metricRow}>
          {rows.map((row) => (
            <Metric key={row.label} label={row.label} tone={row.tone} value={row.value} />
          ))}
        </View>
      </Card>
    </>
  );
}

function EducationModule() {
  const { locale, palette } = useProductSettings();
  const lessons = [
    [locale === 'en-US' ? 'Spread basics' : '点差基础', locale === 'en-US' ? 'Bid, ask, and cost' : '买价、卖价与成本'],
    [locale === 'en-US' ? 'Margin call' : '保证金追缴', locale === 'en-US' ? 'When equity drops' : '净值下行时的规则'],
    [locale === 'en-US' ? 'CFD risk' : 'CFD 风险', locale === 'en-US' ? 'Leverage before order' : '下单前理解杠杆'],
  ];

  return (
    <Card>
      <View style={styles.timeline}>
        {lessons.map(([title, body], index) => (
          <View key={title} style={styles.timelineRow}>
            <View style={StyleSheet.flatten([styles.timelineMark, { backgroundColor: index === 0 ? palette.brand : palette.panelSoft, borderColor: index === 0 ? palette.brand : palette.lineSoft }])}>
              <AppText style={{ color: index === 0 ? palette.white : palette.textDim }} variant="eyebrow">
                {index + 1}
              </AppText>
            </View>
            <View style={styles.flex}>
              <AppText variant="body">{title}</AppText>
              <AppText tone="muted" variant="caption">
                {body}
              </AppText>
            </View>
          </View>
        ))}
      </View>
      <ActionButton label={locale === 'en-US' ? 'Practice with EUR/USD' : '用 EUR/USD 练习'} onPress={() => router.push('/order/eur-usd' as never)} style={styles.cardAction} tone="brand" />
    </Card>
  );
}

function CommunityModule() {
  const { locale, palette } = useProductSettings();

  return (
    <Card>
      <View style={styles.insightList}>
        {dupoinInsights.map((insight) => (
          <View key={insight.id} style={StyleSheet.flatten([styles.insightRow, { borderTopColor: palette.lineSoft }])}>
            <View style={styles.flex}>
              <AppText tone="brand" variant="eyebrow">
                {localizeText(insight.category, locale)}
              </AppText>
              <AppText variant="subtitle">{localizeText(insight.title, locale)}</AppText>
              <AppText numberOfLines={3} tone="muted" variant="caption">
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

function ProfileModule({
  account,
  role,
  upgradeStatus,
}: {
  account: Account;
  role: 'trader' | 'partner';
  upgradeStatus: 'none' | 'pending' | 'approved' | 'rejected';
}) {
  const { locale, palette, t, themeMode } = useProductSettings();
  const rebateValue = role === 'partner' || upgradeStatus === 'approved' ? partnerMetrics.pendingCommission + partnerMetrics.settledCommission : 10005;
  const statCards = [
    { icon: 'bank' as PhosphorIconName, label: locale === 'en-US' ? 'Deposit' : '入金', value: '$10K' },
    { icon: 'chart-line-up' as PhosphorIconName, label: locale === 'en-US' ? 'Volume' : '交易量', value: '990' },
    { icon: 'check-circle' as PhosphorIconName, label: locale === 'en-US' ? 'New Verified' : '新增认证', value: '10' },
  ];
  const settingsRows = [
    { label: locale === 'en-US' ? 'One-click Trading' : '一键交易', right: 'switchOff' as const },
    { label: locale === 'en-US' ? 'Sound' : '声音', right: 'switchOn' as const },
    { label: t('top.notifications'), right: 'chevron' as const },
    { label: locale === 'en-US' ? 'Language' : '语言', right: 'chevron' as const },
    { label: locale === 'en-US' ? 'Theme Mode' : '主题模式', right: themeMode === 'lightBroker' ? 'Light' : 'Dark' },
  ];
  const supportRows: { icon: PhosphorIconName; label: string }[] = [
    { icon: 'shield-check', label: locale === 'en-US' ? 'Fraud Prevention' : '反诈保护' },
    { icon: 'chat-circle', label: locale === 'en-US' ? 'Feedback' : '反馈' },
    { icon: 'info', label: locale === 'en-US' ? 'Help Center' : '帮助中心' },
    { icon: 'trophy', label: locale === 'en-US' ? 'Rating App' : '应用评分' },
  ];

  return (
    <>
      <View style={styles.profileHeader}>
        <View style={StyleSheet.flatten([styles.avatar, { backgroundColor: palette.panelSoft, borderColor: palette.lineSoft }])}>
          <PhosphorIcon color={palette.text} name="user" size={30} />
        </View>
        <View style={styles.profileIdentity}>
          <View style={styles.profileNameRow}>
            <AppText variant="title">Frank Ji</AppText>
            <NativePressable minTouch={34} onPress={() => router.push('/accounts' as never)} style={StyleSheet.flatten([styles.profileViewButton, { backgroundColor: palette.panelSoft }])}>
              <AppText variant="caption">{locale === 'en-US' ? 'View' : '查看'}</AppText>
            </NativePressable>
          </View>
          <StatusPill compact icon="shield-check" label={locale === 'en-US' ? 'ID verified' : '身份已认证'} tone="brand" />
        </View>
      </View>

      <ProfileListCard
        icon="check-circle"
        iconTone={palette.brand}
        subtitle={locale === 'en-US' ? 'Build trust with a verified badge.' : '通过认证徽章建立信任。'}
        title={locale === 'en-US' ? 'Video Verified' : '视频认证'}
      />

      <Card compact style={styles.profileCard}>
        <ProfileCardHeader icon="share-network" iconTone={palette.blue} title={locale === 'en-US' ? 'Partner Portal' : 'Partner Portal'} />
        <View style={StyleSheet.flatten([styles.profileDivider, { backgroundColor: palette.lineSoft }])} />
        <AppText variant="body">{locale === 'en-US' ? 'Total Rebate · USD' : '总返佣 · USD'}</AppText>
        <View style={styles.rebateAmountRow}>
          <AppText style={styles.rebateCurrency} variant="largeNumber">$</AppText>
          <AppText style={styles.rebateMajor} variant="largeNumber">
            {formatCompactProfileNumber(rebateValue)}
          </AppText>
          <AppText style={styles.rebateMinor} variant="number">.09</AppText>
        </View>
        <MiniTrendLine color={palette.down} />
        <View style={StyleSheet.flatten([styles.profileDivider, { backgroundColor: palette.lineSoft }])} />
        <AppText variant="number">{formatMoney(rebateValue, account.currency, 2, locale)}</AppText>
        <StatusPill compact label={locale === 'en-US' ? '↑ 2.20% vs yesterday' : '↑ 2.20% 较昨日'} tone="success" />
      </Card>

      <View style={styles.profileStatsGrid}>
        {statCards.map((item) => (
          <Card compact key={item.label} style={styles.profileStatCard}>
            <View style={StyleSheet.flatten([styles.profileStatIcon, { backgroundColor: `${palette.brand}10` }])}>
              <PhosphorIcon color={palette.brand} name={item.icon} size={18} />
            </View>
            <AppText variant="body">{item.label}</AppText>
            <AppText variant="title">{item.value}</AppText>
            <AppText tone="down" variant="caption">
              {locale === 'en-US' ? '↑ 0.23% today' : '↑ 0.23% 今日'}
            </AppText>
          </Card>
        ))}
      </View>

      <Card compact style={styles.profileCard}>
        <ProfileCardHeader icon="gift" iconTone={palette.amber} title={t('discover.module.rewards.title')} />
        <View style={StyleSheet.flatten([styles.profileDivider, { backgroundColor: palette.lineSoft }])} />
        <View style={styles.rewardProfileBody}>
          <View style={styles.flex}>
            <AppText variant="body">{locale === 'en-US' ? 'Total Rewards Value' : '总奖励价值'}</AppText>
            <View style={styles.rebateAmountRow}>
              <AppText style={styles.rebateCurrency} variant="largeNumber">$</AppText>
              <AppText style={styles.rebateMajor} variant="largeNumber">10</AppText>
              <AppText style={styles.rebateMinor} variant="number">.09</AppText>
            </View>
          </View>
          <GiftIllustration />
        </View>
        <View style={StyleSheet.flatten([styles.profileDivider, { backgroundColor: palette.lineSoft }])} />
        <AppText tone="muted" variant="body">
          {locale === 'en-US' ? 'Participating in 3 Campaigns' : '正在参与 3 个活动'}
        </AppText>
      </Card>

      <Card compact style={styles.managerCard}>
        <View style={StyleSheet.flatten([styles.managerAvatar, { backgroundColor: palette.panelSoft, borderColor: palette.lineSoft }])}>
          <PhosphorIcon color={palette.textMuted} name="user-circle" size={36} />
        </View>
        <View style={styles.flex}>
          <AppText variant="body">{locale === 'en-US' ? 'My Relationship Manager' : '我的客户经理'}</AppText>
          <AppText variant="subtitle">Alexander Smith</AppText>
        </View>
        <View style={StyleSheet.flatten([styles.managerChat, { backgroundColor: `${palette.down}18` }])}>
          <PhosphorIcon color={palette.down} name="chats-circle" size={22} />
        </View>
      </Card>

      <Card compact style={styles.profileList}>
        {settingsRows.map((row, index) => (
          <SettingsRow key={row.label} label={row.label} right={row.right} showDivider={index < settingsRows.length - 1} />
        ))}
      </Card>

      <Card compact style={styles.profileList}>
        {supportRows.map((row, index) => (
          <SettingsRow icon={row.icon} key={row.label} label={row.label} right={row.label === (locale === 'en-US' ? 'Rating App' : '应用评分') ? 'stars' : 'chevron'} showDivider={index < supportRows.length - 1} />
        ))}
      </Card>

      <ProfileListCard icon="info" iconTone={palette.text} title={locale === 'en-US' ? 'About Us' : '关于我们'} />
    </>
  );
}

function ProfileListCard({
  icon,
  iconTone,
  subtitle,
  title,
}: {
  icon: PhosphorIconName;
  iconTone: string;
  subtitle?: string;
  title: string;
}) {
  const { palette } = useProductSettings();

  return (
    <Card compact style={styles.profileListCard}>
      <View style={StyleSheet.flatten([styles.profileListIcon, { backgroundColor: `${iconTone}12` }])}>
        <PhosphorIcon color={iconTone} name={icon} size={22} />
      </View>
      <View style={styles.flex}>
        <AppText variant="subtitle">{title}</AppText>
        {subtitle ? (
          <AppText numberOfLines={1} tone="muted" variant="caption">
            {subtitle}
          </AppText>
        ) : null}
      </View>
      <PhosphorIcon color={palette.textDim} name="caret-right" size={17} />
    </Card>
  );
}

function ProfileCardHeader({ icon, iconTone, title }: { icon: PhosphorIconName; iconTone: string; title: string }) {
  const { palette } = useProductSettings();

  return (
    <View style={styles.profileCardHeader}>
      <View style={StyleSheet.flatten([styles.profileListIcon, { backgroundColor: `${iconTone}12` }])}>
        <PhosphorIcon color={iconTone} name={icon} size={20} />
      </View>
      <AppText style={styles.profileCardTitle} variant="subtitle">
        {title}
      </AppText>
      <PhosphorIcon color={palette.textDim} name="caret-right" size={17} />
    </View>
  );
}

function MiniTrendLine({ color }: { color: string }) {
  return (
    <View style={styles.trendLine}>
      <Sparkline color={color} height={70} values={[2, 2.4, 3.2, 3, 4.6, 4.3, 3.4, 3.1, 4.2, 4, 4.4, 5.8, 6.5, 7.1]} width={292} />
    </View>
  );
}

function GiftIllustration() {
  const { palette } = useProductSettings();

  return (
    <View style={styles.giftScene}>
      <View style={StyleSheet.flatten([styles.coin, styles.coinOne, { backgroundColor: `${palette.amber}25`, borderColor: `${palette.amber}66` }])}>
        <AppText tone="amber" variant="eyebrow">$</AppText>
      </View>
      <View style={StyleSheet.flatten([styles.coin, styles.coinTwo, { backgroundColor: `${palette.amber}25`, borderColor: `${palette.amber}66` }])}>
        <AppText tone="amber" variant="eyebrow">$</AppText>
      </View>
      <View style={StyleSheet.flatten([styles.giftBox, { backgroundColor: `${palette.brand}16`, borderColor: `${palette.brand}33` }])}>
        <PhosphorIcon color={palette.brand} name="gift" size={42} />
      </View>
    </View>
  );
}

function SettingsRow({
  icon,
  label,
  right,
  showDivider,
}: {
  icon?: PhosphorIconName;
  label: string;
  right: 'switchOff' | 'switchOn' | 'chevron' | 'stars' | string;
  showDivider?: boolean;
}) {
  const { palette } = useProductSettings();

  return (
    <NativePressable
      accessibilityLabel={label}
      minTouch={48}
      style={StyleSheet.flatten([styles.settingsRow, showDivider && { borderBottomColor: palette.lineSoft, borderBottomWidth: 1 }])}>
      <View style={styles.settingsLeft}>
        <View style={styles.settingsIconSlot}>
          {icon ? <PhosphorIcon color={palette.text} name={icon} size={20} /> : <View style={StyleSheet.flatten([styles.placeholderRing, { borderColor: palette.textDim }])} />}
        </View>
        <AppText variant="body">{label}</AppText>
      </View>
      <SettingsRowRight value={right} />
    </NativePressable>
  );
}

function SettingsRowRight({ value }: { value: 'switchOff' | 'switchOn' | 'chevron' | 'stars' | string }) {
  const { palette } = useProductSettings();

  if (value === 'switchOff' || value === 'switchOn') {
    const enabled = value === 'switchOn';
    return (
      <View style={StyleSheet.flatten([styles.switchTrack, { backgroundColor: enabled ? palette.down : palette.textDim }])}>
        <View style={StyleSheet.flatten([styles.switchKnob, enabled && styles.switchKnobOn, { backgroundColor: palette.white }])} />
      </View>
    );
  }

  if (value === 'stars') {
    return (
      <View style={styles.stars}>
        {[0, 1, 2, 3, 4].map((item) => (
          <AppText key={item} style={{ color: palette.textDim }} variant="body">
            ★
          </AppText>
        ))}
        <PhosphorIcon color={palette.textDim} name="caret-right" size={16} />
      </View>
    );
  }

  if (value === 'chevron') {
    return <PhosphorIcon color={palette.textDim} name="caret-right" size={16} />;
  }

  return (
    <View style={styles.settingsValue}>
      <AppText tone="muted" variant="body">
        {value}
      </AppText>
      <PhosphorIcon color={palette.textDim} name="caret-right" size={16} />
    </View>
  );
}

function formatCompactProfileNumber(value: number) {
  if (value >= 1000) {
    return `${Math.floor(value / 1000)}K`;
  }

  return String(Math.floor(value));
}

function OnboardingModule() {
  const { locale, palette } = useProductSettings();

  return (
    <Card>
      <View style={styles.timeline}>
        {dupoinOnboardingSteps.map((step, index) => (
          <View key={step.id} style={styles.timelineRow}>
            <View style={StyleSheet.flatten([styles.timelineMark, { backgroundColor: index < 2 ? palette.down : palette.brand, borderColor: index < 2 ? palette.down : palette.brand }])}>
              <AppText style={{ color: palette.white }} variant="eyebrow">
                {index + 1}
              </AppText>
            </View>
            <View style={styles.flex}>
              <AppText variant="body">{localizeText(step.label, locale)}</AppText>
              <AppText tone={index < 2 ? 'down' : 'brand'} variant="caption">
                {localizeText(step.state, locale)}
              </AppText>
            </View>
          </View>
        ))}
      </View>
      <ActionButton label={locale === 'en-US' ? 'Continue opening account' : '继续开户'} onPress={() => router.push('/auth/onboarding' as never)} style={styles.cardAction} tone="brand" />
    </Card>
  );
}

function PartnerModule({
  role,
  submitUpgradeRequest,
  upgradeStatus,
}: {
  role: 'trader' | 'partner';
  submitUpgradeRequest: (reason: string) => void;
  upgradeStatus: 'none' | 'pending' | 'approved' | 'rejected';
}) {
  const { locale, t } = useProductSettings();
  const toast = useToast();
  const isPartner = role === 'partner' || upgradeStatus === 'approved';
  const actionLabel = isPartner
    ? t('partner.toolsTitle')
    : upgradeStatus === 'pending'
      ? t('upgrade.status.pending')
      : t('upgrade.applyTitle');

  return (
    <>
      <Card>
        <View style={styles.metricRow}>
          <Metric label={t('partner.monthClients')} value={String(partnerMetrics.clients)} />
          <Metric label={t('partner.activeClients')} tone="down" value={String(partnerMetrics.activeClients)} />
          <Metric label={locale === 'en-US' ? 'Conversion' : '转化率'} tone="brand" value={formatPercent(partnerMetrics.conversionRate)} />
        </View>
        <ActionButton
          label={actionLabel}
          onPress={() => {
            if (isPartner) {
              router.push('/partner-tools' as never);
              return;
            }

            if (upgradeStatus === 'pending') {
              void notifyWarning();
              toast.show({ message: t('upgrade.pendingHint'), title: t('upgrade.status.pending'), tone: 'warning' });
              return;
            }

            submitUpgradeRequest(t('upgrade.defaultReason'));
            void notifySuccess();
            toast.show({ message: t('upgrade.pendingHint'), title: t('upgrade.submitted'), tone: 'success' });
          }}
          style={styles.cardAction}
          tone={isPartner ? 'brand' : upgradeStatus === 'pending' ? 'amber' : 'neutral'}
        />
      </Card>
    </>
  );
}

function MarketsModule({ instruments }: { instruments: Instrument[] }) {
  const { locale, palette } = useProductSettings();
  const movers = [...instruments].sort((a, b) => Math.abs(getDisplayChange(b).changePercent) - Math.abs(getDisplayChange(a).changePercent)).slice(0, 4);

  return (
    <Card compact>
      {movers.map((instrument, index) => {
        const { changePercent } = getDisplayChange(instrument);
        const quoteVisual = getQuoteChangeVisual(changePercent, palette);

        return (
          <NativePressable
            accessibilityLabel={instrument.symbol}
            key={instrument.id}
            minTouch={64}
            onPress={() => router.push(`/instrument/${instrument.id}` as never)}
            style={StyleSheet.flatten([styles.instrumentRow, index < movers.length - 1 && { borderBottomColor: palette.lineSoft, borderBottomWidth: 1 }])}>
            <View style={styles.flex}>
              <AppText variant="subtitle">{instrument.symbol}</AppText>
              <AppText numberOfLines={1} tone="muted" variant="caption">
                {localizeText(instrument.name, locale)}
              </AppText>
            </View>
            <View style={styles.instrumentSide}>
              <AppText tone={quoteVisual.tone} variant="number">
                {formatPrice(instrument, instrument.ask)}
              </AppText>
              <AppText tone={quoteVisual.tone} variant="caption">
                {formatPercent(changePercent)}
              </AppText>
            </View>
          </NativePressable>
        );
      })}
    </Card>
  );
}

function AccountsModule({ account, positionsCount }: { account: Account; positionsCount: number }) {
  const { locale, t } = useProductSettings();

  return (
    <>
      <Card>
        <View style={styles.metricRow}>
          <Metric label={t('account.balance')} value={formatMoney(account.balance, account.currency, 0, locale)} />
          <Metric label={t('account.usedMargin')} tone="amber" value={formatCompactMoney(account.usedMargin, account.currency, locale)} />
          <Metric label={t('home.positions')} tone="brand" value={String(positionsCount)} />
        </View>
      </Card>
      <Card compact>
        <View style={styles.detailRows}>
          <DetailRow label={t('account.currentTrading')} value={account.accountId} />
          <DetailRow label={t('account.marginRate')} value={account.marginLevel > 0 ? `${account.marginLevel.toFixed(2)}%` : t('home.noMargin')} />
          <DetailRow label={t('account.credit')} value={formatMoney(account.credit, account.currency, 0, locale)} />
        </View>
        <ActionButton label={locale === 'en-US' ? 'Open account list' : '打开账户列表'} onPress={() => router.push('/accounts' as never)} style={styles.cardAction} tone="neutral" />
      </Card>
    </>
  );
}

function SupportModule() {
  const { locale, palette, t } = useProductSettings();
  const toast = useToast();
  const rows = [
    [t('top.support'), locale === 'en-US' ? 'Online help desk' : '在线帮助中心'],
    [t('top.notifications'), locale === 'en-US' ? 'Account and service alerts' : '账户与服务通知'],
    [locale === 'en-US' ? 'Service status' : '服务状态', locale === 'en-US' ? 'Quote proxy and demo workspace' : '报价代理与演示工作台'],
  ];

  return (
    <Card compact>
      <View style={styles.detailRows}>
        {rows.map(([label, value]) => (
          <DetailRow key={label} label={label} value={value} />
        ))}
      </View>
      <ActionButton
        label={t('top.support')}
        onPress={() => {
          void impactLight();
          toast.show({ message: t('top.placeholderMessage'), title: t('top.placeholderTitle', { action: t('top.support') }) });
        }}
        style={StyleSheet.flatten([styles.cardAction, { borderColor: palette.lineSoft }])}
        tone="neutral"
      />
    </Card>
  );
}

function RewardsModule() {
  const { locale, palette } = useProductSettings();
  const missions = [
    [locale === 'en-US' ? 'Watchlist' : '自选任务', '75%'],
    [locale === 'en-US' ? 'First order' : '首单任务', '40%'],
    [locale === 'en-US' ? 'Risk quiz' : '风险测验', '100%'],
  ] as const satisfies readonly (readonly [string, DimensionValue])[];

  return (
    <Card>
      <View style={styles.rewardHeader}>
        <Metric label={locale === 'en-US' ? 'Demo credits' : '模拟体验金'} tone="amber" value="$2K" />
        <Metric label={locale === 'en-US' ? 'Badges' : '徽章'} tone="brand" value="6" />
      </View>
      <View style={styles.rewardList}>
        {missions.map(([label, value]) => (
          <View key={label} style={styles.rewardRow}>
            <AppText variant="body">{label}</AppText>
            <View style={StyleSheet.flatten([styles.rewardProgressTrack, { backgroundColor: palette.lineSoft }])}>
              <View style={StyleSheet.flatten([styles.rewardProgressFill, { backgroundColor: palette.brand, width: value }])} />
            </View>
            <AppText tone="dim" variant="caption">
              {value}
            </AppText>
          </View>
        ))}
      </View>
    </Card>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  const { palette } = useProductSettings();

  return (
    <View style={StyleSheet.flatten([styles.detailRow, { borderBottomColor: palette.lineSoft }])}>
      <AppText tone="muted" variant="caption">
        {label}
      </AppText>
      <AppText numberOfLines={1} variant="body">
        {value}
      </AppText>
    </View>
  );
}

function getPrimaryInstrument(moduleId: DiscoverModuleId, instruments: Instrument[]) {
  const preferredId = moduleId === 'challenge' ? 'xau-usd' : 'eur-usd';
  return instruments.find((instrument) => instrument.id === preferredId) ?? instruments[0];
}

function getModuleIds(): DiscoverModuleId[] {
  return ['challenge', 'education', 'community', 'profile', 'onboarding', 'partner', 'markets', 'accounts', 'support', 'rewards'];
}

function getModuleMeta(moduleId: DiscoverModuleId, palette: ReturnType<typeof useProductSettings>['palette']) {
  const meta: Record<DiscoverModuleId, { color: string; icon: PhosphorIconName }> = {
    accounts: { color: palette.blue, icon: 'user' },
    challenge: { color: palette.amber, icon: 'trophy' },
    community: { color: palette.textMuted, icon: 'chats-circle' },
    education: { color: palette.brand, icon: 'graduation-cap' },
    markets: { color: palette.up, icon: 'chart-line-up' },
    onboarding: { color: palette.down, icon: 'identification-card' },
    partner: { color: palette.brand, icon: 'share-network' },
    profile: { color: palette.text, icon: 'user-circle' },
    rewards: { color: palette.amber, icon: 'gift' },
    support: { color: palette.textMuted, icon: 'headphones' },
  };

  return meta[moduleId];
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    height: 58,
    justifyContent: 'center',
    width: 58,
  },
  cardAction: {
    marginTop: 14,
  },
  changeBadge: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  detailRow: {
    alignItems: 'center',
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    minHeight: 42,
  },
  detailRows: {
    gap: 2,
  },
  coin: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    height: 22,
    justifyContent: 'center',
    position: 'absolute',
    width: 22,
    zIndex: 2,
  },
  coinOne: {
    left: 4,
    top: 20,
  },
  coinTwo: {
    left: 20,
    top: 46,
  },
  flex: {
    flex: 1,
    gap: 3,
    minWidth: 0,
  },
  gainBadge: {
    alignSelf: 'flex-start',
    borderRadius: 4,
    marginTop: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  giftBox: {
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    height: 72,
    justifyContent: 'center',
    marginLeft: 28,
    width: 82,
  },
  giftScene: {
    height: 84,
    justifyContent: 'center',
    position: 'relative',
    width: 116,
  },
  hero: {
    gap: 14,
  },
  heroAction: {
    alignSelf: 'flex-start',
    minHeight: 38,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  heroCopy: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  heroIcon: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  insightList: {
    gap: 2,
  },
  insightRow: {
    alignItems: 'flex-start',
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 12,
    paddingTop: 12,
  },
  instrumentRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  instrumentSide: {
    alignItems: 'flex-end',
    gap: 2,
  },
  marketFocusTop: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  metricRow: {
    flexDirection: 'row',
    gap: 12,
  },
  managerAvatar: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    height: 50,
    justifyContent: 'center',
    width: 50,
  },
  managerCard: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    minHeight: 78,
  },
  managerChat: {
    alignItems: 'center',
    borderRadius: 999,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  modulePill: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    gap: 7,
    minWidth: 82,
    padding: 10,
  },
  modulePillIcon: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  moduleRail: {
    gap: 8,
    paddingRight: 16,
  },
  moduleRailTitle: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  rewardHeader: {
    flexDirection: 'row',
    gap: 12,
  },
  rebateAmountRow: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    marginTop: 6,
  },
  rebateCurrency: {
    fontSize: 34,
    lineHeight: 40,
  },
  rebateMajor: {
    fontSize: 46,
    lineHeight: 52,
  },
  rebateMinor: {
    fontSize: 26,
    lineHeight: 34,
    marginBottom: 4,
  },
  rewardProfileBody: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  rewardList: {
    gap: 12,
    marginTop: 14,
  },
  rewardProgressFill: {
    borderRadius: 999,
    height: 7,
  },
  rewardProgressTrack: {
    borderRadius: 999,
    flex: 1,
    height: 7,
    overflow: 'hidden',
  },
  rewardRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  placeholderRing: {
    borderRadius: 999,
    borderStyle: 'dashed',
    borderWidth: 1.5,
    height: 22,
    width: 22,
  },
  profileCard: {
    gap: 12,
  },
  profileCardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  profileCardTitle: {
    flex: 1,
  },
  profileDivider: {
    height: 1,
  },
  profileHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 2,
    paddingTop: 2,
  },
  profileIdentity: {
    flex: 1,
    gap: 5,
    minWidth: 0,
  },
  profileList: {
    gap: 0,
  },
  profileListCard: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    minHeight: 70,
  },
  profileListIcon: {
    alignItems: 'center',
    borderRadius: 999,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  profileNameRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
  profileStatCard: {
    flex: 1,
    gap: 7,
    minHeight: 126,
    minWidth: 0,
  },
  profileStatIcon: {
    alignItems: 'center',
    borderRadius: 999,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  profileStatsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  profileViewButton: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  settingsIconSlot: {
    alignItems: 'center',
    height: 26,
    justifyContent: 'center',
    width: 26,
  },
  settingsLeft: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 12,
    minWidth: 0,
  },
  settingsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    minHeight: 48,
    paddingVertical: 8,
  },
  settingsValue: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
  },
  sparklineWrap: {
    alignItems: 'center',
    marginVertical: 14,
    overflow: 'hidden',
  },
  stars: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 1,
  },
  switchKnob: {
    borderRadius: 999,
    height: 22,
    width: 22,
  },
  switchKnobOn: {
    transform: [{ translateX: 22 }],
  },
  switchTrack: {
    borderRadius: 999,
    height: 28,
    justifyContent: 'center',
    paddingHorizontal: 3,
    width: 52,
  },
  timeline: {
    gap: 12,
  },
  timelineMark: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  timelineRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  trendLine: {
    alignItems: 'center',
    overflow: 'hidden',
  },
  verifiedBadge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 4,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 3,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
});
