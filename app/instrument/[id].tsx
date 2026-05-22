import { useMemo, useState } from 'react';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Line, Path, Rect, Stop } from 'react-native-svg';

import { InstrumentIcon } from '@/src/components/InstrumentIcon';
import { NativePressable } from '@/src/components/NativePressable';
import { AppIcon } from '@/src/components/AppIcon';
import { HeaderIconButton } from '@/src/components/HeaderIconButton';
import { getQuoteChangeVisual } from '@/src/components/quoteVisuals';
import { Screen } from '@/src/components/Screen';
import { AppText } from '@/src/components/Typography';
import type { Instrument } from '@/src/domain/types';
import { directionLabel, formatMoney, formatNumber, formatPercent, formatPrice, localizeText } from '@/src/domain/format';
import { calculateMargin, getDisplayChange } from '@/src/domain/trading';
import { useToast } from '@/src/feedback/Toast';
import type { TranslationKey } from '@/src/i18n/translations';
import { impactLight } from '@/src/feedback/haptics';
import { useProductSettings } from '@/src/settings/ProductSettings';
import { useBroker } from '@/src/state/BrokerStore';
import type { ThemePalette } from '@/src/theme/colors';
import { typography } from '@/src/theme/tokens';

type Timeframe = '1D' | '1W' | '1M' | '3M' | '1Y';
type DetailTabKey = 'chart' | 'news' | 'signals' | 'specs';

