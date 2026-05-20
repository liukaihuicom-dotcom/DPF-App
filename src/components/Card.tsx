import { PropsWithChildren } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { useThemePalette } from '@/src/settings/ProductSettings';
import { shadows } from '@/src/theme/colors';

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
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  compact: {
    padding: 12,
  },
});
