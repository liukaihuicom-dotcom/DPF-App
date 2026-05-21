import { useLocalSearchParams, router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Line, Path, Polyline } from 'react-native-svg';

import { useBottomSheet } from '@/src/components/BottomSheet';
import { Card } from '@/src/components/Card';
import { NativePressable } from '@/src/components/NativePressable';
import { PhosphorIcon, type PhosphorIconName } from '@/src/components/PhosphorIcon';
import { Screen } from '@/src/components/Screen';
import { Sparkline } from '@/src/components/Sparkline';
import { StatusPill, type StatusPillTone } from '@/src/components/StatusPill';
import { AppText } from '@/src/components/Typography';
import { buildTradingAccountProfiles, getAccountStatusLabel } from '@/src/domain/accountProfiles';
import { directionLabel, formatMoney, formatNumber } from '@/src/domain/format';
import { useToast } from '@/src/feedback/Toast';
import { useProductSettings } from '@/src/settings/ProductSettings';
import { useBroker } from '@/src/state/BrokerStore';

export default function AccountDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { account, positions } = useBroker();
  const { locale, palette, tradingAccountCountPreset, tradingAccountDataPreset, tradingAccountScenario, tradingAccountStatusPreset } = useProductSettings();
  const bottomSheet = useBottomSheet();
  const toast = useToast();
  const profiles = buildTradingAccountProfiles(account, positions, tradingAccountScenario, {
    countPreset: tradingAccountCountPreset,
    dataPreset: tradingAccountDataPreset,
    statusPreset: tradingAccountStatusPreset,
  });
  const profile = profiles.find((item) => item.id === id) ?? profiles[0];
  const statusTone: StatusPillTone = profile.group === 'demo' ? 'brand' : profile.group === 'readOnly' ? 'warning' : 'success';
  const closedPnlPeriods = buildClosedPnlPeriods(profile.realizedPnl);
  const positionRows = positions.length > 0
    ? positions.map((position) => ({
        direction: position.direction,
        id: position.id,
        lots: formatNumber(position.lots, 2, locale),
        pnl: position.unrealizedPnl,
        priceRange: `${formatNumber(position.openPrice, 2, locale)} - ${formatNumber(position.currentPrice, 2, locale)}`,
        symbol: position.symbol.replace('/', ''),
      }))
    : getDetailDemoPositions(locale);
  const openMoreMenu = () => {
    bottomSheet.show({
      title: locale === 'en-US' ? 'More actions' : '更多操作',
      subtitle: `${profile.accountNo} · ${profile.currency}`,
      content: (
      <AccountMoreSheet
        onSelect={(label, tone) => {
          bottomSheet.hide();
          toast.show({
            message: locale === 'en-US' ? 'Demo action only. Account data was not changed.' : '当前为演示操作，账户数据未改变。',
            title: label,
            tone,
          });
        }}
      />
      ),
    });
  };

  return (
    <Screen
      align="center"
      back
      rightActions={[{ icon: 'dots-three', label: locale === 'en-US' ? 'More' : '更多', onPress: openMoreMenu }]}
      title={locale === 'en-US' ? 'Account Details' : 'Account Details'}>
      <Card compact>
        <View style={styles.detailHeader}>
          <View style={StyleSheet.flatten([styles.walletIcon, { backgroundColor: palette.panelSoft }])}>
            <PhosphorIcon color={palette.text} name="bank" size={18} />
          </View>
          <View style={styles.detailTitleBlock}>
            <View style={styles.detailTitleRow}>
              <AppText variant="subtitle">{profile.accountNo}</AppText>
              <StatusPill compact label={getAccountStatusLabel(profile.group, locale)} tone={statusTone} />
            </View>
            <AppText tone="muted" variant="caption">
              {profile.platform} · {profile.currency} · {profile.type}
            </AppText>
          </View>
          <PhosphorIcon color={palette.textDim} name="caret-right" size={16} />
        </View>

        <View style={styles.detailMetrics}>
          <SmallMetric label="Equity" value={formatNumber(profile.equity, 2, locale)} />
          <SmallMetric label="Balance" value={formatNumber(profile.balance, 2, locale)} />
          <SmallMetric label="Realized PnL" tone={profile.realizedPnl >= 0 ? 'down' : 'up'} value={formatMoney(profile.realizedPnl, profile.currency, 2, locale)} />
        </View>
      </Card>

      <Card>
        <View style={styles.marginStatus}>
          <View style={styles.marginCopy}>
            <AppText tone="muted" variant="caption">Floating PnL</AppText>
            <AppText tone={profile.unrealizedPnl >= 0 ? 'down' : 'up'} variant="title">
              {formatMoney(profile.unrealizedPnl, profile.currency, 2, locale)}
            </AppText>
          </View>
          <MarginGauge value={profile.marginLevel} />
        </View>

        <View style={StyleSheet.flatten([styles.divider, { backgroundColor: palette.lineSoft }])} />
        <View style={styles.detailMetrics}>
          <SmallMetric label="Free Margin" value={formatNumber(profile.freeMargin, 2, locale)} />
          <SmallMetric label="Used Margin" value={formatNumber(profile.usedMargin, 2, locale)} />
        </View>
        <View style={styles.detailMetrics}>
          <SmallMetric label="Leverage" value={profile.leverage} />
          <SmallMetric label="Positions" value={`${positionRows.length}`} />
        </View>
        <AppText tone="muted" variant="caption">Trading Server: {profile.server}</AppText>
      </Card>

      <View style={styles.actionGrid}>
        {[
          ['Deposit', 'down', 'bank'],
          ['Withdraw', 'amber', 'arrow-clockwise'],
          ['Transfer', 'blue', 'arrows-left-right'],
          ['Leverage', 'up', 'sliders-horizontal'],
          ['Password', 'blue', 'lock'],
          ['Trade', 'brand', 'chart-line-up'],
        ].map(([label, tone, icon]) => (
          <ActionTile icon={icon as PhosphorIconName} key={label} label={label} tone={tone as 'down' | 'up' | 'amber' | 'blue' | 'brand'} />
        ))}
      </View>

      <Card compact>
        {['Account Balance', 'Swap', 'Order History', 'Deposit History', 'Withdrawal History'].map((item, index, arr) => (
          <NativePressable
            key={item}
            minTouch={56}
            style={StyleSheet.flatten([styles.menuRow, index < arr.length - 1 && { borderBottomColor: palette.lineSoft, borderBottomWidth: 1 }])}>
            <View style={styles.menuLeft}>
              <PhosphorIcon color={palette.text} name={index === 0 ? 'bank' : index === 1 ? 'arrows-left-right' : 'clock'} size={19} />
              <AppText variant="body">{item}</AppText>
            </View>
            <PhosphorIcon color={palette.textDim} name="caret-right" size={16} />
          </NativePressable>
        ))}
      </Card>

      <Card compact>
        <View style={styles.cardTitleRow}>
          <AppText variant="subtitle">Positions</AppText>
          <PhosphorIcon color={palette.textDim} name="caret-right" size={14} />
        </View>
        {positionRows.map((position, index) => (
          <View key={position.id} style={StyleSheet.flatten([styles.positionRow, index < positionRows.length - 1 && { borderBottomColor: palette.lineSoft, borderBottomWidth: 1 }])}>
            <View style={StyleSheet.flatten([styles.positionIcon, { backgroundColor: palette.panelSoft }])}>
              <PhosphorIcon color={position.direction === 'buy' ? palette.down : palette.up} name="chart-line-up" size={15} />
            </View>
            <View style={styles.positionMain}>
              <View style={styles.positionTitle}>
                <AppText variant="caption">{position.symbol}</AppText>
                <AppText tone={position.direction === 'buy' ? 'down' : 'up'} variant="caption">
                  {directionLabel(position.direction, locale).toLowerCase()} {position.lots}
                </AppText>
              </View>
              <AppText tone="muted" variant="eyebrow">{position.priceRange}</AppText>
            </View>
            <AppText tone={position.pnl >= 0 ? 'down' : 'up'} variant="caption">
              {formatNumber(position.pnl, 2, locale)}
            </AppText>
          </View>
        ))}
      </Card>

      <Card>
        <View style={styles.cardTitleRow}>
          <AppText variant="subtitle">{locale === 'en-US' ? 'Closed PnL' : '已平仓盈亏'}</AppText>
          <StatusPill compact icon="caret-down" label={locale === 'en-US' ? 'Symbols (5)' : '品种 (5)'} tone="neutral" />
        </View>
        <AppText tone={profile.realizedPnl >= 0 ? 'down' : 'up'} variant="subtitle">
          {formatMoney(profile.realizedPnl, profile.currency, 2, locale)}
        </AppText>
        <AppText tone="muted" variant="caption">{locale === 'en-US' ? 'Total closed PnL' : '总已平仓盈亏'}</AppText>
        <ClosedPnlChart realizedPnl={profile.realizedPnl} />
        <View style={styles.symbolLegendRow}>
          {[
            ['Total', palette.brand],
            ['XAUUSD', palette.textDim],
            ['EURUSD', palette.line],
          ].map(([label, color]) => (
            <View key={label} style={styles.symbolLegendItem}>
              <View style={StyleSheet.flatten([styles.symbolLegendDot, { backgroundColor: color }])} />
              <AppText tone="muted" variant="eyebrow">{label}</AppText>
            </View>
          ))}
        </View>
        <View style={styles.periodRow}>
          {closedPnlPeriods.map((item) => (
            <StatusPill
              compact
              key={item.period}
              label={`${item.period} ${formatMoney(item.value, profile.currency, 2, locale)}`}
              style={styles.periodPill}
              tone={item.value >= 0 ? 'down' : 'up'}
            />
          ))}
        </View>
      </Card>

      <Card>
        <View style={styles.cardTitleRow}>
          <AppText variant="subtitle">PnL Calendar</AppText>
          <PhosphorIcon color={palette.textDim} name="caret-right" size={14} />
        </View>
        <View style={styles.calendarGrid}>
          {Array.from({ length: 31 }).map((_, index) => {
            const day = index + 1;
            const positive = [6, 7, 9, 10, 13, 15, 16, 20, 21, 22, 23, 24, 27].includes(day);
            const negative = [8, 14, 17, 28].includes(day);
            const bg = positive ? `${palette.down}20` : negative ? `${palette.up}18` : palette.panelSoft;
            return (
              <View key={day} style={StyleSheet.flatten([styles.dayCell, { backgroundColor: bg, borderColor: palette.lineSoft }])}>
                <AppText variant="eyebrow">{day}</AppText>
                <AppText tone={positive ? 'down' : negative ? 'up' : 'muted'} variant="eyebrow">
                  {positive || negative ? '12.42' : '0.00'}
                </AppText>
              </View>
            );
          })}
        </View>
        <View style={styles.calendarStats}>
          <SmallMetric label="Profitable Days" tone="down" value="17" />
          <SmallMetric label="Losing Days" tone="up" value="8" />
        </View>
      </Card>
    </Screen>
  );
}

