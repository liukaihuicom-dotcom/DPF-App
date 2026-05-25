import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import type { DimensionValue } from 'react-native';
import { useEffect, useState } from 'react';

import { ActionButton } from '@/src/components/ActionButton';
import { bottomSheetPresets, useBottomSheet } from '@/src/components/BottomSheet';
import { Card } from '@/src/components/Card';
import { GlobalMenuList, type GlobalMenuListItem } from '@/src/components/GlobalMenuList';
import { InstrumentIcon } from '@/src/components/InstrumentIcon';
import { Metric } from '@/src/components/Metric';
import { NativePressable } from '@/src/components/NativePressable';
import { AppIcon, type AppIconName, type IconTone } from '@/src/components/AppIcon';
import type { AppIconFrameBackgroundTone } from '@/src/components/AppIconFrame';
import { AppIconFrame } from '@/src/components/AppIconFrame';
import { getQuoteChangeVisual } from '@/src/components/quoteVisuals';
import { Screen } from '@/src/components/Screen';
import { Sparkline } from '@/src/components/Sparkline';
import { StatusPill } from '@/src/components/StatusPill';
import { TextField } from '@/src/components/TextField';
import { AppText } from '@/src/components/Typography';
import { SwitchControl } from '@/src/components/forms/SwitchControl';
import { ProfileAvatar, getProfileAvatarUri, profileAvatarOptions, type ProfileAvatarId } from '@/src/components/ProfileAvatar';
import { dupoinInsights, dupoinOnboardingSteps } from '@/src/domain/dupoinMvp';
import { formatCompactMoney, formatMoney, formatPercent, formatPrice, localizeText } from '@/src/domain/format';
import { partnerMetrics } from '@/src/domain/mockData';
import { getDisplayChange } from '@/src/domain/trading';
import type { Account, DiscoverModuleId, Instrument } from '@/src/domain/types';
import { useToast } from '@/src/feedback/Toast';
import { impactLight, notifySuccess, notifyWarning } from '@/src/feedback/haptics';
import { useProductSettings } from '@/src/settings/ProductSettings';
import { useBroker } from '@/src/state/BrokerStore';
import { resolveThemeTone, type ThemeColors } from '@/src/theme/colors';
import { lineWidth, radius, size, spacing, typography } from '@/src/theme/tokens';

const NICKNAME_CHANGE_INTERVAL_DAYS = 30;
const NICKNAME_CHANGE_INTERVAL_MS = NICKNAME_CHANGE_INTERVAL_DAYS * 24 * 60 * 60 * 1000;