const detailTabs: { id: DetailTabKey; labelKey: 'instrument.tab.chart' | 'instrument.tab.news' | 'instrument.tab.signals' | 'instrument.tab.specs' }[] = [
  { id: 'chart', labelKey: 'instrument.tab.chart' },
  { id: 'specs', labelKey: 'instrument.tab.specs' },
  { id: 'news', labelKey: 'instrument.tab.news' },
  { id: 'signals', labelKey: 'instrument.tab.signals' },
];
export default function InstrumentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { findInstrument } = useBroker();
  const { locale, palette, t } = useProductSettings();
  const toast = useToast();
  const { width } = useWindowDimensions();
  const [selectedTab, setSelectedTab] = useState<DetailTabKey>('chart');
  const instrument = findInstrument(id);
  const chartValues = useMemo(
    () => (instrument ? buildDetailSeries(instrument.sparkline, '3M') : []),
    [instrument],
  );

  if (!instrument) {
    return (
      <Screen back title={t('common.invalidInstrument')}>
        <AppText variant="title">{t('common.invalidInstrument')}</AppText>
      </Screen>
    );
  }

  const { change, changePercent } = getDisplayChange(instrument);
  const quoteVisual = getQuoteChangeVisual(changePercent, palette);
  const chartWidth = Math.min(Math.max(width - 48, 312), 382);
  const sampleLots = instrument.symbol === 'XAU/USD' ? 0.2 : 0.1;
  const weekHigh = Math.max(instrument.dayHigh, ...instrument.sparkline);
  const weekLow = Math.min(instrument.dayLow, ...instrument.sparkline);
  const showPlaceholder = (action: string) => {
    void impactLight();
    toast.show({
      message: t('top.placeholderMessage'),
      title: t('top.placeholderTitle', { action }),
    });
  };
  const openOrder = (direction: 'buy' | 'sell') => {
    void impactLight();
    router.push(`/order/${instrument.id}?direction=${direction}` as never);
  };

  return (
    <View style={StyleSheet.flatten([styles.shell, { backgroundColor: palette.bg }])}>
      <Stack.Screen options={{ title: instrument.symbol }} />
      <SafeAreaView edges={['top']} style={styles.safe}>
        <ScrollView
          contentContainerStyle={styles.content}
          contentInsetAdjustmentBehavior="never"
          showsVerticalScrollIndicator={false}
          style={StyleSheet.flatten([styles.scroller, { backgroundColor: palette.bg }])}>
          <View style={StyleSheet.flatten([styles.detailPage, { backgroundColor: palette.panel }])}>
            <View style={styles.pageActions}>
              <HeaderIconButton
                accessibilityLabel={t('top.back')}
                color={palette.text}
                icon="navigateBack"
                onPress={() => {
                  void impactLight();
                  router.back();
                }}
                tone="default"
              />

              <View style={StyleSheet.flatten([styles.actionCapsule, { backgroundColor: palette.panelSoft, borderColor: palette.line }])}>
                <HeaderIconButton
                  accessibilityLabel={t('instrument.share')}
                  color={palette.text}
                  icon="partnerNetwork"
                  onPress={() => showPlaceholder(t('instrument.share'))}
                  style={styles.capsuleButton}
                  tone="default"
                  variant="ghost"
                />
                <HeaderIconButton
                  accessibilityLabel={t('top.more')}
                  icon="moreDots"
                  onPress={() => showPlaceholder(t('top.more'))}
                  style={styles.capsuleButton}
                  variant="ghost"
                />
              </View>
            </View>

            <View style={styles.identityBlock}>
              <InstrumentIcon instrument={instrument} size={52} />
              <View style={styles.identityCopy}>
                <AppText adjustsFontSizeToFit numberOfLines={1} style={StyleSheet.flatten([styles.instrumentTitle, { color: palette.text }])}>
                  {instrument.symbol}
                </AppText>
                <AppText numberOfLines={1} style={StyleSheet.flatten([styles.instrumentSubtitle, { color: palette.textDim }])}>
                  {localizeText(instrument.name, locale)}
                </AppText>
              </View>
            </View>

            <View style={styles.priceBlock}>
              <View>
                <AppText style={StyleSheet.flatten([styles.lastPrice, { color: palette.text }])}>{formatPrice(instrument, instrument.bid)}</AppText>
                <AppText style={StyleSheet.flatten([styles.inlineChange, { color: quoteVisual.color }])}>
                  {changePercent >= 0 ? '▲' : '▼'} {change > 0 ? '+' : ''}
                  {formatPrice(instrument, change)} ({formatPercent(changePercent)})
                </AppText>
              </View>
              <QuoteStat label={t('instrument.dayHigh')} palette={palette} tone="down" value={formatPrice(instrument, instrument.dayHigh)} />
            </View>

            <View style={styles.quoteInfoGrid}>
              <View style={styles.quoteInfoColumn}>
                <QuoteStat label={t('instrument.open')} palette={palette} value={formatPrice(instrument, instrument.previousClose)} />
                <QuoteStat label={t('instrument.prevClose')} palette={palette} value={formatPrice(instrument, instrument.previousClose)} />
              </View>
              <View style={styles.quoteInfoColumn}>
                <QuoteStat label={t('instrument.dayLow')} palette={palette} tone="up" value={formatPrice(instrument, instrument.dayLow)} />
                <QuoteStat label={t('instrument.weekHigh')} palette={palette} value={formatPrice(instrument, weekHigh)} />
              </View>
              <View style={styles.quoteInfoColumn}>
                <QuoteStat label={t('instrument.weekLow')} palette={palette} value={formatPrice(instrument, weekLow)} />
                <QuoteStat label={t('common.spread')} palette={palette} value={`${instrument.spread}`} />
              </View>
            </View>

            <View style={StyleSheet.flatten([styles.divider, { backgroundColor: palette.lineSoft }])} />

            <View style={styles.detailTabs}>
              {detailTabs.map((tab) => {
                const selected = selectedTab === tab.id;
                const label = t(tab.labelKey);

                return (
                  <NativePressable
                    accessibilityLabel={label}
                    accessibilityRole="tab"
                    accessibilityState={{ selected }}
                    key={tab.id}
                    minTouch={40}
                    onPress={() => {
                      void impactLight();
                      setSelectedTab(tab.id);
                    }}
                    style={styles.detailTabButton}>
                    <AppText style={StyleSheet.flatten([styles.detailTabText, { color: selected ? palette.text : palette.textMuted }])}>
                      {label}
                    </AppText>
                    <View style={StyleSheet.flatten([styles.detailTabIndicator, { backgroundColor: selected ? palette.brand : 'transparent' }])} />
                  </NativePressable>
                );
              })}
            </View>

            {selectedTab === 'chart' ? (
              <>
                <DetailChart
                  color={quoteVisual.color}
                  instrument={instrument}
                  palette={palette}
                  rangeEndLabel={t('instrument.now')}
                  rangeStartLabel={t('instrument.open')}
                  values={chartValues}
                  width={chartWidth}
                />
                <VolumeBars color={quoteVisual.color} palette={palette} values={chartValues} width={chartWidth} />
              </>
            ) : null}

            <InstrumentTabPanel
              instrument={instrument}
              locale={locale}
              palette={palette}
              sampleLots={sampleLots}
              selectedTab={selectedTab}
              t={t}
            />

            <View style={StyleSheet.flatten([styles.riskPanel, { borderColor: palette.lineSoft }])}>
              <AppText style={StyleSheet.flatten([styles.riskText, { color: palette.amber }])}>{t('risk.general')}</AppText>
            </View>
          </View>
        </ScrollView>

        <SafeAreaView edges={['bottom']} style={StyleSheet.flatten([styles.footerSafe, { backgroundColor: palette.panelHigh, borderTopColor: palette.lineSoft }])}>
          <View style={styles.tradeRow}>
            <NativePressable
              accessibilityLabel={`${directionLabel('sell', locale)} ${formatPrice(instrument, instrument.bid)}`}
              onPress={() => openOrder('sell')}
              style={StyleSheet.flatten([styles.tradeButton, { backgroundColor: palette.up }])}>
              <AppText adjustsFontSizeToFit numberOfLines={1} style={StyleSheet.flatten([styles.tradeText, { color: palette.white }])}>
                {directionLabel('sell', locale)} {formatPrice(instrument, instrument.bid)}
              </AppText>
            </NativePressable>
            <NativePressable
              accessibilityLabel={`${directionLabel('buy', locale)} ${formatPrice(instrument, instrument.ask)}`}
              onPress={() => openOrder('buy')}
              style={StyleSheet.flatten([styles.tradeButton, { backgroundColor: palette.down }])}>
              <AppText adjustsFontSizeToFit numberOfLines={1} style={StyleSheet.flatten([styles.tradeText, { color: palette.white }])}>
                {directionLabel('buy', locale)} {formatPrice(instrument, instrument.ask)}
              </AppText>
            </NativePressable>
          </View>
        </SafeAreaView>
      </SafeAreaView>
    </View>
  );
}

