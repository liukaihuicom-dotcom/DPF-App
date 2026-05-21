import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Card } from '@/src/components/Card';
import { Metric } from '@/src/components/Metric';
import { NativePressable } from '@/src/components/NativePressable';
import { PhosphorIcon } from '@/src/components/PhosphorIcon';
import { Screen } from '@/src/components/Screen';
import { StatusPill, type StatusPillTone } from '@/src/components/StatusPill';
import { AppText } from '@/src/components/Typography';
import {
  buildTradingAccountProfiles,
  getAccountStatusLabel,
  tradingAccountStatusGroups,
  type TradingAccountProfile,
} from '@/src/domain/accountProfiles';
import { formatCompactMoney, formatMoney, formatVolumeMillions, localizeText, statusLabel } from '@/src/domain/format';
import { commissions, partnerMetrics } from '@/src/domain/mockData';
import { useProductSettings } from '@/src/settings/ProductSettings';
import { useBroker } from '@/src/state/BrokerStore';

export default function AccountScreen() {
  const { role } = useBroker();

  return role === 'partner' ? <CommissionScreen /> : <TraderAccountsScreen />;
}

function TraderAccountsScreen() {
  const { account, positions } = useBroker();
  const {
    locale,
    palette,
    t,
    tradingAccountCountPreset,
    tradingAccountDataPreset,
    tradingAccountScenario,
    tradingAccountStatusPreset,
  } = useProductSettings();
  const accounts = buildTradingAccountProfiles(account, positions, tradingAccountScenario, {
    countPreset: tradingAccountCountPreset,
    dataPreset: tradingAccountDataPreset,
    statusPreset: tradingAccountStatusPreset,
  });
  const overview = buildAccountOverview(accounts, positions.length);

  return (
    <Screen
      rightActions={[{ icon: 'user-plus', label: locale === 'en-US' ? 'Add account' : '添加账户' }]}
      title={t('tabs.accounts')}>
      <AccountOverviewCard overview={overview} />
      {tradingAccountStatusGroups.map((group) => {
        const groupedAccounts = accounts.filter((item) => item.group === group);
        if (groupedAccounts.length === 0) {
          return null;
        }

        return (
          <View key={group} style={styles.accountGroup}>
            <AppText tone="muted" variant="caption">
              {getAccountStatusLabel(group, locale)} ({groupedAccounts.length})
            </AppText>
            {groupedAccounts.map((profile) => (
              <AccountListCard key={profile.id} profile={profile} />
            ))}
          </View>
        );
      })}
    </Screen>
  );
}

function AccountListCard({ profile }: { profile: TradingAccountProfile }) {
  const { locale, palette } = useProductSettings();
  const status = profile.group !== 'active' ? getAccountStatusLabel(profile.group, locale) : '';
  const statusTone: StatusPillTone = profile.group === 'demo' ? 'brand' : profile.group === 'disabled' || profile.group === 'archived' ? 'danger' : 'warning';

  return (
    <NativePressable
      accessibilityLabel={profile.accountNo}
      minTouch={86}
      onPress={() => router.push(`/account-details/${profile.id}`)}
      style={StyleSheet.flatten([styles.accountCard, { backgroundColor: palette.panel, borderColor: palette.lineSoft }])}>
      <View style={StyleSheet.flatten([styles.walletIcon, { backgroundColor: palette.panelSoft }])}>
        <PhosphorIcon color={palette.text} name="bank" size={18} />
      </View>
      <View style={styles.accountCardBody}>
        <View style={styles.accountCardTop}>
          <View style={styles.accountTitleBlock}>
            <View style={styles.accountNumberRow}>
              <AppText variant="subtitle">{profile.accountNo}</AppText>
              {status ? <StatusPill compact label={status} tone={statusTone} /> : null}
            </View>
            <AppText numberOfLines={1} tone="muted" variant="caption">
              🇺🇸 {profile.currency} · {profile.platform} · {profile.type}
            </AppText>
          </View>
          <PhosphorIcon color={palette.textDim} name="caret-right" size={16} />
        </View>

        <View style={StyleSheet.flatten([styles.accountDivider, { backgroundColor: palette.lineSoft }])} />
        <View style={styles.accountValues}>
          <View style={styles.accountValueCell}>
            <AppText variant="subtitle">{formatMoney(profile.equity, profile.currency, 2, locale)}</AppText>
            <AppText tone="muted" variant="caption">
              Equity
            </AppText>
          </View>
          <View style={styles.accountValueCell}>
            <AppText tone={profile.unrealizedPnl >= 0 ? 'down' : 'up'} variant="subtitle">
              {formatMoney(profile.unrealizedPnl, profile.currency, 2, locale)}
            </AppText>
            <AppText tone="muted" variant="caption">
              Unrealized PnL
            </AppText>
          </View>
        </View>
        <AppText tone="dim" variant="caption">
          Last trade {profile.lastTrade}
        </AppText>
      </View>
    </NativePressable>
  );
}

