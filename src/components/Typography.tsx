import { PropsWithChildren } from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';

import { useThemePalette } from '@/src/settings/ProductSettings';

type AppTextProps = PropsWithChildren<
  TextProps & {
    tone?: 'default' | 'muted' | 'dim' | 'up' | 'down' | 'amber' | 'blue' | 'cyan' | 'brand' | 'danger';
    variant?: 'eyebrow' | 'title' | 'subtitle' | 'body' | 'caption' | 'number' | 'largeNumber';
  }
>;

export function AppText({ children, tone = 'default', variant = 'body', style, ...props }: AppTextProps) {
  const palette = useThemePalette();
  const toneMap = {
    amber: palette.amber,
    blue: palette.blue,
    brand: palette.brand,
    cyan: palette.cyan,
    danger: palette.danger,
    default: palette.text,
    dim: palette.textDim,
    down: palette.down,
    muted: palette.textMuted,
    up: palette.up,
  };

  return (
    <Text {...props} style={StyleSheet.flatten([styles.base, styles[variant], { color: toneMap[tone] }, style])}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    letterSpacing: 0,
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
  },
  caption: {
    fontSize: 11,
    lineHeight: 16,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '600',
    lineHeight: 14,
    textTransform: 'uppercase',
  },
  largeNumber: {
    fontFamily: 'SpaceMono',
    fontSize: 30,
    fontWeight: '600',
    lineHeight: 36,
  },
  number: {
    fontFamily: 'SpaceMono',
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 24,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    lineHeight: 28,
  },
});