function InstrumentTabPanel({
  instrument,
  locale,
  palette,
  sampleLots,
  selectedTab,
  t,
}: {
  instrument: Instrument;
  locale: 'en-US' | 'zh-CN';
  palette: ThemePalette;
  sampleLots: number;
  selectedTab: DetailTabKey;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
}) {
  if (selectedTab === 'chart' || selectedTab === 'specs') {
    return (
      <View style={styles.dataGrid}>
        <MetricColumn
          items={[
            [t('instrument.open'), formatPrice(instrument, instrument.previousClose)],
            [t('common.spread'), `${instrument.spread}`],
            [t('instrument.dayLow'), formatPrice(instrument, instrument.dayLow)],
          ]}
          palette={palette}
        />
        <View style={StyleSheet.flatten([styles.gridDivider, { backgroundColor: palette.line }])} />
        <MetricColumn
          items={[
            [t('instrument.dayHigh'), formatPrice(instrument, instrument.dayHigh)],
            [t('common.leverage'), `${instrument.leverage}x`],
            [t('instrument.marginSample', { lots: sampleLots }), formatMoney(calculateMargin(instrument, sampleLots, instrument.ask), 'USD', 0, locale)],
          ]}
          palette={palette}
        />
        <View style={StyleSheet.flatten([styles.gridDivider, { backgroundColor: palette.line }])} />
        <MetricColumn
          items={[
            [t('instrument.baseCurrency'), instrument.baseCurrency],
            [t('instrument.quoteCurrency'), instrument.quoteCurrency],
            [t('common.contractSize'), formatNumber(instrument.contractSize, 0, locale)],
          ]}
          palette={palette}
        />
      </View>
    );
  }

  if (selectedTab === 'news') {
    return (
      <View style={styles.pagePanel}>
        <AppText style={StyleSheet.flatten([styles.newsSource, { color: palette.textDim }])}>{t('instrument.marketBriefSource')}</AppText>
        <AppText style={StyleSheet.flatten([styles.newsTitle, { color: palette.text }])}>{t('instrument.marketBriefTitle')}</AppText>
        <AppText style={StyleSheet.flatten([styles.panelBodyText, { color: palette.textMuted }])}>{t('instrument.marketBriefBody')}</AppText>
        <View style={styles.newsFooter}>
          <AppText style={StyleSheet.flatten([styles.newsBrand, { color: palette.textMuted }])}>dupoin/market</AppText>
          <AppText style={StyleSheet.flatten([styles.marketStatus, { color: palette.textDim }])}>{t('instrument.marketOpen')}</AppText>
        </View>
      </View>
    );
  }

  const { changePercent } = getDisplayChange(instrument);

  return (
    <View style={styles.pagePanel}>
      <AppText style={StyleSheet.flatten([styles.newsSource, { color: palette.textDim }])}>{t('instrument.signalSource')}</AppText>
      <AppText style={StyleSheet.flatten([styles.newsTitle, { color: palette.text }])}>{t('instrument.signalTitle')}</AppText>
      <AppText style={StyleSheet.flatten([styles.panelBodyText, { color: palette.textMuted }])}>{t('instrument.signalBody')}</AppText>
      <View style={styles.signalRows}>
        {[
          [t('instrument.signalBias'), changePercent >= 0 ? t('common.buy') : t('common.sell')],
          [t('instrument.signalRisk'), t('risk.general')],
        ].map(([label, value]) => (
          <View key={label} style={StyleSheet.flatten([styles.signalRow, { borderTopColor: palette.lineSoft }])}>
            <AppText style={StyleSheet.flatten([styles.metricLabel, { color: palette.textDim }])}>{label}</AppText>
            <AppText style={StyleSheet.flatten([styles.metricValue, { color: palette.text }])}>{value}</AppText>
          </View>
        ))}
      </View>
    </View>
  );
}

