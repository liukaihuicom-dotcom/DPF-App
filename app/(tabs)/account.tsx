import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Card } from '@/src/components/Card';
import { DescribedLabel } from '@/src/components/DescribedLabel';
import { FundActionGrid } from '@/src/components/FundActionGrid';
import { Metric } from '@/src/components/Metric';
import { NativePressable } from '@/src/components/NativePressable';
import { AppIcon } from '@/src/components/AppIcon';
import { Screen } from '@/src/components/Screen';
import { Sparkline } from '@/src/components/Sparkline';
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
import { typography } from '@/src/theme/tokens';

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
      rightActions={[{ icon: 'addUser', label: locale === 'en-US' ? 'Add account' : '添加账户' }]}
      title={t('tabs.accounts')}>
      <AccountOverviewCard overview={overview} />
      <FundActionGrid />
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
        <AppIcon color={palette.text} name="accountBank" size={18} />
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
          <AppIcon color={palette.textDim} name="navigateNext" size={16} />
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
  todayPnl: number;
  latestTrade: string;
  openPositionCount: number;
  totalAccountCount: number;
  totalEquity: number;
  totalFreeMargin: number;
  totalRealizedPnl: number;
  totalReturn: number;
  totalUnrealizedPnl: number;
  totalUsedMargin: number;
  trendValues: number[];
};

function AccountOverviewCard({ overview }: { overview: AccountOverview }) {
  const { locale, palette, t } = useProductSettings();

  return (
    <Card>
      <View style={styles.overviewCardContent}>
        <View style={styles.overviewPrimary}>
          <DescribedLabel label={t('accounts.overview.totalEquity')} />
          <AppText adjustsFontSizeToFit numberOfLines={1} style={styles.overviewEquityValue} variant="quote">
            {formatMoney(overview.totalEquity, 'USD', 2, locale)}
          </AppText>
          <View style={styles.overviewDailyBlock}>
            <View style={styles.overviewDailyRow}>
              <AppText tone="muted" variant="caption">{t('accounts.overview.dailyPnl')}</AppText>
              <AppText numberOfLines={1} style={styles.overviewDailyValue} tone={overview.todayPnl >= 0 ? 'down' : 'up'} variant="subtitle">
                {formatMoney(overview.todayPnl, 'USD', 2, locale)}
              </AppText>
            </View>
            <View style={styles.overviewTrend}>
              <Sparkline color={overview.todayPnl >= 0 ? palette.down : palette.up} height={44} values={overview.trendValues} width={172} />
            </View>
          </View>
        </View>

        <View style={StyleSheet.flatten([styles.overviewVerticalDivider, { backgroundColor: palette.lineSoft }])} />

        <View style={styles.overviewSide}>
          <OverviewSideMetric
            label={t('accounts.overview.totalUnrealizedPnl')}
            tone={overview.totalUnrealizedPnl >= 0 ? 'down' : 'up'}
            value={formatMoney(overview.totalUnrealizedPnl, 'USD', 2, locale)}
          />
          <OverviewSideMetric
            label={t('accounts.overview.totalReturn')}
            tone={overview.totalReturn >= 0 ? 'down' : 'up'}
            value={formatMoney(overview.totalReturn, 'USD', 2, locale)}
          />
          <OverviewSideMetric label={t('accounts.overview.activeAccounts')} value={`${overview.activeAccountCount}`} />
        </View>
      </View>
    </Card>
  );
}

function OverviewSideMetric({ label, tone, value }: { label: string; tone?: 'down' | 'up'; value: string }) {
  return (
    <View style={styles.overviewSideMetric}>
      <AppText tone="muted" variant="caption">{label}</AppText>
      <AppText adjustsFontSizeToFit numberOfLines={1} tone={tone} variant="subtitle">
        {value}
      </AppText>
    </View>
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
  const totalRealizedPnl = accounts.reduce((total, profile) => total + profile.realizedPnl, 0);
  const totalUnrealizedPnl = accounts.reduce((total, profile) => total + profile.unrealizedPnl, 0);

  const totalEquity = accounts.reduce((total, profile) => total + profile.equity, 0);
  const totalReturn = totalRealizedPnl + totalUnrealizedPnl;

  return {
    activeAccountCount: activeAccounts.length,
    todayPnl: totalReturn,
    latestTrade: activeAccounts[0]?.lastTrade ?? accounts[0]?.lastTrade ?? '--',
    openPositionCount,
    totalAccountCount: accounts.length,
    totalEquity,
    totalFreeMargin: accounts.reduce((total, profile) => total + profile.freeMargin, 0),
    totalRealizedPnl,
    totalReturn,
    totalUnrealizedPnl,
    totalUsedMargin: accounts.reduce((total, profile) => total + profile.usedMargin, 0),
    trendValues: buildOverviewTrend(totalEquity, totalReturn),
  };
}

function buildOverviewTrend(totalEquity: number, totalReturn: number) {
  const base = Math.max(totalEquity - totalReturn, 1);
  return [base * 0.996, base * 1.002, base * 0.999, base * 1.008, base * 1.006, base * 1.014, totalEquity * 0.998, totalEquity];
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
  metricRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  overviewCardContent: {
    alignItems: 'stretch',
    flexDirection: 'row',
    gap: 14,
  },
  overviewDailyBlock: {
    gap: 6,
    marginTop: 16,
  },
  overviewDailyRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
  },
  overviewDailyValue: {
    flex: 1,
    minWidth: 0,
    textAlign: 'right',
  },
  overviewEquityValue: {
    ...typography.quote,
  },
  overviewPrimary: {
    flex: 1.24,
    minWidth: 0,
  },
  overviewSide: {
    flex: 0.82,
    gap: 12,
    justifyContent: 'center',
    minWidth: 116,
  },
  overviewSideMetric: {
    gap: 3,
    minWidth: 0,
  },
  overviewTrend: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  overviewVerticalDivider: {
    alignSelf: 'stretch',
    width: 1,
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
