import { StyleSheet, View } from 'react-native';

import { useThemePalette } from '@/src/settings/ProductSettings';
import { radius, size, spacing } from '@/src/theme/tokens';

import type { IconTone } from '../AppIcon';
import { AppText } from '../Typography';

type LegendDotProps = {
  label: string;
  tone: Extract<IconTone, 'amber' | 'blue' | 'brand' | 'danger' | 'down' | 'text' | 'textDim' | 'textMuted' | 'up'>;
};

export function LegendDot({ label, tone }: LegendDotProps) {
  const palette = useThemePalette();

  return (
    <View style={styles.item}>
      <View style={StyleSheet.flatten([styles.dot, { backgroundColor: palette[tone] }])} />
      <AppText tone="muted" variant="caption">
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  dot: {
    borderRadius: radius.full,
    height: size.icon.xs,
    width: size.icon.xs,
  },
  item: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
});
