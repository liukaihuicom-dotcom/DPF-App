import { router, type Href } from 'expo-router';
import { useMemo, useState } from 'react';
import { Platform, ScrollView, StyleSheet, View, type DimensionValue } from 'react-native';

import {
  buildTradingAccountProfiles,
  tradingAccountCountPresets,
  tradingAccountDataPresets,
  tradingAccountStatusPresets,
  type TradingAccountCountPreset,
  type TradingAccountDataPreset,
  type TradingAccountScenario,
  type TradingAccountStatusPreset,
} from '@/src/domain/accountProfiles';
import { formatNumber } from '@/src/domain/format';
import type { AuthStatus, DiscoverModuleId, Role, TradingAccountUsageOverride, TradingAccountUsageStatus, UpgradeStatus } from '@/src/domain/types';
import { localeOptions, type TranslationKey } from '@/src/i18n/translations';
import { useToast } from '@/src/feedback/Toast';
import { impactLight, notifySuccess, notifyWarning } from '@/src/feedback/haptics';
import { useProductSettings } from '@/src/settings/ProductSettings';
import { useBroker } from '@/src/state/BrokerStore';
import { themePalettes, type ThemeMode } from '@/src/theme/colors';

import { NativePressable } from './NativePressable';
import { PhosphorIcon, type PhosphorIconName } from './PhosphorIcon';
import { AppText } from './Typography';

type ConsoleScreen =
  | { name: 'home' }
  | { name: 'pages' }
  | { name: 'pageDetail'; routeLabel: string }
  | { name: 'state' }
  | { name: 'partner' }
  | { name: 'runtime' };

type PageConsoleGroup = 'markets' | 'trading' | 'accounts' | 'growth' | 'auth';

type PageConsoleEntry = {
  gapKey: TranslationKey;
  group: PageConsoleGroup;
  icon: PhosphorIconName;
  interactionsKey: TranslationKey;
  moduleKey: TranslationKey;
  rolesKey: TranslationKey;
  route: Href;
  routeLabel: string;
  scenarioKey: TranslationKey;
  stateKeys: TranslationKey[];
  titleKey: TranslationKey;
  tone: 'amber' | 'blue' | 'brand' | 'cyan' | 'danger' | 'down' | 'up';
};

const themeModes = Object.keys(themePalettes) as ThemeMode[];
const authStatuses: AuthStatus[] = ['guest', 'signedIn'];
const roles: Role[] = ['trader', 'partner'];
const tradingAccountScenarios: TradingAccountScenario[] = ['default', 'stateAnalysis'];
const tradingAccountUsageOverrides: TradingAccountUsageOverride[] = ['auto', 'normal', 'warning', 'abnormal'];
const discoverModuleIds: DiscoverModuleId[] = ['challenge', 'education', 'community', 'profile', 'onboarding', 'partner', 'markets', 'accounts', 'support', 'rewards'];
const upgradeStatuses: UpgradeStatus[] = ['none', 'pending', 'approved', 'rejected'];
const pageGroups: PageConsoleGroup[] = ['markets', 'trading', 'accounts', 'growth', 'auth'];
const tradingAccountCountPresetLabels: Record<TradingAccountCountPreset, TranslationKey> = {
  scenario: 'control.tradingAccount.countPreset.scenario',
  seven: 'control.tradingAccount.countPreset.seven',
  single: 'control.tradingAccount.countPreset.single',
  three: 'control.tradingAccount.countPreset.three',
  twelve: 'control.tradingAccount.countPreset.twelve',
};
const tradingAccountDataPresetLabels: Record<TradingAccountDataPreset, TranslationKey> = {
  balanced: 'control.tradingAccount.dataPreset.balanced',
  drawdown: 'control.tradingAccount.dataPreset.drawdown',
  marginStress: 'control.tradingAccount.dataPreset.marginStress',
  noActivity: 'control.tradingAccount.dataPreset.noActivity',
  scenario: 'control.tradingAccount.dataPreset.scenario',
};
const tradingAccountStatusPresetLabels: Record<TradingAccountStatusPreset, TranslationKey> = {
  active: 'control.tradingAccount.statusPreset.active',
  archived: 'control.tradingAccount.statusPreset.archived',
  demo: 'control.tradingAccount.statusPreset.demo',
  disabled: 'control.tradingAccount.statusPreset.disabled',
  mixed: 'control.tradingAccount.statusPreset.mixed',
  readOnly: 'control.tradingAccount.statusPreset.readOnly',
  scenario: 'control.tradingAccount.statusPreset.scenario',
};
const webSelectStyle = {
  appearance: 'none',
  background: 'transparent',
  border: 0,
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontSize: 13,
  height: '100%',
  outline: 'none',
  width: '100%',
} as const;

