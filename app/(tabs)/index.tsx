import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Card } from '@/src/components/Card';
import { InstrumentRow } from '@/src/components/InstrumentRow';
import { NativePressable } from '@/src/components/NativePressable';
import { PhosphorIcon } from '@/src/components/PhosphorIcon';
import { Screen } from '@/src/components/Screen';
import { Sparkline } from '@/src/components/Sparkline';
import { AppText } from '@/src/components/Typography';
import { formatCompactMoney, formatMoney, formatPercent, formatPrice, localizeText } from '@/src/domain/format';
import { getDisplayChange } from '@/src/domain/trading';
import type { Account, Instrument, InstrumentAssetClass } from '@/src/domain/types';
import { useProductSettings } from '@/src/settings/ProductSettings';
import { useBroker } from '@/src/state/BrokerStore';

type MarketTabId = 'watchlist' | InstrumentAssetClass;

const marketTabs: MarketTabId[] = ['watchlist', 'forex', 'metals', 'futures', 'stocks'];

export default function HomeScreen() {
  const { account, instruments, positions } = useBroker();
  const { locale, palette, t } = useProductSettings();
  const [selectedTab, setSelectedTab] = useState<MarketTabId>('watchlist');

  const visibleInstruments = useMemo(() => getVisibleInstruments(instruments, selectedTab), [instruments, selectedTab]);
  const topMovers = [...instruments].sort((a, b) => Math.abs(getDisplayChange(b).changePercent) - Math.abs(getDisplayChange(a).changePercent));
  const anchorInstrument = instruments.find((instrument) => instrument.symbol === 'EUR/USD') ?? instruments[0];
  const bidDepth = [0, 1, 2].map((step) => ({
    price: anchorInstrument.bid - step * anchorInstrument.pipSize * 2,
    size: [2.8, 1.9, 1.2][step],
  }));
  const askDepth = [0, 1, 2].map((step) => ({
    price: anchorInstrument.ask + step * anchorInstrument.pipSize * 2,
    size: [2.4, 1.7, 1.1][step],
  }));
  return (
    <Screen title={t('markets.title')}>
      <AccountSummaryStrip account={account} floatingPnl={positions.reduce((total, position) => total + position.unrealizedPnl, 0)} />

      <MoversCarousel instruments={topMovers.slice(0, 6)} />

      <View style={StyleSheet.flatten([styles.searchBar, { backgroundColor: palette.panelSoft, borderColor: palette.lineSoft }])}>
        <PhosphorIcon color={palette.textDim} name="magnifying-glass" size={14} />
        <AppText numberOfLines={1} tone="dim" variant="caption">
          {locale === 'en-US' ? 'Search FX, metals, indices' : '搜索外汇、黄金、指数'}
        </AppText>
      </View>

      <View style={StyleSheet.flatten([styles.marketTabs, { backgroundColor: palette.panelSoft, borderColor: palette.lineSoft }])}>
        {marketTabs.map((tab) => {
          const active = tab === selectedTab;

          return (
            <NativePressable
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              key={tab}
              minTouch={36}
              onPress={() => setSelectedTab(tab)}
              style={StyleSheet.flatten([
                styles.marketTab,
                active && {
                  backgroundColor: palette.panel,
                },
              ])}>
              <AppText
                adjustsFontSizeToFit
                numberOfLines={1}
                style={styles.marketTabText}
                tone={active ? 'default' : 'dim'}
                variant="caption">
                {t(`markets.tab.${tab}`)}
              </AppText>
            </NativePressable>
          );
        })}
      </View>

      <Card compact>
        <View style={styles.marketHeader}>
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
        {visibleInstruments.map((instrument) => (
          <InstrumentRow instrument={instrument} key={instrument.id} />
        ))}
      </Card>

      <Card>
        <View style={styles.sectionHeader}>
          <View>
            <AppText variant="subtitle">{t('home.depthTitle')}</AppText>
            <AppText tone="muted" variant="caption">
              {anchorInstrument.symbol} · {t('home.depthSubtitle')}
            </AppText>
          </View>
        </View>
        <View style={styles.depthBook}>
          <DepthSide color={palette.down} instrument={anchorInstrument} label={t('home.depthBid')} levels={bidDepth} />
          <DepthSide color={palette.up} instrument={anchorInstrument} label={t('home.depthAsk')} levels={askDepth} />
        </View>
      </Card>
    </Screen>
  );
}