function AccountMoreSheet({ onSelect }: { onSelect: (label: string, tone?: 'danger' | 'default') => void }) {
  const { palette } = useProductSettings();
  const items = [
    { icon: 'list-checks' as const, label: 'Trading Journal', tone: 'default' as const },
    { icon: 'bank' as const, label: 'Archive Account', tone: 'default' as const },
    { icon: 'x' as const, label: 'Delete Account', tone: 'danger' as const },
  ];

  return (
    <View style={StyleSheet.flatten([styles.moreSheet, { backgroundColor: palette.panel, borderColor: palette.lineSoft }])}>
      {items.map((item, index) => {
        const danger = item.tone === 'danger';
        const color = danger ? palette.danger : palette.text;
        return (
          <NativePressable
            accessibilityLabel={item.label}
            key={item.label}
            minTouch={64}
            onPress={() => onSelect(item.label, item.tone)}
            style={StyleSheet.flatten([styles.moreSheetRow, index < items.length - 1 && { borderBottomColor: palette.lineSoft, borderBottomWidth: 1 }])}>
            <PhosphorIcon color={color} name={item.icon} size={26} />
            <AppText style={{ color }} variant="title">
              {item.label}
            </AppText>
          </NativePressable>
        );
      })}
    </View>
  );
}

function MarginGauge({ value }: { value: number }) {
  const { locale, palette } = useProductSettings();
  const normalized = Math.max(0, Math.min(value / 1000, 100));
  const needleAngle = (-150 + normalized * 1.2) * (Math.PI / 180);
  const centerX = 120;
  const centerY = 96;
  const needleEndX = centerX + Math.cos(needleAngle) * 58;
  const needleEndY = centerY + Math.sin(needleAngle) * 58;
  const riskLabel = locale === 'en-US' ? 'Risk' : '危险';
  const safeLabel = locale === 'en-US' ? 'Safe' : '安全';
  const safetyTitle = locale === 'en-US' ? 'Account Safety Index' : '账号安全指数';

  return (
    <View style={styles.gaugeWrap}>
      <View style={styles.gaugeStage}>
        <Svg height={106} width={240}>
          <Path d="M 34 96 A 86 86 0 0 1 206 96" fill="none" stroke={palette.lineSoft} strokeLinecap="round" strokeWidth={14} />
          <Path d="M 34 96 A 86 86 0 0 1 65 30" fill="none" stroke={palette.danger} strokeLinecap="butt" strokeWidth={14} />
          <Path d="M 69 28 A 86 86 0 0 1 102 13" fill="none" stroke={palette.amber} strokeLinecap="butt" strokeWidth={14} />
          <Path d="M 108 12 A 86 86 0 0 1 132 12" fill="none" stroke={palette.textDim} strokeLinecap="butt" strokeWidth={14} />
          <Path d="M 138 13 A 86 86 0 0 1 171 28" fill="none" stroke={palette.down} strokeLinecap="butt" strokeWidth={14} />
          <Path d="M 175 30 A 86 86 0 0 1 206 96" fill="none" stroke={palette.down} strokeLinecap="butt" strokeWidth={14} />
          {[34, 65, 102, 120, 138, 175, 206].map((x, index) => (
            <Line key={`${x}-${index}`} opacity={0.22} stroke={palette.textDim} strokeLinecap="round" strokeWidth={2} x1={x} x2={x} y1={92} y2={98} />
          ))}
          <Line stroke={palette.text} strokeLinecap="round" strokeWidth={4} x1={centerX} x2={needleEndX} y1={centerY} y2={needleEndY} />
          <Circle cx={centerX} cy={centerY} fill={palette.bg} r={8} stroke={palette.text} strokeWidth={3} />
        </Svg>
        <View style={styles.gaugeLabels}>
          <AppText tone="muted" variant="caption">{riskLabel}</AppText>
          <AppText tone="muted" variant="caption">{safeLabel}</AppText>
        </View>
      </View>
      <AppText variant="subtitle">{safetyTitle}</AppText>
      <StatusPill compact label={`${safeLabel} · ${formatNumber(value, 2, locale)}%`} tone="success" />
    </View>
  );
}

