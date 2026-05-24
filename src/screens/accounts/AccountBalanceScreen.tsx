import { useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppIcon, type AppIconName, type IconTone } from '@/src/components/AppIcon';
import { ActionButton } from '@/src/components/ActionButton';
import { useBottomSheet } from '@/src/components/BottomSheet';
import { TransactionRow } from '@/src/components/business';
import { Card } from '@/src/components/Card';
import { DetailRow, LegendDot, MiniMetric } from '@/src/components/data-display';
import { EmptyState } from '@/src/components/feedback';
import { NativePressable } from '@/src/components/NativePressable';
import { Screen } from '@/src/components/Screen';
import { StatusPill, type StatusPillTone } from '@/src/components/StatusPill';
import { AppText } from '@/src/components/Typography';
import { buildTradingAccountProfiles, type TradingAccountProfile } from '@/src/domain/accountProfiles';
import { formatMoney } from '@/src/domain/format';
import type { Locale } from '@/src/i18n/translations';
import { useProductSettings } from '@/src/settings/ProductSettings';
import { useBroker } from '@/src/state/BrokerStore';
import { lineWidth, radius, spacing } from '@/src/theme/tokens';
import type { Transaction, TransactionStatus } from '@/src/domain/types';

type BalanceFilter = 'all' | 'deposit' | 'withdrawal';
type BalanceTransaction = Transaction & {
  trendLabel: string;
};
type TrendPoint = {
  deposit: number;
  label: string;
  withdrawal: number;
};

const chartHeight = 104;
const filterOrder: BalanceFilter[] = ['all', 'deposit', 'withdrawal'];