export default function DiscoverModuleScreen() {
  const { module } = useLocalSearchParams<{ module?: string }>();
  const { account, instruments, positions, role, submitUpgradeRequest, upgradeRequest } = useBroker();
  const { locale, colors, selectedDiscoverModuleId, setSelectedDiscoverModule, t } = useProductSettings();
  const routeModuleId = isDiscoverModuleId(module) ? module : undefined;
  const activeDiscoverModuleId = routeModuleId ?? selectedDiscoverModuleId;
  const selectedInstrument = getPrimaryInstrument(selectedDiscoverModuleId, instruments);
  const moduleMeta = getModuleMeta(activeDiscoverModuleId);

  useEffect(() => {
    if (routeModuleId && routeModuleId !== selectedDiscoverModuleId) {
      setSelectedDiscoverModule(routeModuleId);
    }
  }, [routeModuleId, selectedDiscoverModuleId, setSelectedDiscoverModule]);

  if (activeDiscoverModuleId === 'profile') {
    return (
      <Screen
        contentInsetBottom={12}
        rightActions={[
          { icon: 'icon.support.headset', label: t('top.support') },
          { icon: 'icon.notification.email', label: t('top.notifications') },
        ]}
        title={t('discover.module.profile.title')}>
        <ProfileModule account={account} role={role} upgradeStatus={upgradeRequest.status} />
      </Screen>
    );
  }

  return (
    <Screen
      rightActions={[{ icon: 'icon.navigation.discover', label: t('tabs.discover'), onPress: () => router.push('/partner-tools' as never) }]}
      subtitle={t('discover.subtitle')}
      title={t(`discover.module.${activeDiscoverModuleId}.title`)}>
      <Card highlight>
        <View style={styles.hero}>
          <View style={styles.heroCopy}>
            <AppIconFrame name={moduleMeta.icon} sizeVariant="lg" iconSize={20} tone={moduleMeta.tone} />
            <View style={styles.flex}>
              <AppText tone="dim" variant="eyebrow">
                {t('discover.statusEntry')}
              </AppText>
              <AppText variant="largeNumber">{t(`discover.module.${activeDiscoverModuleId}.short`)}</AppText>
              <AppText numberOfLines={3} tone="muted" variant="caption">
                {t(`discover.module.${activeDiscoverModuleId}.hint`)}
              </AppText>
            </View>
          </View>
          <ActionButton label={t('discover.menuTitle')} onPress={() => router.push('/partner-tools' as never)} style={styles.heroAction} tone="neutral" />
        </View>
      </Card>

      {activeDiscoverModuleId === 'challenge' ? <ChallengeModule instrument={selectedInstrument} /> : null}
      {activeDiscoverModuleId === 'education' ? <EducationModule /> : null}
      {activeDiscoverModuleId === 'community' ? <CommunityModule /> : null}
      {activeDiscoverModuleId === 'onboarding' ? <OnboardingModule /> : null}
      {activeDiscoverModuleId === 'partner' ? <PartnerModule role={role} submitUpgradeRequest={submitUpgradeRequest} upgradeStatus={upgradeRequest.status} /> : null}
      {activeDiscoverModuleId === 'markets' ? <MarketsModule instruments={instruments} /> : null}
      {activeDiscoverModuleId === 'accounts' ? <AccountsModule account={account} positionsCount={positions.length} /> : null}
      {activeDiscoverModuleId === 'support' ? <SupportModule /> : null}
      {activeDiscoverModuleId === 'rewards' ? <RewardsModule /> : null}

      <View style={styles.moduleRailTitle}>
        <AppText variant="subtitle">{t('discover.functionCenter')}</AppText>
        <AppText tone="dim" variant="caption">
          {role === 'partner' ? t('role.partner') : t('role.trader')}
        </AppText>
      </View>
      <ScrollView contentContainerStyle={styles.moduleRail} horizontal showsHorizontalScrollIndicator={false}>
        {getModuleIds().map((moduleId) => {
          const meta = getModuleMeta(moduleId);
          const selected = activeDiscoverModuleId === moduleId;

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
                  backgroundColor: selected ? `${colors.brand.fg}12` : colors.surface.panel,
                  borderColor: selected ? colors.brand.fg : colors.border.subtle,
                },
              ])}>
              <AppIconFrame name={meta.icon} sizeVariant="sm" iconSize={16} tone={meta.tone} />
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

function isDiscoverModuleId(value: unknown): value is DiscoverModuleId {
  return (
    value === 'challenge' ||
    value === 'education' ||
    value === 'community' ||
    value === 'profile' ||
    value === 'onboarding' ||
    value === 'partner' ||
    value === 'markets' ||
    value === 'accounts' ||
    value === 'support' ||
    value === 'rewards'
  );
}

function ChallengeModule({ instrument }: { instrument: Instrument }) {
  const { locale, colors } = useProductSettings();
  const { changePercent } = getDisplayChange(instrument);
  const quoteVisual = getQuoteChangeVisual(changePercent, colors);
  const rows = [
    { label: locale !== 'zh-CN' ? 'Weekly ROI' : '周收益率', tone: 'down', value: '+18.6%' },
    { label: locale !== 'zh-CN' ? 'Risk score' : '风险评分', tone: 'amber', value: '82' },
    { label: locale !== 'zh-CN' ? 'Rank' : '排名', tone: 'brand', value: '#12' },
  ] as const;

  return (
    <>
      <Card>
        <View style={styles.marketFocusTop}>
          <InstrumentIcon instrument={instrument} size={42} />
          <View style={styles.flex}>
            <AppText tone="dim" variant="eyebrow">
              {locale !== 'zh-CN' ? 'Challenge market' : '模拟赛品种'}
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
        <ActionButton label={locale !== 'zh-CN' ? 'Open challenge ticket' : '打开模拟赛订单'} onPress={() => router.push(`/order/${instrument.id}?direction=buy` as never)} tone="brand" />
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
  const { locale, colors } = useProductSettings();
  const lessons = [
    [locale !== 'zh-CN' ? 'Spread basics' : '点差基础', locale !== 'zh-CN' ? 'Bid, ask, and cost' : '买价、卖价与成本'],
    [locale !== 'zh-CN' ? 'Margin call' : '保证金追缴', locale !== 'zh-CN' ? 'When equity drops' : '净值下行时的规则'],
    [locale !== 'zh-CN' ? 'CFD risk' : 'CFD 风险', locale !== 'zh-CN' ? 'Leverage before order' : '下单前理解杠杆'],
  ];

  return (
    <Card>
      <View style={styles.timeline}>
        {lessons.map(([title, body], index) => (
          <View key={title} style={styles.timelineRow}>
            <View style={StyleSheet.flatten([styles.timelineMark, { backgroundColor: index === 0 ? colors.brand.fg : colors.surface.subtle, borderColor: index === 0 ? colors.brand.fg : colors.border.subtle }])}>
              <AppText tone={index === 0 ? 'white' : 'dim'} variant="eyebrow">
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
      <ActionButton label={locale !== 'zh-CN' ? 'Practice with EUR/USD' : '用 EUR/USD 练习'} onPress={() => router.push('/order/eur-usd' as never)} style={styles.cardAction} tone="brand" />
    </Card>
  );
}

function CommunityModule() {
  const { locale, colors } = useProductSettings();

  return (
    <Card>
      <View style={styles.insightList}>
        {dupoinInsights.map((insight) => (
          <View key={insight.id} style={StyleSheet.flatten([styles.insightRow, { borderTopColor: colors.border.subtle }])}>
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

export function ProfileModule({
  account,
  role,
  upgradeStatus,
}: {
  account: Account;
  role: 'trader' | 'partner';
  upgradeStatus: 'none' | 'pending' | 'approved' | 'rejected';
}) {
  const {
    locale,
    colors,
    profileAvatarId,
    profileNicknameLastChangedAt,
    profileNickname,
    rememberedLoginSnapshot,
    resolvedThemeMode,
    pinStatus,
    setAuthStatus,
    setLocalPinCode,
    setRememberedLoginSnapshot,
    setPinGateStatus,
    setPinStatus,
    setProfileAvatarId,
    setProfileNicknameLastChangedAt,
    setProfileNickname,
    t,
    themeMode,
  } = useProductSettings();
  const bottomSheet = useBottomSheet();
  const toast = useToast();
  const rebateValue = role === 'partner' || upgradeStatus === 'approved' ? partnerMetrics.pendingCommission + partnerMetrics.settledCommission : 10005;
  const statCards = [
    { icon: 'icon.wallet.deposit' as AppIconName, iconTone: 'brand' as IconTone, label: locale !== 'zh-CN' ? 'Deposit' : '入金', value: '$10K' },
    { icon: 'icon.trading.volume' as AppIconName, iconTone: 'info' as IconTone, label: locale !== 'zh-CN' ? 'Volume' : '交易量', value: '990' },
    { icon: 'icon.status.verified' as AppIconName, iconTone: 'success' as IconTone, label: locale !== 'zh-CN' ? 'New Verified' : '新增认证', value: '10' },
  ];
  const ratingLabel = locale !== 'zh-CN' ? 'Rating App' : '应用评分';
  const showUnavailableToast = (action: string) => {
    void impactLight();
    toast.show({ message: t('top.placeholderMessage'), title: t('top.placeholderTitle', { action }) });
  };
  const enableSecurityCode = () => {
    void impactLight();
    router.push(`/auth/pin-setup?mode=setup&verify=1&redirect=${encodeURIComponent('/settings')}` as never);
  };
  const disableSecurityCode = () => {
    void impactLight();
    bottomSheet.show(bottomSheetPresets.detail({
      content: (
        <AppText tone="muted" variant="body.secondary">
          {t('settings.pin.disableConfirmBody')}
        </AppText>
      ),
      footer: [
        {
          label: t('common.cancel'),
          onPress: () => undefined,
          tone: 'neutral',
          variant: 'outline',
        },
        {
          label: t('settings.pin.disableAction'),
          onPress: () => {
            setLocalPinCode('');
            setPinGateStatus('unlocked');
            setPinStatus('unset');
            void notifySuccess();
            toast.show({ title: t('settings.pin.disabledToast') });
          },
          tone: 'danger',
          variant: 'filled',
        },
      ],
      leftIcon: 'icon.security.key_access',
      title: t('settings.pin.disableConfirmTitle'),
    }));
  };
  const updateSecurityCodeEnabled = (enabled: boolean) => {
    if (enabled) {
      enableSecurityCode();
      return;
    }

    disableSecurityCode();
  };
  const settingsRows: GlobalMenuListItem[] = [
    {
      accessory: <SwitchControl accessibilityLabel={locale !== 'zh-CN' ? 'One-click Trading' : '一键交易'} onValueChange={() => showUnavailableToast(locale !== 'zh-CN' ? 'One-click Trading' : '一键交易')} value={false} />,
      icon: 'icon.trading.order_ticket' as AppIconName,
      label: locale !== 'zh-CN' ? 'One-click Trading' : '一键交易',
      showChevron: false,
    },
    {
      accessory: <SwitchControl accessibilityLabel={locale !== 'zh-CN' ? 'Sound' : '声音'} onValueChange={() => showUnavailableToast(locale !== 'zh-CN' ? 'Sound' : '声音')} value />,
      icon: 'icon.system.settings' as AppIconName,
      label: locale !== 'zh-CN' ? 'Sound' : '声音',
      showChevron: false,
    },
    { icon: 'icon.notification.bell' as AppIconName, label: t('top.notifications'), onPress: () => showUnavailableToast(t('top.notifications')) },
    { icon: 'icon.market.global' as AppIconName, label: locale !== 'zh-CN' ? 'Language' : '语言', onPress: () => showUnavailableToast(locale !== 'zh-CN' ? 'Language' : '语言') },
    {
      icon: 'icon.security.risk_shield' as AppIconName,
      label: t('settings.securityLog.title'),
      onPress: () => router.push('/settings/security-log' as never),
    },
    {
      accessory: (
        <SwitchControl
          accessibilityLabel={pinStatus === 'set' ? t('settings.pin.disableAction') : t('settings.pin.enableAction')}
          onValueChange={updateSecurityCodeEnabled}
          value={pinStatus === 'set'}
        />
      ),
      icon: 'icon.security.key_access' as AppIconName,
      label: t('settings.pin.title'),
      showChevron: false,
    },
    {
      icon: 'icon.system.settings' as AppIconName,
      label: locale !== 'zh-CN' ? 'Appearance' : '外观',
      onPress: () => router.push('/appearance' as never),
      rightLabel: getThemeModeLabel(themeMode, resolvedThemeMode, locale),
    },
  ];
  const supportRows: GlobalMenuListItem[] = [
    { icon: 'icon.security.risk_shield', label: locale !== 'zh-CN' ? 'Fraud Prevention' : '反诈保护', onPress: () => showUnavailableToast(locale !== 'zh-CN' ? 'Fraud Prevention' : '反诈保护') },
    { icon: 'icon.notification.feedback', label: locale !== 'zh-CN' ? 'Feedback' : '反馈', onPress: () => showUnavailableToast(locale !== 'zh-CN' ? 'Feedback' : '反馈') },
    { icon: 'icon.support.help_center', label: locale !== 'zh-CN' ? 'Help Center' : '帮助中心', onPress: () => showUnavailableToast(locale !== 'zh-CN' ? 'Help Center' : '帮助中心') },
    { accessory: <MenuRatingStars />, icon: 'icon.feedback.rating', label: ratingLabel, onPress: () => showUnavailableToast(ratingLabel) },
    { icon: 'icon.support.about', label: locale !== 'zh-CN' ? 'About Us' : '关于我们', onPress: () => showUnavailableToast(locale !== 'zh-CN' ? 'About Us' : '关于我们') },
  ];
  const openProfileEditSheet = () => {
    const nicknameDraftRef = { current: profileNickname };
    const errorSetterRef: { current?: (error?: string) => void } = {};
    const handleSaveProfile = () => {
      const nextNickname = normalizeProfileNickname(nicknameDraftRef.current);
      const currentNickname = normalizeProfileNickname(profileNickname);
      const nicknameChanged = nextNickname !== currentNickname;
      const nextAllowedAt = getNextNicknameChangeAt(profileNicknameLastChangedAt);

      if (nicknameChanged && nextAllowedAt && Date.now() < nextAllowedAt.getTime()) {
        const error = t('auth.profile.nicknameChangeLocked', { date: formatProfileRuleDate(nextAllowedAt, locale) });

        errorSetterRef.current?.(error);
        void notifyWarning();
        toast.show({
          message: error,
          title: t('auth.profile.nicknameChangeBlocked'),
          tone: 'warning',
        });

        return false;
      }

      setProfileNickname(nextNickname);
      if (nicknameChanged) {
        setProfileNicknameLastChangedAt(new Date().toISOString());
      }
      if (rememberedLoginSnapshot) {
        setRememberedLoginSnapshot({
          ...rememberedLoginSnapshot,
          avatarId: profileAvatarId,
          nickname: nextNickname || undefined,
        });
      }
      void notifySuccess();
      toast.show({ title: t('auth.profile.saved'), tone: 'success' });

      return undefined;
    };

    bottomSheet.show(bottomSheetPresets.detail({
      content: (
        <ProfileEditSheetContent
          nicknameDraftRef={nicknameDraftRef}
          nicknameErrorSetterRef={errorSetterRef}
        />
      ),
      footer: [
        {
          label: t('common.save'),
          onPress: handleSaveProfile,
          tone: 'brand',
          variant: 'filled',
        },
      ],
      title: locale !== 'zh-CN' ? 'Edit profile' : '编辑资料',
    }));
  };
  const logout = () => {
    if (rememberedLoginSnapshot) {
      setRememberedLoginSnapshot({
        ...rememberedLoginSnapshot,
        avatarId: profileAvatarId,
        nickname: profileNickname.trim() || rememberedLoginSnapshot.nickname,
      });
    }

    setPinGateStatus('unlocked');
    setPinStatus('unset');
    setLocalPinCode('');
    setAuthStatus('guest');
    void notifySuccess();
    router.replace('/auth' as never);
  };
  const avatarUri = getProfileAvatarUri(profileAvatarId);

  return (
    <>
      <Card compact style={styles.profileHeader}>
        <NativePressable
          accessibilityLabel={locale !== 'zh-CN' ? 'Edit profile avatar' : '编辑头像'}
          minTouch={58}
          onPress={openProfileEditSheet}
          style={styles.avatarPressable}>
          <ProfileAvatar id={profileAvatarId} key={avatarUri} size={58} />
          <View style={StyleSheet.flatten([styles.avatarEditBadge, { backgroundColor: colors.brand.fg, borderColor: colors.surface.panel }])}>
            <AppIcon tone="white" name="icon.system.settings" size={12} />
          </View>
        </NativePressable>
        <View style={styles.profileIdentity}>
          <NativePressable
            accessibilityLabel={locale !== 'zh-CN' ? 'Edit nickname and avatar' : '编辑昵称和头像'}
            minTouch={44}
            onPress={openProfileEditSheet}
            style={styles.profileNameRow}>
            <AppText variant="subtitle">{profileNickname.trim() || t('auth.profile.noNickname')}</AppText>
          </NativePressable>
          <View style={styles.profileTagRow}>
            <StatusPill
              compact
              icon={<AppIcon name="icon.security.risk_shield" sizeVariant="xs" />}
              label={locale !== 'zh-CN' ? 'ID verified' : '身份已认证'}
              style={styles.profileTag}
              tone="info"
            />
            <StatusPill
              compact
              icon={<AppIcon name="icon.status.verified" sizeVariant="xs" />}
              label={locale !== 'zh-CN' ? 'Video verified' : '视频认证'}
              style={styles.profileTag}
              tone="success"
            />
          </View>
        </View>
      </Card>

      <ProfileListCard
        icon="icon.status.verified"
        iconTone="brand"
        subtitle={locale !== 'zh-CN' ? 'Build trust with a verified badge.' : '通过认证徽章建立信任。'}
        title={locale !== 'zh-CN' ? 'Video Verified' : '视频认证'}
      />

      <Card compact style={styles.profileCard}>
        <ProfileCardHeader icon="icon.ib.network" iconTone="blue" title={locale !== 'zh-CN' ? 'Partner Portal' : 'Partner Portal'} />
        <View style={styles.rebateCompactBlock}>
          <View style={styles.rebateMetricHeader}>
            <AppText tone="muted" variant="caption">
              {locale !== 'zh-CN' ? 'Total Rebate · USD' : '总返佣 · USD'}
            </AppText>
            <StatusPill compact label={locale !== 'zh-CN' ? '↑ 2.20% vs yesterday' : '↑ 2.20% 较昨日'} tone="success" />
          </View>
          <View style={styles.rebateAmountRow}>
            <AppText style={styles.rebateCurrency} variant="largeNumber">$</AppText>
            <AppText style={styles.rebateMajor} variant="largeNumber">
              {formatCompactProfileNumber(rebateValue)}
            </AppText>
            <AppText style={styles.rebateMinor} variant="number">.09</AppText>
          </View>
          <View style={styles.rebateDetailStack}>
            <AppText tone="muted" variant="caption">
              {locale !== 'zh-CN' ? 'Settled value' : '结算金额'}
            </AppText>
            <AppText variant="number">{formatMoney(rebateValue, account.currency, 2, locale)}</AppText>
          </View>
        </View>
        <View style={styles.rebateInlineChart}>
          <MiniTrendLine color={colors.market.down.fg} />
        </View>
      </Card>

      <View style={styles.profileStatsGrid}>
        {statCards.map((item) => (
          <Card compact key={item.label} style={styles.profileStatCard}>
            <AppIconFrame
              backgroundTone={getIconFrameBackgroundTone(item.iconTone)}
              iconSizeVariant="md"
              name={item.icon}
              sizeVariant="lg"
              tone={item.iconTone}
            />
            <AppText variant="body">{item.label}</AppText>
            <AppText variant="title">{item.value}</AppText>
            <AppText tone="down" variant="caption">
              {locale !== 'zh-CN' ? '↑ 0.23% today' : '↑ 0.23% 今日'}
            </AppText>
          </Card>
        ))}
      </View>

      <Card compact style={styles.profileCard}>
        <ProfileCardHeader icon="icon.promotion.reward" iconTone="amber" title={t('discover.module.rewards.title')} />
        <View style={StyleSheet.flatten([styles.profileDivider, { backgroundColor: colors.border.subtle }])} />
        <View style={styles.rewardProfileBody}>
          <View style={styles.flex}>
            <AppText variant="body">{locale !== 'zh-CN' ? 'Total Rewards Value' : '总奖励价值'}</AppText>
            <View style={styles.rebateAmountRow}>
              <AppText style={styles.rebateCurrency} variant="largeNumber">$</AppText>
              <AppText style={styles.rebateMajor} variant="largeNumber">10</AppText>
              <AppText style={styles.rebateMinor} variant="number">.09</AppText>
            </View>
          </View>
          <GiftIllustration />
        </View>
        <View style={StyleSheet.flatten([styles.profileDivider, { backgroundColor: colors.border.subtle }])} />
        <AppText tone="muted" variant="body">
          {locale !== 'zh-CN' ? 'Participating in 3 Campaigns' : '正在参与 3 个活动'}
        </AppText>
      </Card>

      <Card compact style={styles.managerCard}>
        <ProfileAvatar id="alex" size={50} />
        <View style={styles.flex}>
          <AppText variant="body">{locale !== 'zh-CN' ? 'My Relationship Manager' : '我的客户经理'}</AppText>
          <AppText variant="subtitle">Alexander Smith</AppText>
        </View>
        <AppIconFrame name="icon.copy.community" sizeVariant="md" iconSize={20} tone="down" />
      </Card>

      <Card compact style={styles.profileMenuList}>
        <GlobalMenuList contained items={settingsRows} />
      </Card>

      <Card compact style={styles.profileMenuList}>
        <GlobalMenuList contained items={supportRows} />
      </Card>

      <ActionButton icon="icon.system.logout" label={t('auth.logout')} onPress={logout} tone="danger" variant="outline" />
    </>
  );
}

function ProfileEditSheetContent({
  nicknameDraftRef,
  nicknameErrorSetterRef,
}: {
  nicknameDraftRef: { current: string };
  nicknameErrorSetterRef: { current?: (error?: string) => void };
}) {
  const { locale, colors, profileAvatarId, profileNickname, profileNicknameLastChangedAt, setProfileAvatarId, t } = useProductSettings();
  const [nicknameDraft, setNicknameDraft] = useState(profileNickname);
  const [nicknameError, setNicknameError] = useState<string | undefined>();
  const nextAllowedAt = getNextNicknameChangeAt(profileNicknameLastChangedAt);
  const ruleText = nextAllowedAt && Date.now() < nextAllowedAt.getTime()
    ? t('auth.profile.nicknameRuleLocked', { date: formatProfileRuleDate(nextAllowedAt, locale) })
    : t('auth.profile.nicknameRule');

  useEffect(() => {
    nicknameErrorSetterRef.current = setNicknameError;

    return () => {
      if (nicknameErrorSetterRef.current === setNicknameError) {
        nicknameErrorSetterRef.current = undefined;
      }
    };
  }, [nicknameErrorSetterRef]);

  const chooseAvatar = (nextId: ProfileAvatarId) => {
    void impactLight();
    setProfileAvatarId(nextId);
  };
  const updateNickname = (value: string) => {
    const nextValue = value.slice(0, 24);

    nicknameDraftRef.current = nextValue;
    setNicknameDraft(nextValue);
    setNicknameError(undefined);
  };

  return (
    <View style={styles.profileEditSheet}>
      <View style={styles.profileEditHero}>
        <ProfileAvatar id={profileAvatarId} size={64} />
        <View style={styles.flex}>
          <AppText variant="subtitle">{normalizeProfileNickname(nicknameDraft) || t('auth.profile.noNickname')}</AppText>
          <AppText tone="muted" variant="caption">
            {t('auth.profile.editHint')}
          </AppText>
        </View>
      </View>
      <TextField
        error={nicknameError}
        helperText={ruleText}
        label={t('auth.profile.nickname')}
        onChangeText={updateNickname}
        placeholder={t('auth.profile.nicknamePlaceholder')}
        value={nicknameDraft}
      />
      <ScrollView contentContainerStyle={styles.avatarRail} horizontal showsHorizontalScrollIndicator={false}>
        {profileAvatarOptions.map((option) => {
          const selected = option.id === profileAvatarId;

          return (
            <Pressable
              accessibilityLabel={`${locale !== 'zh-CN' ? 'Choose avatar' : '选择头像'} ${option.name}`}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              key={option.id}
              onPress={() => chooseAvatar(option.id)}
              style={StyleSheet.flatten([
                styles.avatarRailItem,
                {
                  backgroundColor: selected ? `${colors.brand.fg}10` : colors.surface.panel,
                  borderColor: selected ? colors.brand.fg : colors.border.subtle,
                },
              ])}>
              <ProfileAvatar id={option.id} selected={selected} size={36} />
              <AppText numberOfLines={1} tone={selected ? 'brand' : 'muted'} variant="caption">
                {option.name}
              </AppText>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

function ProfileListCard({
  icon,
  iconTone,
  subtitle,
  title,
}: {
  icon: AppIconName;
  iconTone: IconTone;
  subtitle?: string;
  title: string;
}) {
  return (
    <Card compact style={styles.profileListCard}>
      <AppIconFrame
        backgroundTone={getIconFrameBackgroundTone(iconTone)}
        name={icon}
        sizeVariant="md"
        tone={iconTone}
      />
      <View style={styles.flex}>
        <AppText variant="subtitle">{title}</AppText>
        {subtitle ? (
          <AppText numberOfLines={1} tone="muted" variant="caption">
            {subtitle}
          </AppText>
        ) : null}
      </View>
      <AppIcon name="icon.system.chevron_right" size={size.icon.md} />
    </Card>
  );
}

function ProfileCardHeader({ icon, iconTone, title }: { icon: AppIconName; iconTone: IconTone; title: string }) {
  return (
    <View style={styles.profileCardHeader}>
      <AppIconFrame
        backgroundTone={getIconFrameBackgroundTone(iconTone)}
        name={icon}
        sizeVariant="md"
        tone={iconTone}
      />
      <AppText style={styles.profileCardTitle} variant="subtitle">
        {title}
      </AppText>
      <AppIcon name="icon.system.chevron_right" size={size.icon.md} />
    </View>
  );
}

function MiniTrendLine({ color }: { color: string }) {
  return (
    <View style={styles.trendLine}>
      <Sparkline color={color} edgeToEdge height={92} values={[2, 2.4, 3.2, 3, 4.6, 4.3, 3.4, 3.1, 4.2, 4, 4.4, 5.8, 6.5, 7.1]} width="100%" />
    </View>
  );
}

function GiftIllustration() {
  const { colors } = useProductSettings();

  return (
    <View style={styles.giftScene}>
      <View style={StyleSheet.flatten([styles.coin, styles.coinOne, { backgroundColor: `${colors.status.warning.fg}25` }])}>
        <AppText tone="amber" variant="eyebrow">$</AppText>
      </View>
      <View style={StyleSheet.flatten([styles.coin, styles.coinTwo, { backgroundColor: `${colors.status.warning.fg}25` }])}>
        <AppText tone="amber" variant="eyebrow">$</AppText>
      </View>
      <AppIconFrame name="icon.promotion.reward" sizeVariant="display" iconSizeVariant="xl" style={styles.giftBox} />
    </View>
  );
}

function MenuRatingStars() {
  return (
    <View style={styles.menuRatingStars}>
      {[0, 1, 2, 3, 4].map((item) => (
        <AppIcon key={item} name="icon.feedback.rating" size={size.icon.xs} />
      ))}
    </View>
  );
}

function formatCompactProfileNumber(value: number) {
  if (value >= 1000) {
    return `${Math.floor(value / 1000)}K`;
  }

  return String(Math.floor(value));
}

function getThemeModeLabel(themeMode: ReturnType<typeof useProductSettings>['themeMode'], resolvedThemeMode: ReturnType<typeof useProductSettings>['resolvedThemeMode'], locale: ReturnType<typeof useProductSettings>['locale']) {
  if (themeMode === 'system') {
    if (locale !== 'zh-CN') {
      return resolvedThemeMode === 'lightBroker' ? 'System · Light' : 'System · Dark';
    }

    return resolvedThemeMode === 'lightBroker' ? '跟随系统 · 浅色' : '跟随系统 · 深色';
  }

  if (locale !== 'zh-CN') {
    return themeMode === 'lightBroker' ? 'Light' : 'Dark';
  }

  return themeMode === 'lightBroker' ? '浅色' : '深色';
}

function OnboardingModule() {
  const { locale, colors } = useProductSettings();

  return (
    <Card>
      <View style={styles.timeline}>
        {dupoinOnboardingSteps.map((step, index) => (
          <View key={step.id} style={styles.timelineRow}>
            <View style={StyleSheet.flatten([styles.timelineMark, { backgroundColor: index < 2 ? colors.market.down.fg : colors.brand.fg, borderColor: index < 2 ? colors.market.down.fg : colors.brand.fg }])}>
              <AppText tone="white" variant="eyebrow">
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
      <ActionButton label={locale !== 'zh-CN' ? 'Continue opening account' : '继续开户'} onPress={() => router.push('/auth/onboarding' as never)} style={styles.cardAction} tone="brand" />
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
          <Metric label={locale !== 'zh-CN' ? 'Conversion' : '转化率'} tone="brand" value={formatPercent(partnerMetrics.conversionRate)} />
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
  const { locale, colors } = useProductSettings();
  const movers = [...instruments].sort((a, b) => Math.abs(getDisplayChange(b).changePercent) - Math.abs(getDisplayChange(a).changePercent)).slice(0, 4);

  return (
    <Card compact>
      {movers.map((instrument, index) => {
        const { changePercent } = getDisplayChange(instrument);
        const quoteVisual = getQuoteChangeVisual(changePercent, colors);

        return (
          <NativePressable
            accessibilityLabel={instrument.symbol}
            key={instrument.id}
            minTouch={64}
            onPress={() => router.push(`/instrument/${instrument.id}` as never)}
            style={StyleSheet.flatten([styles.instrumentRow, index < movers.length - 1 && { borderBottomColor: colors.border.subtle, borderBottomWidth: lineWidth.hairline }])}>
            <InstrumentIcon instrument={instrument} size={36} />
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
        <ActionButton label={locale !== 'zh-CN' ? 'Open account list' : '打开账户列表'} onPress={() => router.push('/accounts' as never)} style={styles.cardAction} tone="neutral" />
      </Card>
    </>
  );
}

function SupportModule() {
  const { locale, colors, t } = useProductSettings();
  const toast = useToast();
  const rows = [
    [t('top.support'), locale !== 'zh-CN' ? 'Online help desk' : '在线帮助中心'],
    [t('top.notifications'), locale !== 'zh-CN' ? 'Account and service alerts' : '账户与服务通知'],
    [locale !== 'zh-CN' ? 'Service status' : '服务状态', locale !== 'zh-CN' ? 'Quote proxy and demo workspace' : '报价代理与演示工作台'],
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
        style={styles.cardAction}
        tone="neutral"
      />
    </Card>
  );
}

function RewardsModule() {
  const { locale, colors } = useProductSettings();
  const missions = [
    [locale !== 'zh-CN' ? 'Watchlist' : '自选任务', '75%'],
    [locale !== 'zh-CN' ? 'First order' : '首单任务', '40%'],
    [locale !== 'zh-CN' ? 'Risk quiz' : '风险测验', '100%'],
  ] as const satisfies readonly (readonly [string, DimensionValue])[];

  return (
    <Card>
      <View style={styles.rewardHeader}>
        <Metric label={locale !== 'zh-CN' ? 'Demo credits' : '模拟体验金'} tone="amber" value="$2K" />
        <Metric label={locale !== 'zh-CN' ? 'Badges' : '徽章'} tone="brand" value="6" />
      </View>
      <View style={styles.rewardList}>
        {missions.map(([label, value]) => (
          <View key={label} style={styles.rewardRow}>
            <AppText variant="body">{label}</AppText>
            <View style={StyleSheet.flatten([styles.rewardProgressTrack, { backgroundColor: colors.border.subtle }])}>
              <View style={StyleSheet.flatten([styles.rewardProgressFill, { backgroundColor: colors.brand.fg, width: value }])} />
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
  const { colors } = useProductSettings();

  return (
    <View style={StyleSheet.flatten([styles.detailRow, { borderBottomColor: colors.border.subtle }])}>
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

function getModuleMeta(moduleId: DiscoverModuleId) {
  const meta: Record<DiscoverModuleId, { icon: AppIconName; tone: IconTone }> = {
    accounts: { icon: 'icon.account.trading', tone: 'blue' },
    challenge: { icon: 'icon.promotion.achievement', tone: 'amber' },
    community: { icon: 'icon.copy.community', tone: 'textMuted' },
    education: { icon: 'icon.education.academy', tone: 'brand' },
    markets: { icon: 'icon.trading.market', tone: 'up' },
    onboarding: { icon: 'icon.kyc.identity', tone: 'down' },
    partner: { icon: 'icon.ib.network', tone: 'brand' },
    profile: { icon: 'icon.account.avatar', tone: 'text' },
    rewards: { icon: 'icon.promotion.reward', tone: 'amber' },
    support: { icon: 'icon.support.headset', tone: 'textMuted' },
  };

  return meta[moduleId];
}

function resolvePaletteIconTone(colors: ThemeColors, tone: IconTone) {
  return resolveThemeTone(colors, tone);
}

function normalizeProfileNickname(value: string) {
  return value.trim().replace(/\s+/g, ' ');
}

function getNextNicknameChangeAt(lastChangedAt?: string) {
  if (!lastChangedAt) {
    return null;
  }

  const lastChangedTime = new Date(lastChangedAt).getTime();

  if (!Number.isFinite(lastChangedTime)) {
    return null;
  }

  return new Date(lastChangedTime + NICKNAME_CHANGE_INTERVAL_MS);
}

function formatProfileRuleDate(date: Date, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function getIconFrameBackgroundTone(tone: IconTone): AppIconFrameBackgroundTone {
  switch (tone) {
    case 'amber':
    case 'warning':
      return 'warning';
    case 'blue':
    case 'info':
      return 'info';
    case 'danger':
      return 'danger';
    case 'down':
    case 'success':
      return 'success';
    case 'up':
      return 'up';
    case 'brand':
      return 'brand';
    case 'disabled':
      return 'disabled';
    default:
      return 'neutral';
  }
}

const styles = StyleSheet.create({
  avatarEditBadge: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: lineWidth.selected,
    bottom: -1,
    height: size.iconFrame.xs,
    justifyContent: 'center',
    position: 'absolute',
    right: -2,
    width: size.iconFrame.xs,
  },
  avatarRail: {
    gap: 8,
    paddingHorizontal: 2,
    paddingRight: 16,
  },
  avatarRailItem: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: lineWidth.hairline,
    flexDirection: 'row',
    gap: 6,
    minHeight: 46,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  avatarPressable: {
    height: 64,
    justifyContent: 'center',
    position: 'relative',
    width: 64,
    zIndex: 2,
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
    borderBottomWidth: lineWidth.hairline,
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
    height: 72,
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
  insightList: {
    gap: 2,
  },
  insightRow: {
    alignItems: 'flex-start',
    borderTopWidth: lineWidth.hairline,
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
  managerCard: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    minHeight: 78,
  },
  modulePill: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: lineWidth.hairline,
    gap: 7,
    minWidth: 82,
    padding: 10,
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
    ...typography.quote,
  },
  rebateMajor: {
    ...typography.quoteLg,
  },
  rebateMinor: {
    ...typography.displayXl,
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
    height: lineWidth.hairline,
  },
  rebateCompactBlock: {
    alignItems: 'flex-start',
    gap: spacing.xs,
  },
  rebateDetailStack: {
    alignItems: 'flex-start',
    gap: 2,
    marginTop: spacing.xs,
  },
  rebateInlineChart: {
    minHeight: 96,
    overflow: 'hidden',
    paddingTop: spacing.sm,
  },
  rebateMetricHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
  profileEditHero: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  profileEditSheet: {
    gap: 16,
  },
  profileHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    minHeight: 88,
  },
  profileIdentity: {
    flex: 1,
    gap: spacing.xs,
    justifyContent: 'center',
    minWidth: 0,
  },
  profileMenuList: {
    paddingVertical: 0,
  },
  profileListCard: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    minHeight: 70,
  },
  profileNameRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  profileStatCard: {
    flex: 1,
    gap: 7,
    minHeight: 126,
    minWidth: 0,
  },
  profileStatsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  profileTag: {
    alignSelf: 'flex-start',
    flexShrink: 1,
    minWidth: 0,
  },
  profileTagRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    width: '100%',
  },
  sparklineWrap: {
    alignItems: 'center',
    marginVertical: 14,
    overflow: 'hidden',
  },
  menuRatingStars: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 1,
  },
  timeline: {
    gap: 12,
  },
  timelineMark: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: lineWidth.hairline,
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
    minHeight: 92,
    overflow: 'hidden',
    width: '100%',
  },
  verifiedBadge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 4,
    borderWidth: lineWidth.hairline,
    flexDirection: 'row',
    gap: 3,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
});