type AccountOverview = {
  activeAccountCount: number;
  latestTrade: string;
  openPositionCount: number;
  totalAccountCount: number;
  totalEquity: number;
  totalFreeMargin: number;
  totalRealizedPnl: number;
  totalUnrealizedPnl: number;
  totalUsedMargin: number;
};

function AccountOverviewCard({ overview }: { overview: AccountOverview }) {
  const { locale, palette, t } = useProductSettings();
  const activityLabel = locale === 'en-US' ? 'Account activity' : '账号活跃';
  const activeCaption =
    locale === 'en-US'
      ? `${overview.activeAccountCount}/${overview.totalAccountCount} tradable · ${overview.openPositionCount} positions`
      : `${overview.activeAccountCount}/${overview.totalAccountCount} 可交易 · ${overview.openPositionCount} 持仓`;

  return (
    <Card>
      <View style={styles.overviewHeader}>
        <View style={styles.overviewTitleBlock}>
          <AppText tone="muted" variant="caption">{locale === 'en-US' ? 'Account overview' : '账户总览'}</AppText>
          <AppText adjustsFontSizeToFit numberOfLines={1} variant="largeNumber">
            {formatMoney(overview.totalEquity, 'USD', 2, locale)}
          </AppText>
          <AppText tone="muted" variant="caption">{locale === 'en-US' ? 'Total equity' : '总净值'}</AppText>
        </View>
        <StatusPill label={`${activityLabel} · ${activeCaption}`} style={styles.activityPill} tone="brand" />
      </View>

      <View style={StyleSheet.flatten([styles.accountDivider, { backgroundColor: palette.lineSoft }])} />
      <View style={styles.overviewGrid}>
        <Metric label={t('account.availableMargin')} value={formatMoney(overview.totalFreeMargin, 'USD', 2, locale)} />
        <Metric label={t('account.usedMargin')} value={formatMoney(overview.totalUsedMargin, 'USD', 2, locale)} />
      </View>
      <View style={styles.overviewGrid}>
        <Metric
          label={locale === 'en-US' ? 'Closed PnL' : '已平仓盈亏'}
          tone={overview.totalRealizedPnl >= 0 ? 'down' : 'up'}
          value={formatMoney(overview.totalRealizedPnl, 'USD', 2, locale)}
        />
        <Metric
          caption={locale === 'en-US' ? `Last trade ${overview.latestTrade}` : `最近交易 ${overview.latestTrade}`}
          label={locale === 'en-US' ? 'Floating PnL' : '浮动盈亏'}
          tone={overview.totalUnrealizedPnl >= 0 ? 'down' : 'up'}
          value={formatMoney(overview.totalUnrealizedPnl, 'USD', 2, locale)}
        />
      </View>
    </Card>
  );
}