export default function AccountBalanceScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const bottomSheet = useBottomSheet();
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
  const [filter, setFilter] = useState<BalanceFilter>('all');
  const profiles = buildTradingAccountProfiles(account, positions, tradingAccountScenario, {
    countPreset: tradingAccountCountPreset,
    dataPreset: tradingAccountDataPreset,
    statusPreset: tradingAccountStatusPreset,
  });
  const profile = profiles.find((item) => item.id === id) ?? profiles[0];
  const transactions = useMemo(
    () => buildBalanceTransactions(account.transactions, account.credit, t('balance.adjustment.demoCredit'), t('balance.withdrawal.demoRejected')),
    [account.credit, account.transactions, t],
  );
  const filteredTransactions = filter === 'all' ? transactions : transactions.filter((item) => item.type === filter);
  const groupedTransactions = groupTransactions(filteredTransactions, locale, t('balance.group.today'));
  const completedTransactions = transactions.filter((item) => item.status === 'completed');
  const trend = buildTrend(completedTransactions);
  const depositTotal = completedTransactions.filter((item) => item.type === 'deposit').reduce((total, item) => total + item.amount, 0);
  const withdrawalTotal = completedTransactions.filter((item) => item.type === 'withdrawal').reduce((total, item) => total + Math.abs(item.amount), 0);
  const netCashFlow = depositTotal - withdrawalTotal;
  const nextFilter = () => setFilter((current) => filterOrder[(filterOrder.indexOf(current) + 1) % filterOrder.length]);
  const openTransactionDetail = (transaction: BalanceTransaction) => {
    bottomSheet.show({
      content: <TransactionDetailSheet currency={profile.currency} onClose={bottomSheet.hide} profile={profile} transaction={transaction} />,
      header: {
        leftIcon: getTransactionIcon(transaction),
        title: t('balance.detail.title'),
      },
    });
  };

  return (
    <Screen
      align="center"
      back
      rightActions={[{ icon: 'icon.system.settings', label: t('balance.filter'), onPress: nextFilter }]}
      title={t('balance.title')}>
      <Card style={styles.periodCard}>
        <View style={styles.periodHeader}>
          <View style={styles.flexBlock}>
            <AppText tone="muted" variant="caption">
              {t('balance.globalPeriod')}
            </AppText>
            <AppText numberOfLines={1} variant="subtitle">
              {profile.accountNo} · {profile.server}
            </AppText>
          </View>
          <NativePressable
            accessibilityLabel={t('balance.period.last7')}
            minTouch={36}
            style={StyleSheet.flatten([styles.periodButton, { backgroundColor: palette.panelSoft, borderColor: palette.lineSoft }])}>
            <AppText variant="caption">{t('balance.period.last7')}</AppText>
            <AppIcon tone="textDim" name="icon.system.chevron_down" size={13} />
          </NativePressable>
        </View>
        <View style={StyleSheet.flatten([styles.snapshotGrid, { borderTopColor: palette.lineSoft }])}>
          <MiniMetric label={t('balance.currentBalance')} value={formatMoney(profile.balance, profile.currency, 0, locale)} variant="snapshot" />
          <MiniMetric label={t('balance.available')} value={formatMoney(profile.freeMargin, profile.currency, 0, locale)} variant="snapshot" />
          <MiniMetric label={t('balance.netCashFlow')} tone={netCashFlow >= 0 ? 'down' : 'up'} value={formatSignedMoney(netCashFlow, profile.currency, locale, 0)} variant="snapshot" />
        </View>
      </Card>

      <Card style={styles.trendCard}>
        <View style={styles.sectionHeader}>
          <View style={styles.flexBlock}>
            <AppText variant="subtitle">{t('balance.fundingTrend')}</AppText>
            <AppText tone="muted" variant="caption">
              {t('balance.fundingSubtitle')}
            </AppText>
          </View>
          <StatusPill compact label={t('balance.period.last7')} tone="neutral" />
        </View>

        <View style={styles.totalRow}>
          <FundingTotal tone="down" label={t('balance.depositTotal')} value={formatMoney(depositTotal, profile.currency, 0, locale)} />
          <FundingTotal tone="amber" label={t('balance.withdrawalTotal')} value={formatMoney(withdrawalTotal, profile.currency, 0, locale)} />
        </View>

        <FundingChart points={trend} />

        <View style={styles.legendRow}>
          <LegendDot tone="down" label={t('balance.legend.deposit')} />
          <LegendDot tone="amber" label={t('balance.legend.withdrawal')} />
        </View>
      </Card>

      <Card style={styles.transactionCard}>
        <View style={styles.sectionHeader}>
          <AppText variant="subtitle">{t('balance.transactions')}</AppText>
          <AppText tone="muted" variant="caption">
            {filteredTransactions.length}
          </AppText>
        </View>

        <View style={styles.filterRow}>
          {filterOrder.map((item) => (
            <FilterButton current={filter} item={item} key={item} onPress={() => setFilter(item)} />
          ))}
        </View>

        {groupedTransactions.length === 0 ? (
          <EmptyState body={t('balance.empty')} />
        ) : (
          groupedTransactions.map((group) => (
            <View key={group.label} style={styles.transactionGroup}>
              <AppText tone="muted" variant="caption">
                {group.label}
              </AppText>
              <View style={StyleSheet.flatten([styles.transactionList, { borderColor: palette.lineSoft }])}>
                {group.rows.map((transaction, index) => (
                  <TransactionRow
                    currency={profile.currency}
                    formatTime={formatTransactionTime}
                    getIcon={getTransactionIcon}
                    getStatusLabel={(item) => t(`balance.detail.status.${item.status}`)}
                    getTone={getTransactionTone}
                    key={transaction.id}
                    onPress={() => openTransactionDetail(transaction)}
                    resolveColor={resolveTransactionColor}
                    resolveIconTone={resolveTransactionIconTone}
                    showDivider={index < group.rows.length - 1}
                    transaction={transaction}
                  />
                ))}
              </View>
            </View>
          ))
        )}
      </Card>
    </Screen>
  );
}