function DetailChart({
  color,
  instrument,
  palette,
  rangeEndLabel,
  rangeStartLabel,
  values,
  width,
}: {
  color: string;
  instrument: Instrument;
  palette: ThemePalette;
  rangeEndLabel: string;
  rangeStartLabel: string;
  values: number[];
  width: number;
}) {
  const height = 258;
  const axisWidth = 68;
  const chartWidth = width - axisWidth;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const padding = Math.max((max - min) * 0.12, instrument.pipSize * 8);
  const scaleMin = min - padding;
  const scaleMax = max + padding;
  const range = scaleMax - scaleMin || 1;
  const topPad = 14;
  const bottomPad = 34;
  const plotHeight = height - topPad - bottomPad;
  const points = values.map((value, index) => {
    const x = (index / Math.max(values.length - 1, 1)) * chartWidth;
    const y = topPad + plotHeight - ((value - scaleMin) / range) * plotHeight;

    return { x, y };
  });
  const linePath = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - bottomPad} L 0 ${height - bottomPad} Z`;
  const gridY = [topPad, topPad + plotHeight * 0.5, topPad + plotHeight];
  const labels = [scaleMax, (scaleMax + scaleMin) / 2, scaleMin];
  const gradientId = `detail-chart-${instrument.id}`;

  return (
    <View style={StyleSheet.flatten([styles.chartFrame, { borderColor: palette.lineSoft, width }])}>
      <Svg height={height} width={width}>
        <Defs>
          <LinearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
            <Stop offset="0" stopColor={color} stopOpacity={0.36} />
            <Stop offset="1" stopColor={color} stopOpacity={0.02} />
          </LinearGradient>
        </Defs>
        {gridY.map((y) => (
          <Line key={`grid-${y}`} stroke={palette.lineSoft} strokeOpacity={0.9} strokeWidth={1} x1={0} x2={chartWidth} y1={y} y2={y} />
        ))}
        <Line stroke={palette.lineSoft} strokeOpacity={0.9} strokeWidth={1} x1={chartWidth * 0.66} x2={chartWidth * 0.66} y1={topPad} y2={height - bottomPad} />
        <Path d={areaPath} fill={`url(#${gradientId})`} />
        <Path d={linePath} fill="none" stroke={color} strokeLinejoin="round" strokeWidth={3.4} />
      </Svg>
      <View style={styles.axisLabels}>
        {labels.map((label) => (
          <AppText key={label} style={StyleSheet.flatten([styles.axisText, { color: palette.textMuted }])}>
            {formatPrice(instrument, label)}
          </AppText>
        ))}
      </View>
      <View style={StyleSheet.flatten([styles.chartBaseline, { backgroundColor: palette.textDim }])} />
      <View style={styles.monthLabels}>
        <AppText style={StyleSheet.flatten([styles.monthLabel, { color: palette.textMuted }])}>{rangeStartLabel}</AppText>
        <AppText style={StyleSheet.flatten([styles.monthLabel, { color: palette.textMuted }])}>{rangeEndLabel}</AppText>
      </View>
    </View>
  );
}

