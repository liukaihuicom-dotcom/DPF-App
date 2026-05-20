import { StyleSheet, View } from 'react-native';

import { Card } from '@/src/components/Card';
import { InstrumentRow } from '@/src/components/InstrumentRow';
import { Metric } from '@/src/components/Metric';
import { Screen } from '@/src/components/Screen';
import { AppText } from '@/src/components/Typography';
import { formatPercent, formatPrice, localizeText } from '@/src/domain/format';
import { getDisplayChange } from '@/src/domain/trading';
import { useProductSettings } from '@/src/settings/ProductSettings';
import { useBroker } from '@/src/state/BrokerStore';

export default function MarketsScreen() {
  const { instruments } = useBroker();
  const { locale, palette, t } = useProductSettings();
  const topMovers = [...instruments].sort((a, b) => Math.abs(getDisplayChange(b).changePercent) - Math.abs(getDisplayChange(a).changePercent));
  const anchor = topMovers[0];
  const anchorChange = getDisplayChange(anchor);

  return (
    <Screen subtitle={t('markets.subtitle')} title={t('markets.title')}>
      <Card highlight>
        <View style={styles.heroTop}>
          <View style={styles.copyBlock}>
            <AppText tone="dim" variant="eyebrow">
              {t('markets.hot')}
            </AppText>
            <AppText variant="title">{anchor.symbol}</AppText>
            <AppText numberOfLines={1} tone="muted" variant="caption">
              {localizeText(anchor.name, locale)}
            </AppText>
          </View>
          <View style={styles.quoteBlock}>
            <AppText tone={anchorChange.changePercent >= 0 ? 'up' : 'down'} variant="number">
              {formatPrice(anchor, anchor.ask)}
            </AppText>
            <AppText tone={anchorChange.changePercent >= 0 ? 'up' : 'down'} variant="caption">
              {formatPercent(anchorChange.changePercent)}
            </AppText>
          </View>
        </View>
        <View style={styles.metricRow}>
          <Metric label={t('instrument.dayHigh')} value={formatPrice(anchor, anchor.dayHigh)} />
          <Metric label={t('instrument.dayLow')} value={formatPrice(anchor, anchor.dayLow)} />
          <Metric label={t('common.spread')} value={`${anchor.spread}`} />
        </View>
      </Card>

      <View style={styles.sectionTitle}>
        <AppText variant="subtitle">{t('markets.all')}</AppText>
        <AppText tone="dim" variant="caption">
          {t('home.watchlistCaption')}
        </AppText>
      </View>
      <Card compact>
        <View style={StyleSheet.flatten([styles.headerRow, { borderBottomColor: palette.lineSoft }])}>
          <AppText tone="dim" variant="caption">
            {locale === 'en-US' ? 'Symbol' : '品种'}
          </AppText>
          <AppText tone="dim" variant="caption">
            Bid / Ask
          </AppText>
          <AppText tone="dim" variant="caption">
            %
          </AppText>
        </View>
        {instruments.map((instrument) => (
          <InstrumentRow instrument={instrument} key={instrument.id} />
        ))}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  copyBlock: {
    flex: 1,
    gap: 4,
    minWidth: 0,
  },
  headerRow: {
    alignItems: 'center',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 7,
  },
  heroTop: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  metricRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  quoteBlock: {
    alignItems: 'flex-end',
    minWidth: 104,
  },
  sectionTitle: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
});
