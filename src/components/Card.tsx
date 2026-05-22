import { PropsWithChildren } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { useThemePalette } from '@/src/settings/ProductSettings';
import { shadows } from '@/src/theme/colors';
import { radius, spacing } from '@/src/theme/tokens';

type CardProps = PropsWithChildren<{
  compact?: boolean;
  highlight?: boolean;
  style?: ViewStyle;
}>;

export function Card({ children, compact, highlight, style }: CardProps) {
  const palette = useThemePalette();

  return (
    <View
      style={StyleSheet.flatten([
        styles.card,
        {
          backgroundColor: highlight ? palette.panelHigh : palette.panel,
          borderColor: highlight ? palette.line : palette.lineSoft,
        },
        highlight && shadows.panel,
        compact && styles.compact,
        style,
      ])}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.lg,
  },
  compact: {
    padding: spacing.md,
  },
});