export function ProductControlPanel() {
  const [open, setOpen] = useState(false);
  const [screen, setScreen] = useState<ConsoleScreen>({ name: 'home' });
  const {
    authStatus,
    locale,
    palette,
    role,
    selectedDiscoverModuleId,
    setAuthStatus,
    setLocale,
    setRole,
    setSelectedDiscoverModule,
    setThemeMode,
    setTradingAccountCountPreset,
    setTradingAccountDataPreset,
    setTradingAccountScenario,
    setTradingAccountStatusPreset,
    setTradingAccountUsageOverride,
    t,
    themeMode,
    tradingAccountCountPreset,
    tradingAccountDataPreset,
    tradingAccountScenario,
    tradingAccountStatusPreset,
    tradingAccountUsageOverride,
  } = useProductSettings();
  const { account, approveUpgradeRequest, instruments, orders, positions, quoteStatus, rejectUpgradeRequest, submitUpgradeRequest, upgradeRequest } = useBroker();
  const toast = useToast();
  const anchor = instruments.find((instrument) => instrument.symbol === 'EUR/USD') ?? instruments[0];
  const pageEntries = useMemo(() => buildPageEntries(anchor?.id ?? 'eur-usd'), [anchor?.id]);
  const selectedEntry = screen.name === 'pageDetail' ? pageEntries.find((entry) => entry.routeLabel === screen.routeLabel) : undefined;
  const automaticTradingStatus = getAutomaticTradingUsageStatus({ authStatus, quoteStatus });
  const effectiveTradingStatus = tradingAccountUsageOverride === 'auto' ? automaticTradingStatus : tradingAccountUsageOverride;
  const tradingAccounts = buildTradingAccountProfiles(account, positions, tradingAccountScenario, {
    countPreset: tradingAccountCountPreset,
    dataPreset: tradingAccountDataPreset,
    statusPreset: tradingAccountStatusPreset,
  });
  const tradableAccountCount = tradingAccounts.filter((item) => item.group === 'active' || item.group === 'demo').length;
  const roleLabel = role === 'partner' ? t('role.partner') : t('role.trader');
  const authLabel = t(`auth.status.${authStatus}`);

  const applyUpgradeStatus = (status: UpgradeStatus) => {
    if (status === 'pending') {
      submitUpgradeRequest(t('upgrade.defaultReason'));
      void notifySuccess();
      toast.show({ message: t('upgrade.pendingHint'), title: t('upgrade.submitted'), tone: 'success' });
      return;
    }

    if (status === 'approved') {
      if (upgradeRequest.status === 'none' || upgradeRequest.status === 'rejected') {
        submitUpgradeRequest(t('upgrade.defaultReason'));
      }
      approveUpgradeRequest(upgradeRequest.applicantClientId);
      void notifySuccess();
      toast.show({ message: t('control.simulator.partner.approvedBody'), title: t('control.simulator.partner.approvedTitle'), tone: 'success' });
      return;
    }

    if (status === 'rejected') {
      if (upgradeRequest.status === 'none') {
        submitUpgradeRequest(t('upgrade.defaultReason'));
      }
      rejectUpgradeRequest(upgradeRequest.applicantClientId);
      void notifyWarning();
      toast.show({ message: t('upgrade.status.rejected'), title: t('control.pageConsole.partnerState'), tone: 'warning' });
      return;
    }

    void notifyWarning();
    toast.show({ message: t('control.pageConsole.partnerNoneBody'), title: t('control.pageConsole.partnerState'), tone: 'warning' });
  };

  const closePanel = () => {
    setOpen(false);
    setScreen({ name: 'home' });
  };

  if (Platform.OS !== 'web') {
    return null;
  }

  return (
    <View style={styles.host}>
      {open ? (
        <View style={StyleSheet.flatten([styles.panel, { backgroundColor: palette.panelHigh, borderColor: palette.line }])}>
          <PanelHeader
            entry={selectedEntry}
            onBack={() => setScreen(screen.name === 'pageDetail' ? { name: 'pages' } : { name: 'home' })}
            onClose={closePanel}
            screen={screen}
          />
          <ScrollView contentContainerStyle={styles.panelContent} showsVerticalScrollIndicator={false}>
            {screen.name === 'home' ? (
              <>
                <View style={styles.preferencePanel}>
                  <View style={styles.sectionHeader}>
                    <AppText variant="subtitle">{t('control.pageConsole.menu.preferences')}</AppText>
                    <AppText numberOfLines={2} tone="dim" variant="caption">
                      {t('control.pageConsole.menu.preferencesHint')}
                    </AppText>
                  </View>
                  <View style={styles.formGrid}>
                    <ControlSelect
                      icon="sliders-horizontal"
                      label={t('control.theme')}
                      onChange={(value) => setThemeMode(value as ThemeMode)}
                      options={themeModes.map((item) => ({ label: t(`theme.${item}`), value: item }))}
                      value={themeMode}
                    />
                    <ControlSelect
                      icon="globe"
                      label={t('control.language')}
                      onChange={(value) => setLocale(value as typeof locale)}
                      options={localeOptions.map((item) => ({ label: item.label, value: item.value }))}
                      value={locale}
                    />
                  </View>
                </View>

                <SnapshotStrip
                  items={[
                    { label: t('control.accountStatus'), value: authLabel },
                    { label: t('control.pageConsole.rolePreset'), value: roleLabel },
                    { label: t('control.pageConsole.quoteState'), value: quoteStatus },
                  ]}
                />

                <View style={styles.menuList}>
                  <MenuRow
                    description={t('control.pageConsole.menu.pagesBody')}
                    icon="list-checks"
                    meta={t('control.pageConsole.menu.pagesMeta')}
                    onPress={() => setScreen({ name: 'pages' })}
                    title={t('control.pageConsole.menu.pages')}
                    tone={palette.brand}
                  />
                  <MenuRow
                    description={t('control.pageConsole.menu.stateBody')}
                    icon="sliders-horizontal"
                    meta={`${authLabel} / ${roleLabel}`}
                    onPress={() => setScreen({ name: 'state' })}
                    title={t('control.pageConsole.menu.state')}
                    tone={palette.blue}
                  />
                  <MenuRow
                    description={t('control.pageConsole.menu.partnerBody')}
                    icon="share-network"
                    meta={t(`upgrade.status.${upgradeRequest.status}`)}
                    onPress={() => setScreen({ name: 'partner' })}
                    title={t('control.pageConsole.menu.partner')}
                    tone={palette.amber}
                  />
                  <MenuRow
                    description={t('control.tradingAccount.managementHint')}
                    icon="shield-check"
                    meta={formatNumber(tradingAccounts.length, 0, locale)}
                    onPress={() => setScreen({ name: 'runtime' })}
                    title={t('control.tradingAccount.management')}
                    tone={palette.cyan}
                  />
                </View>
              </>
            ) : null}

            {screen.name === 'pages' ? (
              <View style={styles.menuList}>
                {pageGroups.map((group) => (
                  <View key={group} style={styles.groupBlock}>
                    <AppText tone="dim" variant="eyebrow">
                      {t(`control.pageConsole.group.${group}`)}
                    </AppText>
                    {pageEntries
                      .filter((entry) => entry.group === group)
                      .map((entry) => (
                        <PageMenuRow entry={entry} key={entry.routeLabel} onPress={() => setScreen({ name: 'pageDetail', routeLabel: entry.routeLabel })} />
                      ))}
                  </View>
                ))}
              </View>
            ) : null}

            {screen.name === 'pageDetail' && selectedEntry ? <PageDetail entry={selectedEntry} onClose={closePanel} /> : null}

            {screen.name === 'state' ? (
              <View style={styles.detailStack}>
                <View style={styles.sectionHeader}>
                  <AppText variant="subtitle">{t('control.pageConsole.stateControls')}</AppText>
                  <AppText numberOfLines={2} tone="dim" variant="caption">
                    {t('control.pageConsole.stateControlsHint')}
                  </AppText>
                </View>
                <View style={styles.formGrid}>
                  <ControlSelect
                    icon="user"
                    label={t('control.accountStatus')}
                    onChange={(value) => setAuthStatus(value as AuthStatus)}
                    options={authStatuses.map((item) => ({ label: t(`auth.status.${item}`), value: item }))}
                    value={authStatus}
                  />
                  <ControlSelect
                    icon="share-network"
                    label={t('control.pageConsole.rolePreset')}
                    onChange={(value) => setRole(value as Role)}
                    options={roles.map((item) => ({ label: item === 'partner' ? t('role.partner') : t('role.trader'), value: item }))}
                    value={role}
                  />
                  <ControlSelect
                    icon="bank"
                    label={t('control.tradingScenario')}
                    onChange={(value) => setTradingAccountScenario(value as TradingAccountScenario)}
                    options={tradingAccountScenarios.map((item) => ({ label: t(`control.tradingScenario.${item}`), value: item }))}
                    value={tradingAccountScenario}
                  />
                  <ControlSelect
                    icon="bank"
                    label={t('control.tradingAccount.statusPreset')}
                    onChange={(value) => setTradingAccountStatusPreset(value as TradingAccountStatusPreset)}
                    options={tradingAccountStatusPresets.map((item) => ({ label: t(tradingAccountStatusPresetLabels[item]), value: item }))}
                    value={tradingAccountStatusPreset}
                  />
                  <ControlSelect
                    icon="list-checks"
                    label={t('control.tradingAccount.countPreset')}
                    onChange={(value) => setTradingAccountCountPreset(value as TradingAccountCountPreset)}
                    options={tradingAccountCountPresets.map((item) => ({ label: t(tradingAccountCountPresetLabels[item]), value: item }))}
                    value={tradingAccountCountPreset}
                  />
                  <ControlSelect
                    icon="chart-line-up"
                    label={t('control.tradingAccount.dataPreset')}
                    onChange={(value) => setTradingAccountDataPreset(value as TradingAccountDataPreset)}
                    options={tradingAccountDataPresets.map((item) => ({ label: t(tradingAccountDataPresetLabels[item]), value: item }))}
                    value={tradingAccountDataPreset}
                  />
                  <ControlSelect
                    icon="shield-check"
                    label={t('control.tradingUsage.selectLabel')}
                    onChange={(value) => setTradingAccountUsageOverride(value as TradingAccountUsageOverride)}
                    options={tradingAccountUsageOverrides.map((item) => ({ label: t(`control.tradingUsage.override.${item}`), value: item }))}
                    value={tradingAccountUsageOverride}
                  />
                  <ControlSelect
                    icon="compass"
                    label={t('control.pageConsole.discoverModule')}
                    onChange={(value) => setSelectedDiscoverModule(value as DiscoverModuleId)}
                    options={discoverModuleIds.map((item) => ({ label: t(`discover.module.${item}.short`), value: item }))}
                    value={selectedDiscoverModuleId}
                  />
                </View>
              </View>
            ) : null}

            {screen.name === 'partner' ? (
              <View style={styles.detailStack}>
                <View style={styles.sectionHeader}>
                  <AppText variant="subtitle">{t('control.pageConsole.partnerState')}</AppText>
                  <AppText numberOfLines={2} tone="dim" variant="caption">
                    {t('control.pageConsole.partnerHint')}
                  </AppText>
                </View>
                <SnapshotStrip items={[{ label: t('control.pageConsole.currentState'), value: t(`upgrade.status.${upgradeRequest.status}`) }]} />
                <View style={styles.partnerButtons}>
                  {upgradeStatuses.map((status) => (
                    <NativePressable
                      accessibilityRole="button"
                      key={status}
                      minTouch={40}
                      onPress={() => applyUpgradeStatus(status)}
                      style={StyleSheet.flatten([
                        styles.partnerButton,
                        {
                          backgroundColor: upgradeRequest.status === status ? `${palette.brand}16` : palette.panel,
                          borderColor: upgradeRequest.status === status ? palette.brand : palette.lineSoft,
                        },
                      ])}>
                      <AppText numberOfLines={1} tone={upgradeRequest.status === status ? 'brand' : 'muted'} variant="caption">
                        {t(`upgrade.status.${status}`)}
                      </AppText>
                    </NativePressable>
                  ))}
                </View>
              </View>
            ) : null}

            {screen.name === 'runtime' ? (
              <View style={styles.detailStack}>
                <View style={styles.sectionHeader}>
                  <AppText variant="subtitle">{t('control.tradingAccount.management')}</AppText>
                  <AppText numberOfLines={2} tone="dim" variant="caption">
                    {t('control.tradingAccount.managementHint')}
                  </AppText>
                </View>
                <View style={styles.formGrid}>
                  <ControlSelect
                    icon="bank"
                    label={t('control.tradingAccount.statusPreset')}
                    onChange={(value) => setTradingAccountStatusPreset(value as TradingAccountStatusPreset)}
                    options={tradingAccountStatusPresets.map((item) => ({ label: t(tradingAccountStatusPresetLabels[item]), value: item }))}
                    value={tradingAccountStatusPreset}
                  />
                  <ControlSelect
                    icon="list-checks"
                    label={t('control.tradingAccount.countPreset')}
                    onChange={(value) => setTradingAccountCountPreset(value as TradingAccountCountPreset)}
                    options={tradingAccountCountPresets.map((item) => ({ label: t(tradingAccountCountPresetLabels[item]), value: item }))}
                    value={tradingAccountCountPreset}
                  />
                  <ControlSelect
                    icon="chart-line-up"
                    label={t('control.tradingAccount.dataPreset')}
                    onChange={(value) => setTradingAccountDataPreset(value as TradingAccountDataPreset)}
                    options={tradingAccountDataPresets.map((item) => ({ label: t(tradingAccountDataPresetLabels[item]), value: item }))}
                    value={tradingAccountDataPreset}
                  />
                  <ControlSelect
                    icon="shield-check"
                    label={t('control.tradingUsage.selectLabel')}
                    onChange={(value) => setTradingAccountUsageOverride(value as TradingAccountUsageOverride)}
                    options={tradingAccountUsageOverrides.map((item) => ({ label: t(`control.tradingUsage.override.${item}`), value: item }))}
                    value={tradingAccountUsageOverride}
                  />
                </View>
                <View style={styles.summaryGrid}>
                  <ConsoleMetric label={t('control.tradingUsage.accountId')} value={account.accountId} />
                  <ConsoleMetric label={t('control.tradingAccount.totalAccounts')} value={formatNumber(tradingAccounts.length, 0, locale)} />
                  <ConsoleMetric label={t('control.tradingAccount.tradableAccounts')} value={formatNumber(tradableAccountCount, 0, locale)} />
                  <ConsoleMetric label={t('control.tradingUsage.positions')} value={formatNumber(positions.length, 0, locale)} />
                  <ConsoleMetric label={t('control.tradingUsage.orders')} value={formatNumber(orders.length, 0, locale)} />
                  <ConsoleMetric label={t('control.pageConsole.quoteState')} value={quoteStatus} />
                  <ConsoleMetric label={t('control.tradingUsage.selectLabel')} value={t(`control.tradingUsage.status.${effectiveTradingStatus}`)} />
                  <ConsoleMetric label={t('control.tradingAccount.statusPreset')} value={t(tradingAccountStatusPresetLabels[tradingAccountStatusPreset])} />
                  <ConsoleMetric label={t('control.tradingAccount.dataPreset')} value={t(tradingAccountDataPresetLabels[tradingAccountDataPreset])} />
                </View>
              </View>
            ) : null}
          </ScrollView>
        </View>
      ) : null}

      <NativePressable
        accessibilityLabel={t('control.pageConsole.title')}
        accessibilityRole="button"
        minTouch={48}
        onPress={() => setOpen((value) => !value)}
        style={StyleSheet.flatten([styles.fab, { backgroundColor: palette.panelHigh, borderColor: palette.brand }])}>
        <PhosphorIcon color={palette.brand} name="sliders-horizontal" size={20} />
      </NativePressable>
    </View>
  );
}

