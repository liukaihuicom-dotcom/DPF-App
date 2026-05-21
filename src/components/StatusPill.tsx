import { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { useThemePalette } from '@/src/settings/ProductSettings';
import type { ThemePalette } from '@/src/theme/colors';

import { PhosphorIcon, type PhosphorIconName } from './PhosphorIcon';
import { AppText, type AppTextTone } from './Typography';

export type StatusPillTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'brand' | 'up' | 'down';

export type StatusPillProps = {
  compact?: boolean;
  icon?: PhosphorIconName | ReactNode;
  label: string;
  style?: StyleProp<ViewStyle>;
  tone: StatusPillTone;
};

function resolveTone(palette: ThemePalette, tone: StatusPillTone): { color: string; textTone: AppTextTone } {
  switch (tone) {
    case 'success':
      return { color: palette.down, textTone: 'down' };
    case 'warning':
      return { color: palette.amber, textTone: 'amber' };
    case 'danger':
      return { color: palette.danger, textTone: 'danger' };
    case 'info':
      return { color: palette.blue, textTone: 'blue' };
    case 'brand':
      return { color: palette.brand, textTone: 'brand' };
    case 'up':
      return { color: palette.up, textTone: 'up' };
    case 'down':
      return { color: palette.down, textTone: 'down' };
    case 'neutral':
    default:
      return { color: palette.textDim, textTone: 'muted' };
  }
}

export function StatusPill({ compact, icon, label, style, tone }: StatusPillProps) {
  const palette = useThemePalette();
  const toneConfig = resolveTone(palette, tone);
  const iconNode =
    typeof icon === 'string' ? <PhosphorIcon color={toneConfig.color} name={icon as PhosphorIconName} size={compact ? 12 : 14} /> : icon ?? null;

  return (
    <View
      style={StyleSheet.flatten([
        styles.pill,
        compact && styles.compact,
        {
          backgroundColor: tone === 'neutral' ? palette.panelSoft : `${toneConfig.color}12`,
          borderColor: tone === 'neutral' ? palette.lineSoft : `${toneConfig.color}55`,
        },
        style,
      ])}>
      {iconNode}
      <AppText numberOfLines={1} tone={toneConfig.textTone} variant="caption">
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  compact: {
    minHeight: 26,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  pill: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 5,
    minHeight: 30,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});
