import { StyleSheet, View } from 'react-native';

import { spacing } from '@/src/theme/tokens';

import { AppText } from '../Typography';

type MiniMetricTone = 'down' | 'up';

type MiniMetricProps = {
  label: string;
  tone?: MiniMetricTone;
  value: string;
  variant?: 'default' | 'snapshot';
};

export function MiniMetric({ label, tone, value, variant = 'default' }: MiniMetricProps) {
  const isSnapshot = variant === 'snapshot';

  return (
    <View style={StyleSheet.flatten([styles.metric, isSnapshot && styles.snapshot])}>
      <AppText adjustsFontSizeToFit numberOfLines={1} tone={tone} variant={isSnapshot ? 'subtitle' : 'body'}>
        {value}
      </AppText>
      <AppText numberOfLines={1} tone="muted" variant="caption">
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  metric: {
    flex: 1,
    gap: spacing.xxs,
  },
  snapshot: {
    gap: spacing.xs,
    minWidth: 0,
  },
});