function CommissionScreen() {
  const { locale, palette, t } = useProductSettings();

  return (
    <Screen title={t('commission.title')}>
      <Card highlight>
        <View style={styles.metricRow}>
          <Metric label={t('commission.pending')} tone="amber" value={formatCompactMoney(partnerMetrics.pendingCommission, 'USD', locale)} />
          <Metric label={t('commission.settled')} tone="down" value={formatCompactMoney(partnerMetrics.settledCommission, 'USD', locale)} />
        </View>
      </Card>

      <Card>
        <AppText variant="subtitle">{t('commission.rule')}</AppText>
        <View style={styles.ruleRow}>
          <Metric label="FX Major" value="$82/M" />
          <Metric label="Gold" value="$120/M" />
          <Metric label="Index CFD" value="$64/M" />
        </View>
        <AppText tone="muted" variant="caption">
          {t('commission.ruleHint')}
        </AppText>
      </Card>

      <View style={styles.sectionTitle}>
        <AppText variant="subtitle">{t('commission.details')}</AppText>
        <AppText tone="dim" variant="caption">
          {localizeText(partnerMetrics.month, locale)}
        </AppText>
      </View>
      <Card compact>
        {commissions.map((commission) => (
          <View key={commission.id} style={StyleSheet.flatten([styles.recordRow, { borderBottomColor: palette.lineSoft }])}>
            <View style={styles.recordMain}>
              <AppText variant="body">{commission.clientName}</AppText>
              <AppText tone="muted" variant="caption">
                {commission.symbol} · {formatVolumeMillions(commission.volume, locale)} · ${commission.ratePerMillion}/M
              </AppText>
            </View>
            <View style={styles.recordSide}>
              <AppText tone={commission.status === 'pending' ? 'amber' : 'down'} variant="body">
                {formatMoney(commission.amount, 'USD', 2, locale)}
              </AppText>
              <AppText tone="dim" variant="caption">
                {statusLabel(commission.status, locale)}
              </AppText>
            </View>
          </View>
        ))}
      </Card>
    </Screen>
  );
}

function buildAccountOverview(accounts: TradingAccountProfile[], openPositionCount: number): AccountOverview {
  const activeAccounts = accounts.filter((profile) => profile.group === 'active' || profile.group === 'demo');

  return {
    activeAccountCount: activeAccounts.length,
    latestTrade: activeAccounts[0]?.lastTrade ?? accounts[0]?.lastTrade ?? '--',
    openPositionCount,
    totalAccountCount: accounts.length,
    totalEquity: accounts.reduce((total, profile) => total + profile.equity, 0),
    totalFreeMargin: accounts.reduce((total, profile) => total + profile.freeMargin, 0),
    totalRealizedPnl: accounts.reduce((total, profile) => total + profile.realizedPnl, 0),
    totalUnrealizedPnl: accounts.reduce((total, profile) => total + profile.unrealizedPnl, 0),
    totalUsedMargin: accounts.reduce((total, profile) => total + profile.usedMargin, 0),
  };
}

const styles = StyleSheet.create({
  accountCard: {
    alignItems: 'flex-start',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 14,
  },
  accountCardBody: {
    flex: 1,
    gap: 9,
    minWidth: 0,
  },
  accountCardTop: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
  },
  accountDivider: {
    height: 1,
  },
  accountGroup: {
    gap: 8,
  },
  accountNumberRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  accountTitleBlock: {
    flex: 1,
    minWidth: 0,
  },
  accountValueCell: {
    flex: 1,
    gap: 1,
  },
  accountValues: {
    flexDirection: 'row',
    gap: 12,
  },
  activityPill: {
    alignSelf: 'flex-start',
    maxWidth: '100%',
  },
  metricRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  overviewGrid: {
    columnGap: 12,
    flexDirection: 'row',
    rowGap: 10,
  },
  overviewHeader: {
    gap: 10,
  },
  overviewTitleBlock: {
    gap: 2,
    minWidth: 0,
  },
  recordMain: {
    flex: 1,
    minWidth: 0,
  },
  recordRow: {
    alignItems: 'center',
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 12,
    minHeight: 60,
    paddingVertical: 10,
  },
  recordSide: {
    alignItems: 'flex-end',
    minWidth: 92,
  },
  ruleRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
    marginTop: 12,
  },
  sectionTitle: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  walletIcon: {
    alignItems: 'center',
    borderRadius: 999,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
});