function FundingTotal({ label, tone, value }: { label: string; tone: Extract<IconTone, 'amber' | 'down'>; value: string }) {
  const { palette } = useProductSettings();

  return (
    <View style={styles.totalCell}>
      <View style={styles.totalLabelRow}>
        <View style={StyleSheet.flatten([styles.legendDot, { backgroundColor: palette[tone] }])} />
        <AppText numberOfLines={1} tone="muted" variant="caption">
          {label}
        </AppText>
      </View>
      <AppText adjustsFontSizeToFit numberOfLines={1} variant="subtitle">
        {value}
      </AppText>
    </View>
  );
}

function FundingChart({ points }: { points: TrendPoint[] }) {
  const { palette } = useProductSettings();
  const maxValue = Math.max(...points.flatMap((point) => [point.deposit, point.withdrawal]), 1);

  return (
    <View style={styles.chartWrap}>
      <View style={styles.chartGrid}>
        {[0, 1, 2].map((line) => (
          <View key={line} style={StyleSheet.flatten([styles.gridLine, { backgroundColor: palette.lineSoft }])} />
        ))}
      </View>
      <View style={styles.chartColumns}>
        {points.map((point) => (
          <View key={point.label} style={styles.chartColumn}>
            <View style={styles.barPair}>
              <View
                style={StyleSheet.flatten([
                  styles.chartBar,
                  { backgroundColor: palette.down, height: resolveBarHeight(point.deposit, maxValue) },
                ])}
              />
              <View
                style={StyleSheet.flatten([
                  styles.chartBar,
                  { backgroundColor: palette.amber, height: resolveBarHeight(point.withdrawal, maxValue) },
                ])}
              />
            </View>
            <AppText numberOfLines={1} tone="dim" variant="caption">
              {point.label}
            </AppText>
          </View>
        ))}
      </View>
    </View>
  );
}

function FilterButton({ current, item, onPress }: { current: BalanceFilter; item: BalanceFilter; onPress: () => void }) {
  const { palette, t } = useProductSettings();
  const selected = current === item;

  return (
    <NativePressable
      accessibilityLabel={t(`balance.filter.${item}`)}
      minTouch={36}
      onPress={onPress}
      style={StyleSheet.flatten([
        styles.filterButton,
        { backgroundColor: selected ? palette.text : palette.panelSoft, borderColor: selected ? palette.text : palette.lineSoft },
      ])}>
      <AppText tone={selected ? 'panel' : 'muted'} variant="caption">
        {t(`balance.filter.${item}`)}
      </AppText>
    </NativePressable>
  );
}

