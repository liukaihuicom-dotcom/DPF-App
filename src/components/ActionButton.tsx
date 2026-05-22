import { ActivityIndicator, StyleSheet, View, ViewStyle } from 'react-native';

import { useThemePalette } from '@/src/settings/ProductSettings';
import { radius, spacing } from '@/src/theme/tokens';

import { AppIcon, type AppIconName } from './AppIcon';
import { NativePressable } from './NativePressable';
import { AppText } from './Typography';

export type ActionButtonTone = 'up' | 'down' | 'blue' | 'brand' | 'neutral' | 'amber' | 'danger';

type ActionButtonProps = {
  accessibilityLabel?: string;
  disabled?: boolean;
  emphasis?: 'soft' | 'solid';
  icon?: AppIconName;
  label: string;
  loading?: boolean;
  onPress: () => void;
  tone?: ActionButtonTone;
  style?: ViewStyle;
};

export function ActionButton({ accessibilityLabel, disabled, emphasis = 'soft', icon, label, loading, onPress, tone = 'neutral', style }: ActionButtonProps) {
  const palette = useThemePalette();
  const softToneStyles = {
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
    danger: {
      backgroundColor: `${palette.danger}12`,
      borderColor: palette.danger,
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
  const solidToneStyles = {
    amber: {
      backgroundColor: palette.amber,
      borderColor: palette.amber,
    },
    blue: {
      backgroundColor: palette.blue,
      borderColor: palette.blue,
    },
    brand: {
      backgroundColor: palette.text,
      borderColor: palette.text,
    },
    danger: {
      backgroundColor: palette.danger,
      borderColor: palette.danger,
    },
    down: {
      backgroundColor: palette.down,
      borderColor: palette.down,
    },
    neutral: {
      backgroundColor: palette.panelSoft,
      borderColor: palette.lineSoft,
    },
    up: {
      backgroundColor: palette.up,
      borderColor: palette.up,
    },
  };

  const softToneForeground = {
    amber: palette.text,
    blue: palette.text,
    brand: palette.panel,
    danger: palette.danger,
    down: palette.text,
    neutral: palette.text,
    up: palette.text,
  };
  const solidToneForeground = {
    amber: palette.white,
    blue: palette.white,
    brand: palette.panel,
    danger: palette.white,
    down: palette.white,
    neutral: palette.text,
    up: palette.white,
  };
  const toneStyles = emphasis === 'solid' ? solidToneStyles : softToneStyles;
  const toneForeground = emphasis === 'solid' ? solidToneForeground : softToneForeground;
  const foregroundColor = disabled ? palette.textDim : toneForeground[tone];

  return (
    <NativePressable
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="button"
      accessibilityState={{ busy: Boolean(loading), disabled: Boolean(disabled || loading) }}
      disabled={disabled || loading}
      onPress={onPress}
      style={StyleSheet.flatten([styles.button, toneStyles[tone], disabled && { backgroundColor: palette.lineSoft, borderColor: palette.line }, style])}>
      {loading ? (
        <ActivityIndicator color={emphasis === 'solid' && tone !== 'neutral' ? foregroundColor : tone === 'brand' ? palette.panel : palette.textMuted} />
      ) : (
        <View style={styles.buttonContent}>
          {icon ? <AppIcon color={foregroundColor} name={icon} size={17} /> : null}
          <AppText adjustsFontSizeToFit numberOfLines={1} style={{ color: foregroundColor }} variant="subtitle">
            {label}
          </AppText>
        </View>
      )}
    </NativePressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: radius.full,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: 18,
    paddingVertical: spacing.md,
  },
  buttonContent: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    minWidth: 0,
  },
});