function VolumeBars({ color, palette, values, width }: { color: string; palette: ThemePalette; values: number[]; width: number }) {
  const height = 44;
  const barGap = 5;
  const barCount = Math.min(values.length, 40);
  const source = values.slice(-barCount);
  const chartWidth = width - 72;
  const barWidth = Math.max((chartWidth - barGap * (source.length - 1)) / source.length, 2);
  const deltas = source.map((value, index) => Math.abs(value - (source[index - 1] ?? value)));
  const maxDelta = Math.max(...deltas, 1);

  return (
    <View style={StyleSheet.flatten([styles.volumeWrap, { width }])}>
      <Svg height={height} width={chartWidth}>
        {source.map((_, index) => {
          const delta = deltas[index];
          const barHeight = 4 + (delta / maxDelta) * 30;
          const x = index * (barWidth + barGap);

          return <Rect fill={index % 7 === 0 ? color : palette.textDim} height={barHeight} key={`bar-${index}`} opacity={0.78} rx={barWidth / 2} width={barWidth} x={x} y={height - barHeight - 6} />;
        })}
      </Svg>
    </View>
  );
}

function QuoteStat({ label, palette, tone = 'default', value }: { label: string; palette: ThemePalette; tone?: 'default' | 'down' | 'up'; value: string }) {
  const toneColor = tone === 'down' ? palette.down : tone === 'up' ? palette.up : palette.text;

  return (
    <View style={styles.quoteStat}>
      <AppText numberOfLines={1} style={StyleSheet.flatten([styles.quoteStatLabel, { color: palette.textDim }])}>
        {label}
      </AppText>
      <AppText adjustsFontSizeToFit numberOfLines={1} style={StyleSheet.flatten([styles.quoteStatValue, { color: toneColor }])}>
        {value}
      </AppText>
    </View>
  );
}

function MetricColumn({ items, palette }: { items: [string, string][]; palette: ThemePalette }) {
  return (
    <View style={styles.metricColumn}>
      {items.map(([label, value]) => (
        <View key={label} style={styles.metricLine}>
          <AppText numberOfLines={1} style={StyleSheet.flatten([styles.metricLabel, { color: palette.textDim }])}>
            {label}
          </AppText>
          <AppText adjustsFontSizeToFit numberOfLines={1} style={StyleSheet.flatten([styles.metricValue, { color: palette.text }])}>
            {value}
          </AppText>
        </View>
      ))}
    </View>
  );
}

function buildDetailSeries(values: number[], timeframe: Timeframe) {
  const multipliers: Record<Timeframe, number> = {
    '1D': 0.38,
    '1W': 0.68,
    '1M': 1,
    '3M': 1.28,
    '1Y': 1.62,
  };
  const source = values.length > 1 ? values : [values[0] ?? 1, values[0] ?? 1];
  const expanded: number[] = [];
  const volatility = (Math.max(...source) - Math.min(...source) || source[0] * 0.002) * multipliers[timeframe];

  source.forEach((value, index) => {
    const next = source[index + 1] ?? value;
    const segmentCount = index === source.length - 1 ? 1 : 5;

    for (let step = 0; step < segmentCount; step += 1) {
      const progress = step / segmentCount;
      const wave = Math.sin((expanded.length + 1) * 1.7) * volatility * 0.12;
      const notch = expanded.length % 9 === 0 ? -volatility * 0.18 : expanded.length % 7 === 0 ? volatility * 0.1 : 0;
      expanded.push(value + (next - value) * progress + wave + notch);
    }
  });

  return expanded.slice(-42);
}

