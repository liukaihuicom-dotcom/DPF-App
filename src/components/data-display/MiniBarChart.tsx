import { StyleSheet, View } from 'react-native';

import { useThemePalette } from '@/src/settings/ProductSettings';
import { lineWidth, radius, size, spacing } from '@/src/theme/tokens';
import type { IconTone } from '../AppIcon';

import { AppText } from '../Typography';

type MiniBarChartProps = {
  maxValue?: number;
  ticks?: number[];
  tone: Extract<IconTone, 'amber' | 'blue' | 'brand' | 'danger' | 'down' | 'up'>;
  values: number[];
};

export function MiniBarChart({ maxValue, ticks = [10000, 2000, 1000, 200, 0], tone, values }: MiniBarChartProps) {
  const palette = useThemePalette();
  const max = maxValue ?? Math.max(...values, 1);
  const color = palette[tone];

  return (
    <View style={styles.wrap}>
      {ticks.map((tick) => (
        <View key={tick} style={styles.gridRow}>
          <AppText tone="dim" variant="caption">
            {tick >= 1000 ? `${tick / 1000}k` : `${tick}`}
          </AppText>
          <View style={StyleSheet.flatten([styles.gridLine, { backgroundColor: palette.lineSoft }])} />
        </View>
      ))}
      <View style={styles.barRow}>
        {values.map((value, index) => (
          <View key={`${value}-${index}`} style={styles.barSlot}>
            <View
              style={StyleSheet.flatten([
                styles.barFill,
                {
                  backgroundColor: color,
                  height: `${Math.max(6, Math.min(100, (value / max) * 100))}%`,
                },
              ])}
            />
          </View>
        ))}
      </View>
      <View style={styles.dateRow}>
        <AppText tone="dim" variant="caption">
          02 Jul
        </AppText>
        <AppText tone="dim" variant="caption">
          12 Jul
        </AppText>
        <AppText tone="dim" variant="caption">
          22 Jul
        </AppText>
        <AppText tone="dim" variant="caption">
          28 Jul
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  barFill: {
    borderRadius: radius.xxs,
    minHeight: size.tag.barMinHeight,
    width: '100%',
  },
  barRow: {
    alignItems: 'flex-end',
    bottom: 28,
    flexDirection: 'row',
    gap: spacing.sm,
    left: 50,
    position: 'absolute',
    right: 0,
    top: spacing.sm,
  },
  barSlot: {
    alignItems: 'center',
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: size.control.md + spacing.xxs,
    marginTop: spacing.xs,
  },
  gridLine: {
    flex: 1,
    height: lineWidth.hairline,
  },
  gridRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    minHeight: size.control.xs,
  },
  wrap: {
    minHeight: size.viewport.chartCompactMinHeight,
    paddingTop: spacing.sm,
    position: 'relative',
  },
});
