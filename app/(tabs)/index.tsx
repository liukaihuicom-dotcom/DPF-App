import { useMemo, useState } from 'react';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Card } from '@/src/components/Card';
import { InstrumentRow } from '@/src/components/InstrumentRow';
import { NativePressable } from '@/src/components/NativePressable';
import { PhosphorIcon } from '@/src/components/PhosphorIcon';
import { getQuoteChangeVisual } from '@/src/components/quoteVisuals';
import { Screen } from '@/src/components/Screen';
import { Sparkline } from '@/src/components/Sparkline';
import { TextField } from '@/src/components/TextField';
import { AppText } from '@/src/components/Typography';
import { formatCompactMoney, formatMoney, formatPercent, formatPrice, localizeText } from '@/src/domain/format';
import { getDisplayChange } from '@/src/domain/trading';
import type { Instrument, InstrumentAssetClass } from '@/src/domain/types';
import { useProductSettings } from '@/src/settings/ProductSettings';
import { useBroker } from '@/src/state/BrokerStore';

type MarketTabKey = 'watchlist' | InstrumentAssetClass;

const marketTabs: { key: MarketTabKey; labelKey: 'markets.tab.watchlist' | 'markets.tab.forex' | 'markets.tab.metals' | 'markets.tab.futures' | 'markets.tab.stocks' }[] = [
  { key: 'watchlist', labelKey: 'markets.tab.watchlist' },
  { key: 'forex', labelKey: 'markets.tab.forex' },
  { key: 'metals', labelKey: 'markets.tab.metals' },
  { key: 'futures', labelKey: 'markets.tab.futures' },
  { key: 'stocks', labelKey: 'markets.tab.stocks' },
];

export default function HomeScreen() {
  const { account, instruments, positions } = useBroker();
  const { locale, palette, t } = useProductSettings();
  const floatingPnl = positions.reduce((total, position) => total + position.unrealizedPnl, 0);
  const topMovers = [...instruments]
    .sort((a, b) => Math.abs(getDisplayChange(b).changePercent) - Math.abs(getDisplayChange(a).changePercent))
    .slice(0, 6);

  return (
    <Screen
      rightActions={[
        { icon: 'bell', label: t('top.notifications') },
        { icon: 'headphones', label: t('top.support') },
      ]}
      title="Dupoin">
      <View style={styles.accountStrip}>
        <View style={StyleSheet.flatten([styles.accountTile, { backgroundColor: palette.panel, borderColor: palette.lineSoft }])}>
          <AppText tone="muted" variant="caption">
            {t('account.equity')}
          </AppText>
          <AppText adjustsFontSizeToFit numberOfLines={1} variant="number">
            {formatMoney(account.equity, account.currency, 0, locale)}
          </AppText>
        </View>
        <View style={StyleSheet.flatten([styles.accountTile, { backgroundColor: palette.panel, borderColor: palette.lineSoft }])}>
          <AppText tone="muted" variant="caption">
            {t('portfolio.unrealizedPnl')}
          </AppText>
          <AppText adjustsFontSizeToFit numberOfLines={1} tone={floatingPnl >= 0 ? 'down' : 'up'} variant="number">
            {formatMoney(floatingPnl, account.currency, 0, locale)}
          </AppText>
        </View>
        <View style={StyleSheet.flatten([styles.accountTile, { backgroundColor: palette.panel, borderColor: palette.lineSoft }])}>
          <AppText tone="muted" variant="caption">
            {t('account.availableMargin')}
          </AppText>
          <AppText adjustsFontSizeToFit numberOfLines={1} variant="number">
            {formatCompactMoney(account.freeMargin, account.currency, locale)}
          </AppText>
        </View>
      </View>

      <SectionTitle
        action={locale === 'en-US' ? 'All markets' : '全部行情'}
        onPress={() => router.push('/markets' as never)}
        title={t('home.topMovers')}
      />
      <MoversCarousel instruments={topMovers} />
      <MarketList instruments={instruments} />
    </Screen>
  );
}

