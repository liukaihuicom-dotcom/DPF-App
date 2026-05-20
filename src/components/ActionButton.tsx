import { ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';

import { useThemePalette } from '@/src/settings/ProductSettings';

import { NativePressable } from './NativePressable';
import { AppText } from './Typography';

type ActionButtonProps = {
  accessibilityLabel?: string;
  disabled?: boolean;
  label: string;
  loading?: boolean;
  onPress: () => void;
  tone?: 'up' | 'down' | 'blue' | 'brand' | 'neutral' | 'amber';
  style?: ViewStyle;
};

export function ActionButton({ accessibilityLabel, disabled, label, loading, onPress, tone = 'neutral', style }: ActionButtonProps) {
  const palette = useThemePalette();
  const toneStyles = {
    amber: {
      backgroundColor: `${palette.amber}12`,
      borderColor: palette.amber,
    },
    blue: {
      backgroundColor: `${palette.blue}12`,
      borderColor: palette.blue,
    },
    brand: {
      backgroundColor: palette.text,
      borderColor: palette.text,
    },
    down: {
      backgroundColor: `${palette.down}12`,
      borderColor: palette.down,
    },
    neutral: {
      backgroundColor: palette.panelSoft,
      borderColor: palette.lineSoft,
    },
    up: {
      backgroundColor: `${palette.up}12`,
      borderColor: palette.up,
    },
  };

  return (
    <NativePressable
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="button"
      accessibilityState={{ busy: Boolean(loading), disabled: Boolean(disabled || loading) }}
      disabled={disabled || loading}
      onPress={onPress}
      style={StyleSheet.flatten([styles.button, toneStyles[tone], disabled && { backgroundColor: palette.lineSoft, borderColor: palette.line }, style])}>
      {loading ? (
        <ActivityIndicator color={tone === 'brand' ? palette.panel : palette.textMuted} />
      ) : (
        <AppText
          adjustsFontSizeToFit
          numberOfLines={1}
          style={(tone === 'brand' || disabled) && { color: disabled ? palette.textDim : palette.panel }}
          variant="subtitle">
          {label}
        </AppText>
      )}
    </NativePressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
});