function PanelHeader({
  entry,
  onBack,
  onClose,
  screen,
}: {
  entry?: PageConsoleEntry;
  onBack: () => void;
  onClose: () => void;
  screen: ConsoleScreen;
}) {
  const { palette, t } = useProductSettings();
  const title =
    screen.name === 'home'
      ? t('control.pageConsole.title')
      : screen.name === 'pages'
        ? t('control.pageConsole.menu.pages')
        : screen.name === 'state'
          ? t('control.pageConsole.menu.state')
          : screen.name === 'partner'
            ? t('control.pageConsole.menu.partner')
            : screen.name === 'runtime'
              ? t('control.tradingAccount.management')
              : entry
                ? t(entry.titleKey)
                : t('control.pageConsole.view.pageDetail');

  return (
    <View style={StyleSheet.flatten([styles.panelTop, { borderBottomColor: palette.lineSoft }])}>
      {screen.name !== 'home' ? (
        <NativePressable accessibilityLabel={t('top.back')} accessibilityRole="button" minTouch={36} onPress={onBack} style={styles.headerIconButton}>
          <PhosphorIcon color={palette.textMuted} name="caret-left" size={16} />
        </NativePressable>
      ) : null}
      <View style={styles.titleBlock}>
        <AppText tone="dim" variant="eyebrow">
          {t('control.pageConsole.eyebrow')}
        </AppText>
        <AppText numberOfLines={1} variant="subtitle">
          {title}
        </AppText>
      </View>
      <NativePressable accessibilityLabel={t('common.cancel')} accessibilityRole="button" minTouch={36} onPress={onClose} style={styles.headerIconButton}>
        <PhosphorIcon color={palette.textMuted} name="x" size={16} />
      </NativePressable>
    </View>
  );
}

