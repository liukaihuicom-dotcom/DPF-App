import { StyleSheet, View } from 'react-native';

import { Card } from '@/src/components/Card';
import { Metric } from '@/src/components/Metric';
import { Screen } from '@/src/components/Screen';
import { AppText } from '@/src/components/Typography';
import { UpgradeChatCard } from '@/src/components/UpgradeChatCard';
import { formatCompactMoney, formatMoney, formatVolumeMillions, localizeText, statusLabel } from '@/src/domain/format';
import { commissions, partnerMetrics } from '@/src/domain/mockData';
import { useProductSettings } from '@/src/settings/ProductSettings';
import { useBroker } from '@/src/state/BrokerStore';

export default function AccountScreen() {
  const { role } = useBroker();

  return role === 'partner' ? <CommissionScreen /> : <TraderAccountScreen />;
}

function TraderAccountScreen() {
  const { account } = useBroker();
  const { locale, palette, t } = useProductSettings();

  return (
    <Screen subtitle={t('account.mockLedger')} title={t('account.title')}>
      <Card highlight>
        <AppText tone="dim" variant="eyebrow">
          {t('account.equity')}
        </AppText>
        <AppText tone={account.equity >= account.balance ? 'up' : 'down'} variant="largeNumber">
          {formatMoney(account.equity, account.currency, 2, locale)}
        </AppText>
        <View style={styles.metricRow}>
          <Metric label={t('account.balance')} value={formatMoney(account.balance, account.currency, 2, locale)} />
          <Metric label={t('account.credit')} tone="blue" value={formatMoney(account.credit, account.currency, 2, locale)} />
        </View>
      </Card>

      <Card>
        <View style={styles.metricRow}>
          <Metric label={t('account.usedMargin')} value={formatMoney(account.usedMargin, account.currency, 2, locale)} />
          <Metric label={t('account.availableMargin')} tone={account.freeMargin > 0 ? 'down' : 'danger'} value={formatMoney(account.freeMargin, account.currency, 2, locale)} />
        </View>
        <View style={StyleSheet.flatten([styles.marginTrack, { backgroundColor: palette.panelSoft }])}>
          <View
            style={StyleSheet.flatten([
              styles.marginFill,
              {
                backgroundColor: account.marginLevel > 180 || account.marginLevel === 0 ? palette.down : palette.amber,
                width: `${Math.min(account.marginLevel || 0, 260) / 2.6}%`,
              },
            ])}
          />
        </View>
        <AppText tone="muted" variant="caption">
          {t('account.marginHint')}
        </AppText>
      </Card>

      <View style={styles.sectionTitle}>
        <AppText variant="subtitle">{t('account.cashLedger')}</AppText>
        <AppText tone="dim" variant="caption">
          {t('account.mockLedger')}
        </AppText>
      </View>
      <Card compact>
        {account.transactions.map((transaction) => (
          <View key={transaction.id} style={StyleSheet.flatten([styles.recordRow, { borderBottomColor: palette.lineSoft }])}>
            <View style={styles.recordMain}>
              <AppText variant="body">{localizeText(transaction.note, locale)}</AppText>
              <AppText tone="muted" variant="caption">
                {transaction.createdAt} · {statusLabel(transaction.status, locale)}
              </AppText>
            </View>
            <AppText tone={transaction.amount >= 0 ? 'up' : 'down'} variant="body">
              {formatMoney(transaction.amount, account.currency, 2, locale)}
            </AppText>
          </View>
        ))}
      </Card>

      <Card>
        <AppText tone="amber" variant="caption">
          {t('risk.general')}
        </AppText>
      </Card>

      <UpgradeChatCard />
    </Screen>
  );
}

function CommissionScreen() {
  const { locale, palette, t } = useProductSettings();

  return (
    <Screen subtitle={t('commission.subtitle')} title={t('commission.title')}>
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

const styles = StyleSheet.create({
  marginFill: {
    borderRadius: 999,
    height: 8,
  },
  marginTrack: {
    borderRadius: 999,
    height: 8,
    marginBottom: 10,
    overflow: 'hidden',
  },
  metricRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
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
});