function MoversCarousel({ instruments }: { instruments: Instrument[] }) {
  const { locale, palette, t } = useProductSettings();

  return (
    <View style={styles.moversBlock}>
      <View style={styles.moversHeader}>
        <AppText variant="subtitle">{t('home.topMovers')}</AppText>
        <AppText tone="dim" variant="caption">
          {t('home.moversCaption')}
        </AppText>
      </View>
      <ScrollView
        contentContainerStyle={styles.moversRail}
        horizontal
        showsHorizontalScrollIndicator={false}>
        {instruments.map((instrument) => {
          const { changePercent } = getDisplayChange(instrument);
          const positive = changePercent >= 0;
          const tone = positive ? 'up' : 'down';
          const color = positive ? palette.up : palette.down;

          return (
            <View
              key={instrument.id}
              style={StyleSheet.flatten([styles.moverCard, { backgroundColor: palette.panel, borderColor: palette.lineSoft }])}>
              <View style={styles.moverTop}>
                <View style={styles.moverIdentity}>
                  <AppText numberOfLines={1} variant="subtitle">
                    {instrument.symbol}
                  </AppText>
                  <AppText numberOfLines={1} tone="muted" variant="caption">
                    {localizeText(instrument.name, locale)}
                  </AppText>
                </View>
                <View style={StyleSheet.flatten([styles.moverBadge, { backgroundColor: `${color}12` }])}>
                  <AppText tone={tone} variant="caption">
                    {formatPercent(changePercent)}
                  </AppText>
                </View>
              </View>
              <Sparkline color={color} height={30} values={instrument.sparkline} width={116} />
              <View style={styles.moverBottom}>
                <AppText tone="dim" variant="caption">
                  Ask
                </AppText>
                <AppText tone={tone} variant="number">
                  {formatPrice(instrument, instrument.ask)}
                </AppText>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

function getVisibleInstruments(instruments: Instrument[], tab: MarketTabId) {
  if (tab === 'watchlist') {
    return instruments.filter((instrument) => instrument.favorite);
  }

  return instruments.filter((instrument) => instrument.assetClass === tab);
}

function AccountSummaryStrip({ account, floatingPnl }: { account: Account; floatingPnl: number }) {
  const { locale, palette, t } = useProductSettings();
  const pnlTone = floatingPnl >= 0 ? 'up' : 'down';

  return (
    <View style={StyleSheet.flatten([styles.accountStrip, { backgroundColor: palette.panelSoft, borderColor: palette.lineSoft }])}>
      <View style={styles.accountSummaryMain}>
        <View style={styles.accountIdentityBlock}>
          <AppText numberOfLines={1} tone="dim" variant="eyebrow">
            {t('account.currentTrading')}
          </AppText>
          <View style={styles.accountIdRow}>
            <View style={StyleSheet.flatten([styles.accountStripDot, { backgroundColor: palette.brand }])} />
            <AppText adjustsFontSizeToFit numberOfLines={1} variant="subtitle">
              {account.accountId}
            </AppText>
          </View>
        </View>

        <View style={styles.accountMetricRow}>
          <View style={styles.accountStripItem}>
            <AppText adjustsFontSizeToFit numberOfLines={1} tone="dim" variant="eyebrow">
              {t('account.equity')}
            </AppText>
            <AppText adjustsFontSizeToFit numberOfLines={1} variant="number">
              {formatCompactMoney(account.equity, account.currency, locale)}
            </AppText>
          </View>
          <View style={styles.accountStripItem}>
            <AppText adjustsFontSizeToFit numberOfLines={1} tone="dim" variant="eyebrow">
              {t('portfolio.unrealizedPnl')}
            </AppText>
            <AppText adjustsFontSizeToFit numberOfLines={1} tone={pnlTone} variant="number">
              {formatMoney(floatingPnl, account.currency, 0, locale)}
            </AppText>
          </View>
        </View>
      </View>
    </View>
  );
}

function DepthSide({
  color,
  instrument,
  label,
  levels,
}: {
  color: string;
  instrument: ReturnType<typeof useBroker>['instruments'][number];
  label: string;
  levels: { price: number; size: number }[];
}) {
  return (
    <View style={styles.depthSide}>
      <AppText style={{ color }} variant="caption">
        {label}
      </AppText>
      {levels.map((level) => (
        <View key={level.price} style={styles.depthRow}>
          <AppText style={{ color }} variant="caption">
            {formatPrice(instrument, level.price)}
          </AppText>
          <View style={StyleSheet.flatten([styles.depthTrack, { backgroundColor: `${color}16` }])}>
            <View style={StyleSheet.flatten([styles.depthFill, { backgroundColor: color, width: `${level.size * 28}%` }])} />
          </View>
          <AppText tone="muted" variant="caption">
            {level.size.toFixed(1)}M
          </AppText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  accountStrip: {
    borderRadius: 16,
    borderWidth: 1,
    minHeight: 58,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  accountIdRow: {
    alignItems: 'baseline',
    flexDirection: 'row',
    gap: 7,
    minWidth: 0,
  },
  accountIdentityBlock: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  accountMetricRow: {
    flex: 1.15,
    flexDirection: 'row',
    gap: 10,
    minWidth: 0,
  },
  accountStripItem: {
    flex: 1,
    gap: 3,
    minWidth: 0,
  },
  accountStripDot: {
    borderRadius: 999,
    height: 7,
    width: 7,
  },
  accountSummaryMain: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  depthBook: {
    flexDirection: 'row',
    gap: 12,
  },
  depthFill: {
    borderRadius: 999,
    height: 7,
  },
  depthRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    minHeight: 25,
  },
  depthSide: {
    flex: 1,
    gap: 6,
    minWidth: 0,
  },
  depthTrack: {
    borderRadius: 999,
    flex: 1,
    height: 7,
    overflow: 'hidden',
  },
  marketHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 4,
  },
  moverBadge: {
    borderRadius: 999,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  moverBottom: {
    gap: 1,
  },
  moverCard: {
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
    minHeight: 126,
    padding: 12,
    width: 156,
  },
  moverIdentity: {
    flex: 1,
    gap: 1,
    minWidth: 0,
  },
  moversBlock: {
    gap: 8,
    marginHorizontal: -16,
  },
  moversHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  moversRail: {
    gap: 10,
    paddingHorizontal: 16,
  },
  moverTop: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
  },
  marketTab: {
    alignItems: 'center',
    borderRadius: 999,
    flex: 1,
    minWidth: 0,
    paddingHorizontal: 7,
    paddingVertical: 8,
  },
  marketTabs: {
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 4,
    padding: 4,
  },
  marketTabText: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
  searchBar: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    minHeight: 40,
    paddingHorizontal: 14,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
    marginTop: 2,
  },
});