function buildPageEntries(anchorId: string): PageConsoleEntry[] {
  return [
    {
      gapKey: 'control.pageConsole.page.home.gap',
      group: 'markets',
      icon: 'chart-line-up',
      interactionsKey: 'control.pageConsole.page.home.interactions',
      moduleKey: 'control.pageConsole.module.markets',
      rolesKey: 'control.pageConsole.roles.traderPartner',
      route: '/',
      routeLabel: '/',
      scenarioKey: 'control.pageConsole.page.home.scenario',
      stateKeys: ['control.pageConsole.state.default', 'control.pageConsole.state.quote', 'control.pageConsole.state.failed'],
      titleKey: 'control.pageConsole.page.home.title',
      tone: 'brand',
    },
    {
      gapKey: 'control.pageConsole.page.instrument.gap',
      group: 'markets',
      icon: 'ticket',
      interactionsKey: 'control.pageConsole.page.instrument.interactions',
      moduleKey: 'control.pageConsole.module.markets',
      rolesKey: 'control.pageConsole.roles.traderPartner',
      route: `/instrument/${anchorId}` as Href,
      routeLabel: '/instrument/[id]',
      scenarioKey: 'control.pageConsole.page.instrument.scenario',
      stateKeys: ['control.pageConsole.state.default', 'control.pageConsole.state.invalid', 'control.pageConsole.state.quote'],
      titleKey: 'control.pageConsole.page.instrument.title',
      tone: 'cyan',
    },
    {
      gapKey: 'control.pageConsole.page.trade.gap',
      group: 'trading',
      icon: 'list-checks',
      interactionsKey: 'control.pageConsole.page.trade.interactions',
      moduleKey: 'control.pageConsole.module.trading',
      rolesKey: 'control.pageConsole.roles.traderPartner',
      route: '/trade',
      routeLabel: '/trade',
      scenarioKey: 'control.pageConsole.page.trade.scenario',
      stateKeys: ['control.pageConsole.state.default', 'control.pageConsole.state.empty', 'control.pageConsole.state.permission'],
      titleKey: 'control.pageConsole.page.trade.title',
      tone: 'up',
    },
    {
      gapKey: 'control.pageConsole.page.order.gap',
      group: 'trading',
      icon: 'arrows-left-right',
      interactionsKey: 'control.pageConsole.page.order.interactions',
      moduleKey: 'control.pageConsole.module.trading',
      rolesKey: 'control.pageConsole.roles.trader',
      route: `/order/${anchorId}?direction=buy` as Href,
      routeLabel: '/order/[id]',
      scenarioKey: 'control.pageConsole.page.order.scenario',
      stateKeys: ['control.pageConsole.state.inputting', 'control.pageConsole.state.disabled', 'control.pageConsole.state.success'],
      titleKey: 'control.pageConsole.page.order.title',
      tone: 'up',
    },
    {
      gapKey: 'control.pageConsole.page.accounts.gap',
      group: 'accounts',
      icon: 'bank',
      interactionsKey: 'control.pageConsole.page.accounts.interactions',
      moduleKey: 'control.pageConsole.module.accounts',
      rolesKey: 'control.pageConsole.roles.traderPartner',
      route: '/accounts',
      routeLabel: '/accounts',
      scenarioKey: 'control.pageConsole.page.accounts.scenario',
      stateKeys: ['control.pageConsole.state.default', 'control.pageConsole.state.empty', 'control.pageConsole.state.permission'],
      titleKey: 'control.pageConsole.page.accounts.title',
      tone: 'blue',
    },
    {
      gapKey: 'control.pageConsole.page.accountDetails.gap',
      group: 'accounts',
      icon: 'user-circle',
      interactionsKey: 'control.pageConsole.page.accountDetails.interactions',
      moduleKey: 'control.pageConsole.module.accounts',
      rolesKey: 'control.pageConsole.roles.trader',
      route: '/account-details/demo-main',
      routeLabel: '/account-details/[id]',
      scenarioKey: 'control.pageConsole.page.accountDetails.scenario',
      stateKeys: ['control.pageConsole.state.default', 'control.pageConsole.state.invalid', 'control.pageConsole.state.restricted'],
      titleKey: 'control.pageConsole.page.accountDetails.title',
      tone: 'blue',
    },
    {
      gapKey: 'control.pageConsole.page.discover.gap',
      group: 'growth',
      icon: 'compass',
      interactionsKey: 'control.pageConsole.page.discover.interactions',
      moduleKey: 'control.pageConsole.module.discover',
      rolesKey: 'control.pageConsole.roles.traderPartner',
      route: '/discover',
      routeLabel: '/discover',
      scenarioKey: 'control.pageConsole.page.discover.scenario',
      stateKeys: ['control.pageConsole.state.default', 'control.pageConsole.state.selected', 'control.pageConsole.state.placeholder'],
      titleKey: 'control.pageConsole.page.discover.title',
      tone: 'brand',
    },
    {
      gapKey: 'control.pageConsole.page.partnerTools.gap',
      group: 'growth',
      icon: 'share-network',
      interactionsKey: 'control.pageConsole.page.partnerTools.interactions',
      moduleKey: 'control.pageConsole.module.partner',
      rolesKey: 'control.pageConsole.roles.partner',
      route: '/partner-tools',
      routeLabel: '/partner-tools',
      scenarioKey: 'control.pageConsole.page.partnerTools.scenario',
      stateKeys: ['control.pageConsole.state.default', 'control.pageConsole.state.permission', 'control.pageConsole.state.placeholder'],
      titleKey: 'control.pageConsole.page.partnerTools.title',
      tone: 'amber',
    },
    {
      gapKey: 'control.pageConsole.page.clientProfile.gap',
      group: 'growth',
      icon: 'identification-card',
      interactionsKey: 'control.pageConsole.page.clientProfile.interactions',
      moduleKey: 'control.pageConsole.module.partner',
      rolesKey: 'control.pageConsole.roles.partner',
      route: '/client/client-001',
      routeLabel: '/client/[id]',
      scenarioKey: 'control.pageConsole.page.clientProfile.scenario',
      stateKeys: ['control.pageConsole.state.default', 'control.pageConsole.state.reviewing', 'control.pageConsole.state.invalid'],
      titleKey: 'control.pageConsole.page.clientProfile.title',
      tone: 'amber',
    },
    {
      gapKey: 'control.pageConsole.page.onboarding.gap',
      group: 'auth',
      icon: 'globe',
      interactionsKey: 'control.pageConsole.page.onboarding.interactions',
      moduleKey: 'control.pageConsole.module.auth',
      rolesKey: 'control.pageConsole.roles.guest',
      route: '/auth/onboarding',
      routeLabel: '/auth/onboarding',
      scenarioKey: 'control.pageConsole.page.onboarding.scenario',
      stateKeys: ['control.pageConsole.state.default', 'control.pageConsole.state.permission', 'control.pageConsole.state.restricted'],
      titleKey: 'control.pageConsole.page.onboarding.title',
      tone: 'cyan',
    },
    {
      gapKey: 'control.pageConsole.page.login.gap',
      group: 'auth',
      icon: 'lock',
      interactionsKey: 'control.pageConsole.page.login.interactions',
      moduleKey: 'control.pageConsole.module.auth',
      rolesKey: 'control.pageConsole.roles.guest',
      route: '/auth',
      routeLabel: '/auth',
      scenarioKey: 'control.pageConsole.page.login.scenario',
      stateKeys: ['control.pageConsole.state.inputting', 'control.pageConsole.state.failed', 'control.pageConsole.state.success'],
      titleKey: 'control.pageConsole.page.login.title',
      tone: 'danger',
    },
    {
      gapKey: 'control.pageConsole.page.register.gap',
      group: 'auth',
      icon: 'user-plus',
      interactionsKey: 'control.pageConsole.page.register.interactions',
      moduleKey: 'control.pageConsole.module.auth',
      rolesKey: 'control.pageConsole.roles.guest',
      route: '/auth/register',
      routeLabel: '/auth/register',
      scenarioKey: 'control.pageConsole.page.register.scenario',
      stateKeys: ['control.pageConsole.state.inputting', 'control.pageConsole.state.restricted', 'control.pageConsole.state.success'],
      titleKey: 'control.pageConsole.page.register.title',
      tone: 'danger',
    },
    {
      gapKey: 'control.pageConsole.page.forgot.gap',
      group: 'auth',
      icon: 'envelope-open',
      interactionsKey: 'control.pageConsole.page.forgot.interactions',
      moduleKey: 'control.pageConsole.module.auth',
      rolesKey: 'control.pageConsole.roles.guest',
      route: '/auth/forgot-password',
      routeLabel: '/auth/forgot-password',
      scenarioKey: 'control.pageConsole.page.forgot.scenario',
      stateKeys: ['control.pageConsole.state.inputting', 'control.pageConsole.state.failed', 'control.pageConsole.state.success'],
      titleKey: 'control.pageConsole.page.forgot.title',
      tone: 'danger',
    },
  ];
}