function TransactionDetailSheet({
  currency,
  onClose,
  profile,
  transaction,
}: {
  currency: string;
  onClose: () => void;
  profile: TradingAccountProfile;
  transaction: BalanceTransaction;
}) {
  const { locale, palette, t } = useProductSettings();
  const statusTone = getTransactionTone(transaction);
  const statusColor = resolveStatusColor(transaction.status, palette);
  const completedValue = resolveCompletedAmount(transaction, currency, locale, t('balance.detail.pending'), t('balance.detail.notAvailable'));
  const reviewTimeLabel = transaction.status === 'completed' ? t('balance.detail.completeTime') : t('balance.detail.reviewTime');
  const reviewTimeValue =
    transaction.status === 'reviewing' ? t('balance.detail.pending') : formatTransactionTime(addMinutes(transaction.createdAt, transaction.status === 'rejected' ? 23 : 12), locale);
  const detailRows = [
    { label: t('balance.detail.requestTime'), value: formatTransactionTime(transaction.createdAt, locale) },
    { label: t('balance.detail.account'), value: profile.accountNo },
    { label: t('balance.detail.server'), value: profile.server },
    { label: t('balance.detail.reference'), value: formatTransactionReference(transaction) },
    { label: t('balance.detail.type'), value: getTransactionTypeLabel(transaction.type, t) },
    { label: t('balance.detail.method'), value: getTransactionMethodLabel(transaction.type, t) },
    { label: reviewTimeLabel, value: reviewTimeValue },
    { label: t('balance.detail.requestAmount'), value: formatSignedMoney(transaction.amount, currency, locale) },
    { label: t('balance.detail.completedAmount'), value: completedValue },
    ...(transaction.status === 'rejected' ? [{ label: t('balance.detail.failedReason'), value: t('balance.detail.failedReasonCopy') }] : []),
    { label: t('balance.detail.voucher'), value: t('balance.detail.view'), trailingIcon: true },
  ];

  return (
    <View style={styles.detailSheet}>
      <View style={StyleSheet.flatten([styles.detailHero, { backgroundColor: `${statusColor}10`, borderColor: `${statusColor}44` }])}>
        <View style={StyleSheet.flatten([styles.detailStatusIcon, { backgroundColor: `${statusColor}16`, borderColor: `${statusColor}44` }])}>
          <AppIcon name={getDetailStatusIcon(transaction.status)} size={22} tone={resolveStatusIconTone(transaction.status)} />
        </View>
        <StatusPill icon={getDetailStatusIcon(transaction.status)} label={t(`balance.detail.status.${transaction.status}`)} tone={statusTone} />
        <AppText adjustsFontSizeToFit numberOfLines={1} style={styles.detailAmount} tone={transaction.amount >= 0 ? 'down' : 'up'} variant="displayXl">
          {formatSignedMoney(transaction.amount, currency, locale)}
        </AppText>
        <AppText numberOfLines={1} tone="muted" variant="caption">
          {getTransactionTypeLabel(transaction.type, t)}
        </AppText>
      </View>

      <View style={StyleSheet.flatten([styles.detailRows, { backgroundColor: palette.panel, borderColor: palette.lineSoft }])}>
        {detailRows.map((row, index) => (
          <DetailRow key={`${row.label}-${row.value}`} row={row} showDivider={index < detailRows.length - 1} />
        ))}
      </View>
      <ActionButton label={t('balance.detail.ok')} onPress={onClose} tone="brand" />
    </View>
  );
}

function buildBalanceTransactions(transactions: Transaction[], credit: number, creditLabel: string, rejectedWithdrawalLabel: string): BalanceTransaction[] {
  const syntheticCredit: BalanceTransaction = {
    amount: credit,
    createdAt: '2026-05-22 10:12',
    id: 'balance-credit-adjustment',
    note: { 'en-US': creditLabel, 'zh-CN': creditLabel },
    status: 'completed',
    trendLabel: '05/22',
    type: 'adjustment',
  };
  const syntheticRejectedWithdrawal: BalanceTransaction = {
    amount: -800,
    createdAt: '2026-05-18 14:20',
    id: 'balance-withdrawal-rejected',
    note: { 'en-US': rejectedWithdrawalLabel, 'zh-CN': rejectedWithdrawalLabel },
    status: 'rejected',
    trendLabel: '05/18',
    type: 'withdrawal',
  };

  return [syntheticCredit, syntheticRejectedWithdrawal, ...transactions.map((transaction) => ({ ...transaction, trendLabel: formatTrendLabel(transaction.createdAt) }))]
    .sort((left, right) => parseTransactionTime(right.createdAt) - parseTransactionTime(left.createdAt));
}

function buildTrend(transactions: BalanceTransaction[]): TrendPoint[] {
  const bucket = new Map<string, TrendPoint>();

  transactions.forEach((transaction) => {
    const label = transaction.trendLabel;
    const current = bucket.get(label) ?? { deposit: 0, label, withdrawal: 0 };

    if (transaction.type === 'deposit') {
      current.deposit += Math.max(transaction.amount, 0);
    }

    if (transaction.type === 'withdrawal') {
      current.withdrawal += Math.abs(transaction.amount);
    }

    bucket.set(label, current);
  });

  return [...bucket.values()].sort((left, right) => left.label.localeCompare(right.label)).slice(-4);
}

