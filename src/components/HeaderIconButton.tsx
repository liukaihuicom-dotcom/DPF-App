import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { useThemePalette } from '@/src/settings/ProductSettings';
import { layout, radius } from '@/src/theme/tokens';

import { AppIcon, type AppIconName } from './AppIcon';
import { NativePressable } from './NativePressable';

type HeaderIconButtonProps = {
  accessibilityLabel: string;
  color?: string;
  disabled?: boolean;
  icon: AppIconName;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  tone?: 'default' | 'muted';
  variant?: 'filled' | 'ghost';
};

export function HeaderIconButton({
  accessibilityLabel,
  color,
  disabled,
  icon,
  onPress,
  style,
  tone = 'muted',
  variant = 'filled',
}: HeaderIconButtonProps) {
  const palette = useThemePalette();
  const iconColor = color ?? (tone === 'default' ? palette.text : palette.textDim);
  const buttonStyle = StyleSheet.flatten([
    styles.button,
    variant === 'filled' && {
      backgroundColor: palette.panelSoft,
    },
    variant === 'ghost' && styles.ghost,
    style,
  ]);

  return (
    <NativePressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      disabled={disabled}
      minTouch={layout.headerIconButtonSize}
      onPress={onPress}
      style={buttonStyle}>
      <AppIcon color={iconColor} name={icon} size={layout.headerIconSize} />
    </NativePressable>
  );
}

export function HeaderIconSlot({ children, style }: { children?: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={StyleSheet.flatten([styles.slot, style])}>{children}</View>;
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: radius.full,
    height: layout.headerIconButtonSize,
    justifyContent: 'center',
    width: layout.headerIconButtonSize,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  slot: {
    alignItems: 'center',
    height: layout.headerIconButtonSize,
    justifyContent: 'center',
    width: layout.headerIconButtonSize,
  },
});