function PageMenuRow({ entry, onPress }: { entry: PageConsoleEntry; onPress: () => void }) {
  const { palette, t } = useProductSettings();
  const toneColor = palette[entry.tone];

  return (
    <MenuRow
      description={entry.routeLabel}
      icon={entry.icon}
      meta={t(entry.moduleKey)}
      onPress={onPress}
      title={t(entry.titleKey)}
      tone={toneColor}
    />
  );
}

function PageDetail({ entry, onClose }: { entry: PageConsoleEntry; onClose: () => void }) {
  const { palette, t } = useProductSettings();
  const toneColor = palette[entry.tone];
  const openPage = () => {
    void impactLight();
    onClose();
    router.push(entry.route);
  };

  return (
    <View style={styles.detailStack}>
      <View style={StyleSheet.flatten([styles.routePanel, { backgroundColor: palette.panel, borderColor: palette.lineSoft }])}>
        <View style={StyleSheet.flatten([styles.pageIcon, { backgroundColor: `${toneColor}14`, borderColor: `${toneColor}55` }])}>
          <PhosphorIcon color={toneColor} name={entry.icon} size={16} />
        </View>
        <View style={styles.titleBlock}>
          <AppText tone="dim" variant="eyebrow">
            {t(entry.moduleKey)}
          </AppText>
          <AppText numberOfLines={1} variant="subtitle">
            {entry.routeLabel}
          </AppText>
        </View>
      </View>

      <InfoRow label={t('control.pageConsole.scenario')} value={t(entry.scenarioKey)} />
      <InfoRow label={t('control.pageConsole.interactions')} value={t(entry.interactionsKey)} />
      <InfoRow label={t('control.pageConsole.roles')} value={t(entry.rolesKey)} />
      <InfoRow label={t('control.pageConsole.gap')} value={t(entry.gapKey)} />

      <View style={styles.stateChips}>
        {entry.stateKeys.map((stateKey) => (
          <View key={stateKey} style={StyleSheet.flatten([styles.stateChip, { backgroundColor: palette.panelSoft, borderColor: palette.lineSoft }])}>
            <AppText numberOfLines={1} tone="muted" variant="eyebrow">
              {t(stateKey)}
            </AppText>
          </View>
        ))}
      </View>

      <NativePressable
        accessibilityLabel={`${t('control.pageConsole.openPage')} ${t(entry.titleKey)}`}
        accessibilityRole="button"
        minTouch={42}
        onPress={openPage}
        style={StyleSheet.flatten([styles.openButton, { backgroundColor: palette.text, borderColor: palette.text }])}>
        <AppText numberOfLines={1} style={{ color: palette.panel }} variant="caption">
          {t('control.pageConsole.openPage')}
        </AppText>
        <PhosphorIcon color={palette.panel} name="caret-right" size={14} />
      </NativePressable>
    </View>
  );
}

