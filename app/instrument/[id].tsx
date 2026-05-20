import { router, Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ActionButton } from '@/src/components/ActionButton';
import { Card } from '@/src/components/Card';
import { Metric } from '@/src/components/Metric';
import { Screen } from '@/src/components/Screen';
import { Sparkline } from '@/src/components/Sparkline';
import { AppText } from '@/src/components/Typography';
import { directionLabel, formatMoney, formatPercent, formatPrice, localizeText } from '@/src/domain/format';
import { calculateMargin, getDisplayChange } from '@/src/domain/trading';
import { impactLight } from '@/src/feedback/haptics';
import { useProductSettings } from '@/src/settings/ProductSettings';
import { useBroker } from '@/src/state/BrokerStore';

export default function InstrumentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { findInstrument } = useBroker();
  const { locale, palette, t } = useProductSettings();
  const instrument = findInstrument(id);

  if (!instrument) {
    return (
      <Screen back title={t('common.invalidInstrument')}>
        <AppText variant="title">{t('common.invalidInstrument')}</AppText>
      </Screen>
    );
  }

  const { change, changePercent } = getDisplayChange(instrument);
  const positive = changePercent >= 0;
  const sampleLots = instrument.symbol === 'XAU/USD' ? 0.2 : 0.1;
  const openOrder = (direction: 'buy' | 'sell') => {
    void impactLight();
    router.push(`/order/${instrument.id}?direction=${direction}`);
  };

  return (
    <Screen
      back
      contentInsetBottom={16}
      stickyFooter={
        <View style={styles.tradeRow}>
          <ActionButton
            label={`${directionLabel('sell', locale)} ${formatPrice(instrument, instrument.bid)}`}
            onPress={() => openOrder('sell')}
            style={styles.tradeButton}
            tone="down"
          />
          <ActionButton
            label={`${directionLabel('buy', locale)} ${formatPrice(instrument, instrument.ask)}`}
            onPress={() => openOrder('buy')}
            style={styles.tradeButton}
            tone="up"
          />
        </View>
      }
      subtitle={localizeText(instrument.name, locale)}
      title={instrument.symbol}>
      <Stack.Screen options={{ title: instrument.symbol }} />
      <View style={styles.header}>
        <View>
          <AppText tone="dim" variant="eyebrow">
            {t('common.contract')}
          </AppText>
          <AppText variant="subtitle">{instrument.symbol}</AppText>
          <AppText tone="muted" variant="caption">
            {localizeText(instrument.name, locale)} · {localizeText(instrument.tradingHours, locale)}
          </AppText>
        </View>
        <AppText tone={positive ? 'up' : 'down'} variant="number">
          {formatPercent(changePercent)}
        </AppText>
      </View>

      <Card highlight>
        <View style={styles.quoteLine}>
          <View>
            <AppText tone="dim" variant="caption">
              {t('common.bid')}
            </AppText>
            <AppText tone={positive ? 'up' : 'down'} variant="largeNumber">
              {formatPrice(instrument, instrument.bid)}
            </AppText>
          </View>
          <View style={styles.askBox}>
            <AppText tone="dim" variant="caption">
              {t('common.ask')}
            </AppText>
            <AppText tone={positive ? 'up' : 'down'} variant="number">
              {formatPrice(instrument, instrument.ask)}
            </AppText>
          </View>
        </View>
        <View style={styles.chartWrap}>
          <Sparkline color={positive ? palette.up : palette.down} height={96} values={instrument.sparkline} width={320} />
        </View>
        <AppText tone={positive ? 'up' : 'down'} variant="caption">
          {t('instrument.dayChange')} {change >= 0 ? '+' : ''}
          {formatPrice(instrument, change)}
        </AppText>
      </Card>

      <Card>
        <View style={styles.metricRow}>
          <Metric label={t('common.spread')} value={`${instrument.spread}`} />
          <Metric label={t('common.leverage')} value={`${instrument.leverage}x`} />
          <Metric label={t('instrument.dayHigh')} value={formatPrice(instrument, instrument.dayHigh)} />
        </View>
        <View style={styles.metricRow}>
          <Metric label={t('instrument.dayLow')} value={formatPrice(instrument, instrument.dayLow)} />
          <Metric label={t('common.contractSize')} value={`${instrument.contractSize}`} />
          <Metric
            label={t('instrument.marginSample', { lots: sampleLots })}
            value={formatMoney(calculateMargin(instrument, sampleLots, instrument.ask), 'USD', 0, locale)}
          />
        </View>
      </Card>

      <Card>
        <AppText tone="amber" variant="caption">
          {t('risk.general')}
        </AppText>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  askBox: {
    alignItems: 'flex-end',
  },
  chartWrap: {
    alignItems: 'center',
    marginVertical: 12,
    overflow: 'hidden',
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  metricRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  quoteLine: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tradeButton: {
    flex: 1,
  },
  tradeRow: {
    flexDirection: 'row',
    gap: 12,
  },
});