function ClosedPnlChart({ realizedPnl }: { realizedPnl: number }) {
  const { palette } = useProductSettings();
  const width = 292;
  const height = 132;
  const chartTotal = realizedPnl === 0 ? 100 : realizedPnl;
  const totalValues = buildClosedPnlSeries(chartTotal, [0, 0.2, 0.08, 0.48, 0.36, 0.68, 0.58, 0.86, 1]);
  const symbolSeries = [
    { color: palette.textDim, values: buildClosedPnlSeries(chartTotal * 0.44, [0, 0.12, 0.04, 0.26, 0.2, 0.38, 0.34, 0.5, 0.62]) },
    { color: palette.line, values: buildClosedPnlSeries(chartTotal * -0.18, [0, -0.08, -0.02, -0.16, -0.1, -0.22, -0.18, -0.28, -0.34]) },
  ];
  const allValues = [...totalValues, ...symbolSeries.flatMap((series) => series.values)];

  return (
    <View style={styles.performanceChart}>
      <Svg height={height} width={width}>
        {symbolSeries.map((series, index) => (
          <Polyline
            fill="none"
            key={`symbol-${index}`}
            opacity={0.55}
            points={pointsForSeries(series.values, allValues, width, height)}
            stroke={series.color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          />
        ))}
        <Polyline
          fill="none"
          points={pointsForSeries(totalValues, allValues, width, height)}
          stroke={palette.brand}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={4}
        />
      </Svg>
    </View>
  );
}

function SmallMetric({ label, tone, value }: { label: string; tone?: 'down' | 'up'; value: string }) {
  return (
    <View style={styles.smallMetric}>
      <AppText tone={tone} variant="body">{value}</AppText>
      <AppText tone="muted" variant="caption">{label}</AppText>
    </View>
  );
}

function ActionTile({ icon, label, tone }: { icon: PhosphorIconName; label: string; tone: 'down' | 'up' | 'amber' | 'blue' | 'brand' }) {
  const { palette } = useProductSettings();
  const colorByTone = {
    amber: palette.amber,
    blue: palette.blue,
    brand: palette.brand,
    down: palette.down,
    up: palette.up,
  };

  return (
    <NativePressable minTouch={56} style={StyleSheet.flatten([styles.actionTile, { backgroundColor: palette.panel, borderColor: palette.lineSoft }])}>
      <PhosphorIcon color={colorByTone[tone]} name={icon} size={18} />
      <AppText variant="caption">{label}</AppText>
    </NativePressable>
  );
}

function buildClosedPnlPeriods(realizedPnl: number) {
  return [
    { period: '1W', value: realizedPnl * 0.22 },
    { period: '3W', value: realizedPnl * 0.48 },
    { period: '1M', value: realizedPnl * 0.72 },
    { period: '6M', value: realizedPnl },
  ];
}

function buildClosedPnlSeries(total: number, factors: number[]) {
  return factors.map((factor) => total * factor);
}

function pointsForSeries(values: number[], allValues: number[], width: number, height: number) {
  const min = Math.min(...allValues, 0);
  const max = Math.max(...allValues, 0);
  const range = max - min || 1;

  return values
    .map((value, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    })
    .join(' ');
}

function getDetailDemoPositions(locale: 'en-US' | 'zh-CN') {
  return Array.from({ length: 5 }).map((_, index) => ({
    direction: 'buy' as const,
    id: `detail-demo-${index}`,
    lots: formatNumber(5, 2, locale),
    pnl: 500,
    priceRange: '1887.87 - 1888.87',
    symbol: 'XAUUSD',
  }));
}

const styles = StyleSheet.create({
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  actionTile: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
    justifyContent: 'center',
    minHeight: 58,
    width: '31.7%',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 14,
  },
  calendarStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  cardTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dayCell: {
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1,
    gap: 2,
    height: 38,
    justifyContent: 'center',
    width: '13.3%',
  },
  detailHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  detailMetrics: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    marginTop: 14,
  },
  detailTitleBlock: {
    flex: 1,
    minWidth: 0,
  },
  detailTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  gaugeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -8,
    width: 236,
  },
  gaugeStage: {
    alignItems: 'center',
    height: 118,
    justifyContent: 'flex-start',
  },
  gaugeWrap: {
    alignItems: 'center',
    gap: 2,
    marginTop: 8,
  },
  marginCopy: {
    alignItems: 'center',
    gap: 2,
  },
  marginStatus: {
    alignItems: 'center',
  },
  moreSheet: {
    borderRadius: 18,
    borderWidth: 1,
    marginHorizontal: 14,
    marginTop: 14,
    overflow: 'hidden',
  },
  moreSheetRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 18,
    paddingHorizontal: 18,
  },
  menuLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  menuRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 56,
    paddingHorizontal: 2,
  },
  performanceChart: {
    alignItems: 'center',
    height: 142,
    justifyContent: 'center',
    marginTop: 8,
    overflow: 'hidden',
  },
  periodPill: {
    flex: 1,
    justifyContent: 'center',
  },
  periodRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  positionIcon: {
    alignItems: 'center',
    borderRadius: 999,
    height: 30,
    justifyContent: 'center',
    width: 30,
  },
  positionMain: {
    flex: 1,
    minWidth: 0,
  },
  positionRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 9,
    minHeight: 52,
    paddingVertical: 7,
  },
  positionTitle: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  smallMetric: {
    flex: 1,
    gap: 2,
  },
  symbolLegendDot: {
    borderRadius: 999,
    height: 6,
    width: 6,
  },
  symbolLegendItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  symbolLegendRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 2,
  },
  walletIcon: {
    alignItems: 'center',
    borderRadius: 999,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
});