const styles = StyleSheet.create({
  actionCapsule: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    minHeight: 44,
    paddingHorizontal: 10,
  },
  axisLabels: {
    gap: 68,
    position: 'absolute',
    right: 0,
    top: 12,
    width: 64,
  },
  axisText: {
    ...typography.captionSm,
  },
  capsuleButton: {
    width: 40,
  },
  chartBaseline: {
    bottom: 34,
    height: 1,
    left: 0,
    opacity: 0.7,
    position: 'absolute',
    right: 68,
  },
  chartFrame: {
    borderWidth: 1,
    height: 258,
    marginTop: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  content: {
    paddingBottom: 132,
  },
  dataGrid: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 18,
  },
  divider: {
    height: 1,
    marginTop: 18,
  },
  detailPage: {
    minHeight: 780,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  detailTabButton: {
    gap: 6,
    justifyContent: 'flex-end',
    minHeight: 42,
  },
  detailTabIndicator: {
    borderRadius: 999,
    height: 3,
  },
  detailTabs: {
    flexDirection: 'row',
    gap: 24,
    marginTop: 8,
  },
  detailTabText: {
    ...typography.titleSm,
  },
  footerSafe: {
    borderTopWidth: 1,
  },
  gridDivider: {
    width: 1,
  },
  identityBlock: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: 10,
    marginTop: 30,
    minWidth: 0,
  },
  identityCopy: {
    flex: 1,
    minWidth: 0,
  },
  inlineChange: {
    ...typography.titleMd,
    marginTop: 4,
  },
  instrumentSubtitle: {
    ...typography.bodySm,
    minWidth: 0,
    paddingBottom: 7,
  },
  instrumentTitle: {
    ...typography.displayXl,
  },
  lastPrice: {
    ...typography.quote,
  },
  marketStatus: {
    ...typography.bodyMd,
  },
  metricColumn: {
    flex: 1,
    gap: 10,
    minWidth: 0,
  },
  metricLabel: {
    ...typography.caption,
  },
  metricLine: {
    gap: 2,
  },
  metricValue: {
    ...typography.titleMd,
  },
  monthLabel: {
    ...typography.captionSm,
  },
  monthLabels: {
    bottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    left: 12,
    position: 'absolute',
    right: 86,
  },
  newsBrand: {
    ...typography.caption,
  },
  newsFooter: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  newsSource: {
    ...typography.caption,
    marginTop: 12,
  },
  newsTitle: {
    ...typography.titleMd,
  },
  pagePanel: {
    gap: 10,
    marginTop: 18,
  },
  pageActions: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priceBlock: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  quoteInfoColumn: {
    flex: 1,
    gap: 10,
    minWidth: 0,
  },
  quoteInfoGrid: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 16,
  },
  quoteStat: {
    gap: 2,
    minWidth: 0,
  },
  quoteStatLabel: {
    ...typography.captionSm,
  },
  quoteStatValue: {
    ...typography.titleMd,
  },
  riskPanel: {
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 24,
    padding: 14,
  },
  riskText: {
    ...typography.captionSm,
  },
  panelBodyText: {
    ...typography.bodySm,
  },
  safe: {
    flex: 1,
  },
  scroller: {
    flex: 1,
  },
  shell: {
    flex: 1,
  },
  signalRow: {
    borderTopWidth: 1,
    gap: 4,
    paddingTop: 10,
  },
  signalRows: {
    gap: 10,
    marginTop: 4,
  },
  tradeButton: {
    alignItems: 'center',
    borderRadius: 18,
    flex: 1,
    minHeight: 54,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  tradeRow: {
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 16,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  tradeText: {
    ...typography.buttonMd,
  },
  volumeWrap: {
    alignItems: 'flex-start',
    height: 44,
    justifyContent: 'center',
    marginTop: 8,
  },
});