function SectionTitle({ action, onPress, title }: { action: string; onPress: () => void; title: string }) {
  const { palette } = useProductSettings();

  return (
    <View style={styles.sectionTitle}>
      <AppText variant="subtitle">{title}</AppText>
      <NativePressable accessibilityLabel={action} accessibilityRole="button" minTouch={36} onPress={onPress} style={styles.sectionAction}>
        <AppText tone="brand" variant="caption">
          {action}
        </AppText>
        <PhosphorIcon color={palette.brand} name="caret-right" size={14} />
      </NativePressable>
    </View>
  );
}

function MoversCarousel({ instruments }: { instruments: Instrument[] }) {
  const { locale, palette } = useProductSettings();

  return (
    <ScrollView contentContainerStyle={styles.moversRail} horizontal showsHorizontalScrollIndicator={false}>
      {instruments.map((instrument) => {
        const { changePercent } = getDisplayChange(instrument);
        const quoteVisual = getQuoteChangeVisual(changePercent, palette);

        return (
          <NativePressable
            accessibilityLabel={instrument.symbol}
            accessibilityRole="button"
            key={instrument.id}
            minTouch={128}
            onPress={() => router.push(`/instrument/${instrument.id}` as never)}
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
              <View style={StyleSheet.flatten([styles.moverBadge, { backgroundColor: `${quoteVisual.color}12` }])}>
                <AppText tone={quoteVisual.tone} variant="caption">
                  {formatPercent(changePercent)}
                </AppText>
              </View>
            </View>
            <Sparkline color={quoteVisual.color} height={32} values={instrument.sparkline} width={122} />
            <View style={styles.moverBottom}>
              <AppText tone="dim" variant="caption">
                Ask
              </AppText>
              <AppText tone={quoteVisual.tone} variant="number">
                {formatPrice(instrument, instrument.ask)}
              </AppText>
            </View>
          </NativePressable>
        );
      })}
    </ScrollView>
  );
}