function MenuRow({
  description,
  icon,
  meta,
  onPress,
  title,
  tone,
}: {
  description: string;
  icon: PhosphorIconName;
  meta?: string;
  onPress: () => void;
  title: string;
  tone: string;
}) {
  const { palette } = useProductSettings();

  return (
    <NativePressable
      accessibilityRole="button"
      minTouch={58}
      onPress={onPress}
      style={StyleSheet.flatten([styles.menuRow, { backgroundColor: palette.panel, borderColor: palette.lineSoft }])}>
      <View style={StyleSheet.flatten([styles.menuIcon, { backgroundColor: `${tone}12`, borderColor: `${tone}55` }])}>
        <PhosphorIcon color={tone} name={icon} size={16} />
      </View>
      <View style={styles.menuText}>
        <View style={styles.menuTitleRow}>
          <AppText numberOfLines={1} variant="body">
            {title}
          </AppText>
          {meta ? (
            <AppText numberOfLines={1} tone="dim" variant="eyebrow">
              {meta}
            </AppText>
          ) : null}
        </View>
        <AppText numberOfLines={2} tone="muted" variant="caption">
          {description}
        </AppText>
      </View>
      <PhosphorIcon color={palette.textDim} name="caret-right" size={15} />
    </NativePressable>
  );
}

