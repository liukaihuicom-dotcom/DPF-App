import { PropsWithChildren } from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';

import { useThemePalette } from '@/src/settings/ProductSettings';
import { typography, type TypographyToken } from '@/src/theme/tokens';

export type AppTextTone =
  | 'amber'
  | 'bg'
  | 'blue'
  | 'brand'
  | 'cyan'
  | 'danger'
  | 'default'
  | 'dim'
  | 'disabled'
  | 'down'
  | 'link'
  | 'muted'
  | 'panel'
  | 'panelMuted'
  | 'up'
  | 'white';

type AppTextProps = PropsWithChildren<
  TextProps & {
    tone?: AppTextTone;
    variant?:
      | TypographyToken
      | 'body'
      | 'caption'
      | 'eyebrow'
      | 'largeNumber'
      | 'number'
      | 'subtitle'
      | 'title';
  }
>;

export function AppText({ children, tone = 'default', variant = 'body', style, ...props }: AppTextProps) {
  const palette = useThemePalette();
  const toneMap = {
    amber: palette.amber,
    bg: palette.bg,
    blue: palette.blue,
    brand: palette.brand,
    cyan: palette.cyan,
    danger: palette.danger,
    default: palette.text,
    dim: palette.textDim,
    disabled: palette.disabledText,
    down: palette.down,
    link: palette.link,
    muted: palette.textMuted,
    panel: palette.panel,
    panelMuted: `${palette.panel}CC`,
    up: palette.up,
    white: palette.white,
  };

  const variantStyle = variantStyles[variant];

  return (
    <Text {...props} style={StyleSheet.flatten([styles.base, variantStyle, { color: toneMap[tone] }, style])}>
      {children}
    </Text>
  );
}

const variantStyles = {
  ...typography,
  body: typography.bodySm,
  caption: typography.captionSm,
  eyebrow: {
    ...typography.microLabel,
    textTransform: 'uppercase',
  },
  largeNumber: typography.displayXl,
  number: typography.number,
  subtitle: typography.titleMd,
  title: typography.displayLg,
} as const;

const styles = StyleSheet.create({
  base: {
    letterSpacing: 0,
  },
});
