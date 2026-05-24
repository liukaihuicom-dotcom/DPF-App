import { ActivityIndicator, StyleSheet, View, ViewStyle } from 'react-native';

import { useThemePalette } from '@/src/settings/ProductSettings';
import { lineWidth, radius, size, spacing } from '@/src/theme/tokens';

import { AppIcon, type AppIconName, type IconTone } from './AppIcon';
import { NativePressable } from './NativePressable';
import { AppText, type AppTextTone } from './Typography';

export type ActionButtonTone = 'up' | 'down' | 'blue' | 'brand' | 'neutral' | 'amber' | 'danger';
export type ActionButtonVariant = 'filled' | 'outline' | 'text';
export type ActionButtonSizePreset = 'default' | 'lg';
type ResolvedActionButtonVariant = ActionButtonVariant | 'legacySoft';

type ActionButtonProps = {
  accessibilityLabel?: string;
  disabled?: boolean;
  /** @deprecated Prefer `variant`. */
  emphasis?: 'soft' | 'solid';
  icon?: AppIconName;
  label: string;
  loading?: boolean;
  onPress: () => void;
  sizePreset?: ActionButtonSizePreset;
  tone?: ActionButtonTone;
  style?: ViewStyle;
  variant?: ActionButtonVariant;
};

export function ActionButton({
  accessibilityLabel,
  disabled,
  emphasis = 'soft',
  icon,
  label,
  loading,
  onPress,
  sizePreset = 'default',
  tone = 'neutral',
  style,
  variant,
}: ActionButtonProps) {
  const palette = useThemePalette();
  const legacySoftToneStyles = {
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
  const filledToneStyles = {
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

  const outlineToneStyles = {
    amber: {
      backgroundColor: 'transparent',
      borderColor: palette.amber,
    },
    blue: {
      backgroundColor: 'transparent',
      borderColor: palette.blue,
    },
    brand: {
      backgroundColor: 'transparent',
      borderColor: palette.text,
    },
    danger: {
      backgroundColor: 'transparent',
      borderColor: palette.danger,
    },
    down: {
      backgroundColor: 'transparent',
      borderColor: palette.down,
    },
    neutral: {
      backgroundColor: 'transparent',
      borderColor: palette.line,
    },
    up: {
      backgroundColor: 'transparent',
      borderColor: palette.up,
    },
  };
  const textToneStyles = {
    amber: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
    },
    blue: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
    },
    brand: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
    },
    danger: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
    },
    down: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
    },
    neutral: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
    },
    up: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
    },
  };
  const legacySoftTextTones = {
    amber: 'default',
    blue: 'default',
    brand: 'panel',
    danger: 'danger',
    down: 'default',
    neutral: 'default',
    up: 'default',
  } satisfies Record<ActionButtonTone, AppTextTone>;
  const filledTextTones = {
    amber: 'white',
    blue: 'white',
    brand: 'panel',
    danger: 'white',
    down: 'white',
    neutral: 'default',
    up: 'white',
  } satisfies Record<ActionButtonTone, AppTextTone>;
  const outlineAndTextTones = {
    amber: 'amber',
    blue: 'blue',
    brand: 'default',
    danger: 'danger',
    down: 'down',
    neutral: 'default',
    up: 'up',
  } satisfies Record<ActionButtonTone, AppTextTone>;
  const resolvedVariant: ResolvedActionButtonVariant = variant ?? (emphasis === 'solid' ? 'filled' : 'legacySoft');
  const toneStyles =
    resolvedVariant === 'filled'
      ? filledToneStyles
      : resolvedVariant === 'outline'
        ? outlineToneStyles
        : resolvedVariant === 'text'
          ? textToneStyles
          : legacySoftToneStyles;
  const toneForeground =
    resolvedVariant === 'filled' ? filledTextTones : resolvedVariant === 'legacySoft' ? legacySoftTextTones : outlineAndTextTones;
  const foregroundTone = disabled ? 'disabled' : toneForeground[tone];
  const textToneColors = {
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
  } satisfies Record<AppTextTone, string>;
  const foregroundColor = textToneColors[foregroundTone];
  const iconTone: IconTone = disabled
    ? 'disabled'
    : resolvedVariant === 'filled' && tone !== 'neutral'
      ? tone === 'brand'
        ? 'panel'
        : 'white'
      : resolvedVariant === 'legacySoft'
        ? tone === 'danger'
          ? 'danger'
          : tone === 'brand'
            ? 'panel'
            : 'text'
        : tone === 'neutral'
          ? 'text'
          : tone;
  const spinnerColor = disabled
    ? palette.disabledText
    : resolvedVariant === 'filled'
      ? tone === 'neutral'
        ? palette.textMuted
        : foregroundColor
      : foregroundColor;
  const disabledButtonStyle =
    resolvedVariant === 'text'
      ? styles.disabledTextButton
      : resolvedVariant === 'outline'
        ? { backgroundColor: 'transparent', borderColor: palette.disabledBorder }
        : { backgroundColor: palette.disabledSurface, borderColor: palette.disabledBorder };

  return (
    <NativePressable
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="button"
      accessibilityState={{ busy: Boolean(loading), disabled: Boolean(disabled || loading) }}
      disableDefaultDisabledStyle
      disabled={disabled || loading}
      onPress={onPress}
      style={StyleSheet.flatten([
        styles.button,
        sizePreset === 'lg' && styles.buttonLg,
        resolvedVariant === 'text' && styles.textButton,
        toneStyles[tone],
        disabled && styles.disabledButton,
        disabled && disabledButtonStyle,
        style,
      ])}>
      {loading ? (
        <ActivityIndicator color={spinnerColor} />
      ) : (
        <View style={styles.buttonContent}>
          {icon ? <AppIcon name={icon} size={17} tone={iconTone} /> : null}
          <AppText adjustsFontSizeToFit numberOfLines={1} tone={foregroundTone} variant={sizePreset === 'lg' ? 'buttonLg' : 'buttonMd'}>
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
    borderWidth: lineWidth.hairline,
    justifyContent: 'center',
    minHeight: size.button.minHeight,
    paddingHorizontal: 18,
    paddingVertical: spacing.md,
  },
  buttonLg: {
    minHeight: size.control.lg,
    paddingHorizontal: spacing.xl,
  },
  buttonContent: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    minWidth: 0,
  },
  disabledTextButton: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  disabledButton: {
    opacity: 1,
  },
  textButton: {
    paddingHorizontal: spacing.sm,
  },
});