function SnapshotStrip({ items }: { items: { label: string; value: string }[] }) {
  const { palette } = useProductSettings();

  return (
    <View style={styles.snapshotStrip}>
      {items.map((item) => (
        <View key={item.label} style={StyleSheet.flatten([styles.snapshotItem, { backgroundColor: palette.panel, borderColor: palette.lineSoft }])}>
          <AppText numberOfLines={1} tone="dim" variant="eyebrow">
            {item.label}
          </AppText>
          <AppText numberOfLines={1} variant="caption">
            {item.value}
          </AppText>
        </View>
      ))}
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  const { palette } = useProductSettings();

  return (
    <View style={StyleSheet.flatten([styles.infoRow, { backgroundColor: palette.panel, borderColor: palette.lineSoft }])}>
      <AppText numberOfLines={1} tone="dim" variant="eyebrow">
        {label}
      </AppText>
      <AppText numberOfLines={3} tone="muted" variant="caption">
        {value}
      </AppText>
    </View>
  );
}

function ConsoleMetric({ label, value }: { label: string; value: string }) {
  const { palette } = useProductSettings();

  return (
    <View style={StyleSheet.flatten([styles.consoleMetric, { backgroundColor: palette.panel, borderColor: palette.lineSoft }])}>
      <AppText numberOfLines={1} tone="dim" variant="eyebrow">
        {label}
      </AppText>
      <AppText numberOfLines={1} variant="caption">
        {value}
      </AppText>
    </View>
  );
}

function getAutomaticTradingUsageStatus({
  authStatus,
  quoteStatus,
}: {
  authStatus: AuthStatus;
  quoteStatus: 'connecting' | 'connected' | 'failed';
}): TradingAccountUsageStatus {
  if (authStatus === 'guest' || quoteStatus === 'connecting') {
    return 'warning';
  }

  if (quoteStatus === 'failed') {
    return 'abnormal';
  }

  return 'normal';
}

function ControlSelect({
  icon,
  label,
  onChange,
  options,
  value,
}: {
  icon: PhosphorIconName;
  label: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  value: string;
}) {
  const { palette } = useProductSettings();
  const selected = options.find((item) => item.value === value);

  return (
    <View style={styles.field}>
      <AppText tone="dim" variant="eyebrow">
        {label}
      </AppText>
      <View style={StyleSheet.flatten([styles.selectShell, { backgroundColor: palette.panel, borderColor: palette.lineSoft }])}>
        <View style={StyleSheet.flatten([styles.selectIcon, { backgroundColor: palette.panelSoft, borderColor: palette.lineSoft }])}>
          <PhosphorIcon color={palette.brand} name={icon} size={13} />
        </View>
        <View style={styles.selectValue}>
          {Platform.OS === 'web' ? (
            <select
              aria-label={label}
              onChange={(event) => onChange(event.currentTarget.value)}
              style={{ ...webSelectStyle, color: palette.text }}
              value={value}>
              {options.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          ) : (
            <AppText numberOfLines={1} variant="body">
              {selected?.label ?? value}
            </AppText>
          )}
        </View>
        <PhosphorIcon color={palette.textDim} name="caret-down" size={15} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  consoleMetric: {
    borderRadius: 10,
    borderWidth: 1,
    gap: 4,
    minWidth: 0,
    padding: 10,
    width: '47%',
  },
  detailStack: {
    gap: 10,
  },
  fab: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  field: {
    gap: 6,
    minWidth: 0,
    width: '47%',
  },
  formGrid: {
    columnGap: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 10,
  },
  groupBlock: {
    gap: 8,
  },
  headerIconButton: {
    alignItems: 'center',
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  host: {
    alignItems: 'flex-end',
    bottom: 82,
    gap: 10,
    pointerEvents: 'box-none',
    position: 'absolute',
    right: 16,
    zIndex: 50,
  },
  infoRow: {
    borderRadius: 10,
    borderWidth: 1,
    gap: 4,
    padding: 10,
  },
  menuIcon: {
    alignItems: 'center',
    borderRadius: 9,
    borderWidth: 1,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  menuList: {
    gap: 8,
  },
  menuRow: {
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  menuText: {
    flex: 1,
    gap: 3,
    minWidth: 0,
  },
  menuTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
  },
  openButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 5,
    minHeight: 36,
    paddingHorizontal: 12,
  },
  pageIcon: {
    alignItems: 'center',
    borderRadius: 9,
    borderWidth: 1,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  panel: {
    borderRadius: 16,
    borderWidth: 1,
    maxHeight: 'min(680px, calc(100vh - 120px))' as DimensionValue,
    maxWidth: 'calc(100vw - 32px)' as DimensionValue,
    width: 376,
  },
  panelContent: {
    gap: 12,
    padding: 12,
  },
  panelTop: {
    alignItems: 'center',
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  partnerButton: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    flexGrow: 1,
    justifyContent: 'center',
    minHeight: 38,
    paddingHorizontal: 10,
  },
  partnerButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  preferencePanel: {
    gap: 10,
  },
  routePanel: {
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    padding: 10,
  },
  sectionHeader: {
    gap: 2,
  },
  selectIcon: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  selectShell: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    minHeight: 42,
    paddingHorizontal: 9,
  },
  selectValue: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    minWidth: 0,
  },
  snapshotItem: {
    borderRadius: 10,
    borderWidth: 1,
    flexGrow: 1,
    gap: 2,
    minWidth: '30%',
    paddingHorizontal: 9,
    paddingVertical: 7,
  },
  snapshotStrip: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },
  stateChip: {
    borderRadius: 999,
    borderWidth: 1,
    maxWidth: '48%',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  stateChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  summaryGrid: {
    columnGap: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 10,
  },
  titleBlock: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
});
