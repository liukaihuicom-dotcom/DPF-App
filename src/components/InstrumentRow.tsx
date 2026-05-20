import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { formatPercent, formatPrice, localizeText } from '@/src/domain/format';
import { getDisplayChange } from '@/src/domain/trading';
import type { Instrument } from '@/src/domain/types';
import { useProductSettings } from '@/src/settings/ProductSettings';

import { NativePressable } from './NativePressable';
import { Sparkline } from './Sparkline';
import { AppText } from './Typography';

type InstrumentRowProps = {
  instrument: Instrument;
};

export function InstrumentRow({ instrument }: InstrumentRowProps) {
  const { locale, palette } = useProductSettings();
  const { changePercent } = getDisplayChange(instrument);
  const positive = changePercent >= 0;
  const tone = positive ? 'up' : 'down';

  return (
    <Link asChild href={`/instrument/${instrument.id}`}>
      <NativePressable style={StyleSheet.flatten([styles.row, { borderBottomColor: palette.lineSoft }])}>
        <View style={StyleSheet.flatten([styles.assetIcon, { backgroundColor: palette.panelSoft, borderColor: palette.lineSoft }])}>
          <AppText numberOfLines={1} variant="caption">
            {instrument.baseCurrency.slice(0, 2)}
          </AppText>
        </View>
        <View style={styles.identity}>
          <AppText variant="subtitle">{instrument.symbol}</AppText>
          <AppText numberOfLines={1} tone="muted" variant="caption">
            {localizeText(instrument.name, locale)} · {instrument.leverage}x
          </AppText>
        </View>
        <Sparkline color={positive ? palette.up : palette.down} values={instrument.sparkline} />
        <View style={styles.quote}>
          <AppText tone={tone} variant="number">
            {formatPrice(instrument, instrument.ask)}
          </AppText>
          <AppText tone={tone} variant="caption">
            {formatPercent(changePercent)}
          </AppText>
        </View>
      </NativePressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  assetIcon: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  identity: {
    flex: 1,
    gap: 3,
    minWidth: 0,
  },
  quote: {
    alignItems: 'flex-end',
    minWidth: 88,
  },
  row: {
    alignItems: 'center',
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 10,
    minHeight: 68,
    paddingVertical: 11,
  },
});
