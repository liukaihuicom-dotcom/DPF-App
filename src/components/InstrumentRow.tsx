import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { lineWidth } from '@/src/theme/tokens';
import { formatPercent, formatPrice, localizeText } from '@/src/domain/format';
import { getDisplayChange } from '@/src/domain/trading';
import type { Instrument } from '@/src/domain/types';
import { useProductSettings } from '@/src/settings/ProductSettings';

import { InstrumentIcon } from './InstrumentIcon';
import { NativePressable } from './NativePressable';
import { getQuoteChangeVisual } from './quoteVisuals';
import { Sparkline } from './Sparkline';
import { AppText } from './Typography';

type InstrumentRowProps = {
  instrument: Instrument;
  showDivider?: boolean;
};

export function InstrumentRow({ instrument, showDivider = true }: InstrumentRowProps) {
  const { locale, palette } = useProductSettings();
  const { changePercent } = getDisplayChange(instrument);
  const quoteVisual = getQuoteChangeVisual(changePercent, palette);

  return (
    <Link asChild href={`/instrument/${instrument.id}`}>
      <NativePressable style={StyleSheet.flatten([styles.row, showDivider && { borderBottomColor: palette.lineSoft, borderBottomWidth: lineWidth.hairline }])}>
        <InstrumentIcon instrument={instrument} size={36} />
        <View style={styles.identity}>
          <AppText variant="subtitle">{instrument.symbol}</AppText>
          <AppText numberOfLines={1} tone="muted" variant="caption">
            {localizeText(instrument.name, locale)} · {instrument.leverage}x
          </AppText>
        </View>
        <Sparkline color={quoteVisual.color} values={instrument.sparkline} />
        <View style={styles.quote}>
          <AppText tone={quoteVisual.tone} variant="number">
            {formatPrice(instrument, instrument.ask)}
          </AppText>
          <AppText tone={quoteVisual.tone} variant="caption">
            {formatPercent(changePercent)}
          </AppText>
        </View>
      </NativePressable>
    </Link>
  );
}

const styles = StyleSheet.create({
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
    flexDirection: 'row',
    gap: 10,
    minHeight: 68,
    paddingVertical: 11,
  },
});