function MarketList({ instruments }: { instruments: Instrument[] }) {
  const { locale, palette, t } = useProductSettings();
  const [selectedTab, setSelectedTab] = useState<MarketTabKey>('watchlist');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const closeSearch = () => {
    setSearchQuery('');
    setSearchOpen(false);
  };
  const filteredInstruments = useMemo(() => {
    const tabInstruments =
      selectedTab === 'watchlist' ? instruments.filter((instrument) => instrument.favorite) : instruments.filter((instrument) => instrument.assetClass === selectedTab);

    if (!normalizedQuery) {
      return tabInstruments;
    }

    return tabInstruments.filter((instrument) => {
      const localizedName = localizeText(instrument.name, locale).toLowerCase();
      const searchable = [instrument.symbol, instrument.baseCurrency, instrument.quoteCurrency, localizedName].join(' ').toLowerCase();

      return searchable.includes(normalizedQuery);
    });
  }, [instruments, locale, normalizedQuery, selectedTab]);

  return (
    <Card compact style={styles.marketBoard}>
      <View style={styles.marketToolbar}>
        {searchOpen ? (
          <View style={styles.marketSearchShell}>
            <TextField
              accessibilityLabel={t('markets.search')}
              autoCapitalize="characters"
              autoCorrect={false}
              autoFocus
              containerStyle={styles.marketSearchField}
              icon="magnifying-glass"
              inputStyle={styles.marketSearchInput}
              label={t('markets.search')}
              labelHidden
              onChangeText={setSearchQuery}
              placeholder={t('markets.search')}
              returnKeyType="search"
              shellStyle={StyleSheet.flatten([styles.marketSearchExpanded, { backgroundColor: palette.panelSoft, borderColor: palette.lineSoft }])}
              value={searchQuery}
            />
            <NativePressable
              accessibilityLabel={t('common.cancel')}
              accessibilityRole="button"
              minTouch={38}
              onPress={closeSearch}
              style={StyleSheet.flatten([styles.marketSearchClose, { backgroundColor: palette.panelSoft, borderColor: palette.lineSoft }])}>
              <PhosphorIcon color={palette.textDim} name="x" size={14} />
            </NativePressable>
          </View>
        ) : (
          <>
            <ScrollView contentContainerStyle={styles.marketTabs} horizontal showsHorizontalScrollIndicator={false} style={styles.marketTabsRail}>
              {marketTabs.map((tab) => {
                const selected = selectedTab === tab.key;

                return (
                  <NativePressable
                    accessibilityLabel={t(tab.labelKey)}
                    accessibilityRole="tab"
                    accessibilityState={{ selected }}
                    key={tab.key}
                    minTouch={38}
                    onPress={() => setSelectedTab(tab.key)}
                    style={StyleSheet.flatten([
                      styles.marketTab,
                      {
                        backgroundColor: selected ? palette.text : palette.panelSoft,
                        borderColor: selected ? palette.text : palette.lineSoft,
                      },
                    ])}>
                    <AppText numberOfLines={1} style={selected ? { color: palette.bg } : undefined} tone={selected ? 'default' : 'muted'} variant="caption">
                      {t(tab.labelKey)}
                    </AppText>
                  </NativePressable>
                );
              })}
            </ScrollView>
            <NativePressable
              accessibilityLabel={t('markets.search')}
              accessibilityRole="button"
              minTouch={38}
              onPress={() => setSearchOpen(true)}
              style={StyleSheet.flatten([styles.marketSearchTrigger, { backgroundColor: palette.panelSoft, borderColor: palette.lineSoft }])}>
              <PhosphorIcon color={palette.textDim} name="magnifying-glass" size={17} />
            </NativePressable>
          </>
        )}
      </View>

      <View style={styles.marketRows}>
        {filteredInstruments.length > 0 ? (
          filteredInstruments.map((instrument) => <InstrumentRow instrument={instrument} key={instrument.id} />)
        ) : (
          <View style={StyleSheet.flatten([styles.emptyMarketRows, { backgroundColor: palette.panelSoft }])}>
            <AppText tone="muted" variant="caption">
              {t('markets.empty')}
            </AppText>
          </View>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  accountStrip: {
    flexDirection: 'row',
    gap: 8,
  },
  accountTile: {
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
    gap: 3,
    minHeight: 66,
    minWidth: 0,
    padding: 10,
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
    minHeight: 132,
    padding: 12,
    width: 164,
  },
  moverIdentity: {
    flex: 1,
    gap: 1,
    minWidth: 0,
  },
  moversRail: {
    gap: 10,
    paddingRight: 16,
  },
  moverTop: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
  },
  sectionAction: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 2,
  },
  sectionTitle: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  emptyMarketRows: {
    alignItems: 'center',
    borderRadius: 12,
    minHeight: 72,
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  marketBoard: {
    gap: 12,
  },
  marketRows: {
    gap: 0,
  },
  marketSearchClose: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  marketSearchExpanded: {
    borderRadius: 999,
    gap: 6,
    height: 38,
    minHeight: 38,
    paddingHorizontal: 11,
  },
  marketSearchField: {
    flex: 1,
    minWidth: 0,
  },
  marketSearchInput: {
    flex: 1,
    fontSize: 12,
    lineHeight: 16,
    minWidth: 0,
    padding: 0,
  },
  marketSearchShell: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    minWidth: 0,
  },
  marketSearchTrigger: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  marketTab: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    height: 38,
    justifyContent: 'center',
    paddingHorizontal: 13,
  },
  marketTabs: {
    gap: 7,
    paddingRight: 8,
  },
  marketTabsRail: {
    flex: 1,
    minWidth: 0,
  },
  marketToolbar: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
});