function groupTransactions(rows: BalanceTransaction[], locale: Locale, todayLabel: string) {
  const groups: { key: string; label: string; rows: BalanceTransaction[] }[] = [];
  const mostRecentKey = rows[0] ? getDateKey(rows[0].createdAt) : '';

  rows.forEach((row) => {
    const key = getDateKey(row.createdAt);
    let group = groups.find((item) => item.key === key);

    if (!group) {
      group = { key, label: key === mostRecentKey ? todayLabel : formatDateGroupLabel(row.createdAt, locale), rows: [] };
      groups.push(group);
    }

    group.rows.push(row);
  });

  return groups;
}

function getTransactionIcon(transaction: Transaction): AppIconName {
  if (transaction.type === 'withdrawal') {
    return 'icon.wallet.withdrawal';
  }

  if (transaction.type === 'adjustment') {
    return 'icon.wallet.transfer';
  }

  return 'icon.wallet.deposit';
}

function getTransactionTone(transaction: Transaction): StatusPillTone {
  const toneByStatus: Record<TransactionStatus, StatusPillTone> = {
    completed: 'success',
    rejected: 'danger',
    reviewing: 'warning',
  };

  return toneByStatus[transaction.status];
}

function getDetailStatusIcon(status: TransactionStatus): AppIconName {
  if (status === 'completed') {
    return 'icon.status.verified';
  }

  if (status === 'rejected') {
    return 'icon.status.rejected';
  }

  return 'icon.trading.history';
}

function resolveStatusColor(status: TransactionStatus, palette: ReturnType<typeof useProductSettings>['palette']) {
  if (status === 'completed') {
    return palette.down;
  }

  if (status === 'rejected') {
    return palette.danger;
  }

  return palette.amber;
}

function resolveStatusIconTone(status: TransactionStatus): IconTone {
  if (status === 'completed') {
    return 'down';
  }

  if (status === 'rejected') {
    return 'danger';
  }

  return 'amber';
}

function resolveTransactionColor(transaction: Transaction, palette: ReturnType<typeof useProductSettings>['palette']) {
  if (transaction.type === 'withdrawal') {
    return palette.amber;
  }

  if (transaction.type === 'adjustment') {
    return palette.blue;
  }

  return palette.down;
}

function resolveTransactionIconTone(transaction: Transaction): IconTone {
  if (transaction.type === 'withdrawal') {
    return 'amber';
  }

  if (transaction.type === 'adjustment') {
    return 'blue';
  }

  return 'down';
}

function getTransactionTypeLabel(type: Transaction['type'], t: ReturnType<typeof useProductSettings>['t']) {
  return t(`balance.type.${type}`);
}

function getTransactionMethodLabel(type: Transaction['type'], t: ReturnType<typeof useProductSettings>['t']) {
  if (type === 'withdrawal') {
    return t('balance.method.demoWithdrawal');
  }

  if (type === 'adjustment') {
    return t('balance.method.creditAdjustment');
  }

  return t('balance.method.bankTransfer');
}

function resolveCompletedAmount(transaction: Transaction, currency: string, locale: Locale, pendingLabel: string, emptyLabel: string) {
  if (transaction.status === 'reviewing') {
    return pendingLabel;
  }

  if (transaction.status === 'rejected') {
    return emptyLabel;
  }

  return formatSignedMoney(transaction.amount, currency, locale);
}

function formatTransactionReference(transaction: Transaction) {
  const normalizedId = transaction.id.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  const dateStamp = transaction.createdAt.slice(5, 10).replace('-', '');

  return `REF-${dateStamp}-${normalizedId.slice(-6)}`;
}

