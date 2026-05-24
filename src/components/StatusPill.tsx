import { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { useThemePalette } from '@/src/settings/ProductSettings';
import type { ThemePalette } from '@/src/theme/colors';
import { lineWidth, radius } from '@/src/theme/tokens';

import { AppIcon, type AppIconName, type IconTone } from './AppIcon';
import { AppText, type AppTextTone } from './Typography';

export type StatusPillTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'brand' | 'up' | 'down';

export type StatusPillProps = {
  compact?: boolean;
  icon?: AppIconName | ReactNode;
  label: string;
  size?: 'md' | 'sm';
  style?: StyleProp<ViewStyle>;
  tone: StatusPillTone;
};

function resolveTone(palette: ThemePalette, tone: StatusPillTone): { color: string; iconTone: IconTone; textTone: AppTextTone } {
  switch (tone) {
    case 'success':
      return { color: palette.down, iconTone: 'down', textTone: 'down' };
    case 'warning':
      return { color: palette.amber, iconTone: 'amber', textTone: 'amber' };
    case 'danger':
      return { color: palette.danger, iconTone: 'danger', textTone: 'danger' };
    case 'info':
      return { color: palette.blue, iconTone: 'blue', textTone: 'blue' };
    case 'brand':
      return { color: palette.brand, iconTone: 'brand', textTone: 'brand' };
    case 'up':
      return { color: palette.up, iconTone: 'up', textTone: 'up' };
    case 'down':
      return { color: palette.down, iconTone: 'down', textTone: 'down' };
    case 'neutral':
    default:
      return { color: palette.textDim, iconTone: 'textDim', textTone: 'muted' };
  }
}

export function StatusPill({ compact, icon, label, size = compact ? 'sm' : 'md', style, tone }: StatusPillProps) {
  const palette = useThemePalette();
  const toneConfig = resolveTone(palette, tone);
  const isSmall = size === 'sm';
  const iconNode =
    typeof icon === 'string' ? <AppIcon name={icon as AppIconName} size={isSmall ? 11 : 14} tone={toneConfig.iconTone} /> : icon ?? null;

  return (
    <View
      style={StyleSheet.flatten([
        styles.pill,
        isSmall && styles.small,
        {
          backgroundColor: tone === 'neutral' ? palette.panelSoft : `${toneConfig.color}12`,
          borderColor: tone === 'neutral' ? palette.lineSoft : `${toneConfig.color}55`,
        },
        style,
      ])}>
      {iconNode}
      <AppText numberOfLines={1} style={styles.label} tone={toneConfig.textTone} variant={isSmall ? 'microLabel' : 'caption'}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignItems: 'center',
    borderRadius: radius.full,
    borderWidth: lineWidth.hairline,
    flexDirection: 'row',
    gap: 5,
    minHeight: 30,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  small: {
    gap: 4,
    minHeight: 22,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  label: {
    flexShrink: 1,
    minWidth: 0,
  },
});
