import { StyleSheet, View } from 'react-native';

import { useThemePalette } from '@/src/settings/ProductSettings';
import { lineWidth, size, spacing } from '@/src/theme/tokens';

import { AppText } from '../Typography';

type OrderInfoRowProps = {
  label: string;
  tone?: 'default' | 'danger';
  value: string;
};

export function OrderInfoRow({ label, tone = 'default', value }: OrderInfoRowProps) {
  const palette = useThemePalette();

  return (
    <View style={StyleSheet.flatten([styles.row, { borderBottomColor: palette.lineSoft }])}>
      <AppText tone="muted" variant="caption">
        {label}
      </AppText>
      <AppText tone={tone} variant="number">
        {value}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    borderBottomWidth: lineWidth.hairline,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: size.tag.chipMinHeight,
  },
});