function addMinutes(createdAt: string, minutes: number) {
  const date = new Date(createdAt.replace(' ', 'T'));
  date.setMinutes(date.getMinutes() + minutes);

  const pad = (value: number) => String(value).padStart(2, '0');

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function resolveBarHeight(value: number, maxValue: number) {
  if (value <= 0) {
    return 8;
  }

  return Math.max(12, Math.round((value / maxValue) * chartHeight));
}

function formatSignedMoney(value: number, currency: string, locale: Locale, digits = 2) {
  const sign = value >= 0 ? '+' : '-';
  return `${sign}${formatMoney(Math.abs(value), currency, digits, locale)}`;
}

function formatTrendLabel(createdAt: string) {
  const [, , month = '00', day = '00'] = /^(\d{4})-(\d{2})-(\d{2})/.exec(createdAt) ?? [];
  return `${month}/${day}`;
}

function getDateKey(createdAt: string) {
  return createdAt.slice(0, 10);
}

function formatDateGroupLabel(createdAt: string, locale: Locale) {
  const [, , month = '00', day = '00'] = /^(\d{4})-(\d{2})-(\d{2})/.exec(createdAt) ?? [];
  return locale !== 'zh-CN' ? `${month}/${day}` : `${month}月${day}日`;
}

function formatTransactionTime(createdAt: string, locale: Locale) {
  const [, , month = '00', day = '00', hour = '00', minute = '00'] =
    /^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2})/.exec(createdAt) ?? [];

  return locale !== 'zh-CN' ? `${month}/${day} ${hour}:${minute}` : `${month}月${day}日 ${hour}:${minute}`;
}

function parseTransactionTime(createdAt: string) {
  return new Date(createdAt.replace(' ', 'T')).getTime();
}

const styles = StyleSheet.create({
  barPair: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: spacing.xs,
    height: chartHeight,
  },
  chartBar: {
    borderRadius: radius.xs,
    width: 12,
  },
  chartColumn: {
    alignItems: 'center',
    flex: 1,
    gap: spacing.sm,
    justifyContent: 'flex-end',
  },
  chartColumns: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: spacing.sm,
    minHeight: chartHeight + 26,
  },
  chartGrid: {
    bottom: 25,
    justifyContent: 'space-between',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 4,
  },
  chartWrap: {
    minHeight: chartHeight + 32,
    position: 'relative',
  },
  detailAmount: {
    marginTop: spacing.xs,
  },
  detailHero: {
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: lineWidth.none,
    gap: spacing.sm,
    padding: spacing.lg,
  },
  detailRows: {
    borderRadius: radius.md,
    borderWidth: lineWidth.none,
    overflow: 'hidden',
  },
  detailSheet: {
    gap: spacing.md,
    paddingBottom: spacing.sm,
  },
  detailStatusIcon: {
    alignItems: 'center',
    borderRadius: radius.full,
    borderWidth: lineWidth.hairline,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  filterButton: {
    alignItems: 'center',
    borderRadius: radius.full,
    borderWidth: lineWidth.hairline,
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  filterRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  flexBlock: {
    flex: 1,
    gap: spacing.xs,
    minWidth: 0,
  },
  gridLine: {
    height: lineWidth.hairline,
  },
  legendDot: {
    borderRadius: radius.full,
    height: 8,
    width: 8,
  },
  legendRow: {
    flexDirection: 'row',
    gap: spacing.lg,
    justifyContent: 'center',
  },
  periodButton: {
    alignItems: 'center',
    borderRadius: radius.full,
    borderWidth: lineWidth.hairline,
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  periodCard: {
    gap: spacing.lg,
  },
  periodHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  sectionHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  snapshotGrid: {
    borderTopWidth: lineWidth.hairline,
    flexDirection: 'row',
    gap: spacing.md,
    paddingTop: spacing.lg,
  },
  totalCell: {
    flex: 1,
    gap: spacing.xs,
    minWidth: 0,
  },
  totalLabelRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  totalRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  transactionCard: {
    gap: spacing.lg,
  },
  transactionGroup: {
    gap: spacing.sm,
  },
  transactionList: {
    borderRadius: radius.md,
    borderWidth: lineWidth.none,
    overflow: 'hidden',
  },
  trendCard: {
    gap: spacing.lg,
  },
});
