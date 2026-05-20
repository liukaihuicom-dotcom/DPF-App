import { Alert, Platform, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { ActionButton } from '@/src/components/ActionButton';
import { Card } from '@/src/components/Card';
import { Metric } from '@/src/components/Metric';
import { Screen } from '@/src/components/Screen';
import { AppText } from '@/src/components/Typography';
import {
  directionLabel,
  formatMoney,
  formatNumber,
  formatPrice,
  formatVolumeMillions,
  localizeText,
  statusLabel,
} from '@/src/domain/format';
import { useToast } from '@/src/feedback/Toast';
import { notifySuccess, notifyWarning } from '@/src/feedback/haptics';
import { useProductSettings } from '@/src/settings/ProductSettings';
import { useBroker } from '@/src/state/BrokerStore';

export default function PortfolioScreen() {
  const { role } = useBroker();

  return role === 'partner' ? <PartnerClientsScreen /> : <TraderPortfolioScreen />;
}

function TraderPortfolioScreen() {
  const { closePosition, findInstrument, orders, positions } = useBroker();
  const { locale, palette, t } = useProductSettings();
  const toast = useToast();
  const pnl = positions.reduce((total, position) => total + position.unrealizedPnl, 0);
  const confirmClose = (positionId: string, symbol: string) => {
    const close = () => {
      closePosition(positionId);
      void notifySuccess();
      toast.show({
        message: t('portfolio.closeSuccessMessage', { symbol }),
        title: t('portfolio.closeSuccessTitle'),
        tone: 'success',
      });
    };

    void notifyWarning();

    if (Platform.OS === 'web') {
      if (window.confirm(t('portfolio.closeConfirmMessage', { symbol }))) {
        close();
      }
      return;
    }

    Alert.alert(t('portfolio.closeConfirmTitle'), t('portfolio.closeConfirmMessage', { symbol }), [
      { style: 'cancel', text: t('common.cancel') },
      { onPress: close, style: 'destructive', text: t('common.confirm') },
    ]);
  };

  return (
    <Screen subtitle={t('portfolio.subtitle')} title={t('portfolio.title')}>
      <Card highlight>
        <View style={styles.metricRow}>
          <Metric label={t('portfolio.unrealizedPnl')} tone={pnl >= 0 ? 'up' : 'down'} value={formatMoney(pnl, 'USD', 2, locale)} />
          <Metric label={t('portfolio.current')} value={`${positions.length}`} />
        </View>
      </Card>

      <View style={styles.sectionTitle}>
        <AppText variant="subtitle">{t('portfolio.current')}</AppText>
        <AppText tone="dim" variant="caption">
          {t('portfolio.liveQuotes')}
        </AppText>
      </View>

      {positions.length === 0 ? (
        <Card>
          <AppText tone="muted">{t('portfolio.emptyPositions')}</AppText>
        </Card>
      ) : (
        positions.map((position) => {
          const instrument = findInstrument(position.instrumentId);
          return (
            <Card key={position.id}>
              <View style={styles.positionTop}>
                <View>
                  <AppText variant="subtitle">{position.symbol}</AppText>
                  <AppText tone="muted" variant="caption">
                    {directionLabel(position.direction, locale)} · {formatNumber(position.lots, 2, locale)} {t('common.lots')}
                  </AppText>
                </View>
                <AppText tone={position.unrealizedPnl >= 0 ? 'up' : 'down'} variant="number">
                  {formatMoney(position.unrealizedPnl, 'USD', 2, locale)}
                </AppText>
              </View>
              <View style={styles.grid}>
                <Metric label={t('portfolio.openPrice')} value={instrument ? formatPrice(instrument, position.openPrice) : position.openPrice.toString()} />
                <Metric label={t('order.fillPrice')} value={instrument ? formatPrice(instrument, position.currentPrice) : position.currentPrice.toString()} />
                <Metric label={t('account.usedMargin')} value={formatMoney(position.marginUsed, 'USD', 2, locale)} />
              </View>
              <ActionButton
                label={t('portfolio.marketClose')}
                onPress={() => confirmClose(position.id, position.symbol)}
                tone={position.unrealizedPnl >= 0 ? 'up' : 'down'}
              />
            </Card>
          );
        })
      )}

      <View style={styles.sectionTitle}>
        <AppText variant="subtitle">{t('portfolio.orderRecords')}</AppText>
        <AppText tone="dim" variant="caption">
          {t('portfolio.latestFirst')}
        </AppText>
      </View>
      <Card compact>
        {orders.length === 0 ? (
          <AppText tone="muted">{t('portfolio.emptyOrders')}</AppText>
        ) : (
          orders.map((order) => (
            <View key={order.id} style={StyleSheet.flatten([styles.orderRow, { borderBottomColor: palette.lineSoft }])}>
              <View style={styles.orderMain}>
                <AppText variant="body">{order.symbol}</AppText>
                <AppText tone="muted" variant="caption">
                  {directionLabel(order.direction, locale)} · {order.lots} {t('common.lots')} · {order.createdAt}
                </AppText>
              </View>
              <View style={styles.orderSide}>
                <AppText tone={order.direction === 'buy' ? 'up' : 'down'} variant="body">
                  {order.filledPrice.toFixed(order.symbol.includes('JPY') ? 3 : 5)}
                </AppText>
                <AppText tone="dim" variant="caption">
                  {statusLabel(order.status, locale)}
                </AppText>
              </View>
            </View>
          ))
        )}
      </Card>
    </Screen>
  );
}

function PartnerClientsScreen() {
  const { partnerClients, upgradeRequest } = useBroker();
  const { locale, palette, t } = useProductSettings();
  const active = partnerClients.filter((client) => client.status === 'active').length;
  const volume = partnerClients.reduce((total, client) => total + client.monthlyVolume, 0);
  const pending = partnerClients.filter((client) => client.upgradeStatus === 'pending').length;

  return (
    <Screen subtitle={t('partner.dashboardSubtitle')} title={t('tabs.clients')}>
      <Card highlight>
        <View style={styles.metricRow}>
          <Metric label={t('partner.activeClients')} tone="down" value={`${active}`} />
          <Metric label={t('partner.clientVolume')} value={formatVolumeMillions(volume, locale)} />
          <Metric label={t('upgrade.pendingCount')} tone="amber" value={`${pending}`} />
        </View>
      </Card>

      {upgradeRequest.status === 'pending' ? (
        <View style={styles.sectionTitle}>
          <AppText variant="subtitle">{t('upgrade.pendingList')}</AppText>
          <AppText tone="amber" variant="caption">
            {upgradeRequest.applicantName}
          </AppText>
        </View>
      ) : null}

      {partnerClients.map((client) => (
        <Card key={client.id}>
          <View style={styles.positionTop}>
            <View>
              <AppText variant="subtitle">{client.name}</AppText>
              <AppText tone="muted" variant="caption">
                {client.country} · {client.joinedAt} · {localizeText(client.lastActive, locale)} · {client.role === 'partner' ? t('role.partner') : t('role.trader')}
              </AppText>
            </View>
            <View style={styles.badgeStack}>
              <View style={StyleSheet.flatten([styles.statusPill, { backgroundColor: palette.panelSoft, borderColor: palette.line }])}>
                <AppText tone={client.status === 'active' ? 'down' : client.status === 'funded' ? 'blue' : 'muted'} variant="caption">
                  {statusLabel(client.status, locale)}
                </AppText>
              </View>
              {client.upgradeStatus !== 'none' ? (
                <View
                  style={StyleSheet.flatten([
                    styles.statusPill,
                    {
                      backgroundColor: client.upgradeStatus === 'approved' ? `${palette.down}18` : client.upgradeStatus === 'pending' ? `${palette.amber}18` : palette.panelSoft,
                      borderColor: client.upgradeStatus === 'approved' ? palette.down : client.upgradeStatus === 'pending' ? palette.amber : palette.line,
                    },
                  ])}>
                  <AppText tone={client.upgradeStatus === 'approved' ? 'down' : client.upgradeStatus === 'pending' ? 'amber' : 'muted'} variant="caption">
                    {t(`upgrade.status.${client.upgradeStatus}`)}
                  </AppText>
                </View>
              ) : null}
            </View>
          </View>
          <View style={styles.grid}>
            <Metric label={t('partner.netDeposit')} value={formatMoney(client.netDeposit, 'USD', 2, locale)} />
            <Metric label={t('partner.monthVolume')} value={formatVolumeMillions(client.monthlyVolume, locale)} />
            <Metric label={t('partner.openPositions')} value={`${client.openPositions}`} />
          </View>
          <ActionButton label={t('upgrade.viewProfile')} onPress={() => router.push(`/client/${client.id}`)} tone={client.upgradeStatus === 'pending' ? 'amber' : 'neutral'} />
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
    marginTop: 12,
  },
  metricRow: {
    flexDirection: 'row',
    gap: 12,
  },
  orderMain: {
    flex: 1,
    minWidth: 0,
  },
  orderRow: {
    alignItems: 'center',
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 12,
    minHeight: 58,
    paddingVertical: 10,
  },
  orderSide: {
    alignItems: 'flex-end',
    minWidth: 92,
  },
  positionTop: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
  badgeStack: {
    alignItems: 'flex-end',
    gap: 5,
  },
  sectionTitle: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  statusPill: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
});
