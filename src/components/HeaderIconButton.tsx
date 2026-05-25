import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { layout } from '@/src/theme/tokens';

import type { AppIconName, IconTone } from './AppIcon';
import { AppIconFrame } from './AppIconFrame';
import { NativePressable } from './NativePressable';

type HeaderIconButtonProps = {
  accessibilityLabel: string;
  disabled?: boolean;
  icon: AppIconName;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  tone?: 'default' | 'muted' | IconTone;
  variant?: 'filled' | 'ghost';
};

export function HeaderIconButton({
  accessibilityLabel,
  disabled,
  icon,
  onPress,
  style,
  tone = 'muted',
  variant = 'filled',
}: HeaderIconButtonProps) {
  const iconTone = tone === 'default' ? 'text' : tone === 'muted' ? 'textDim' : tone;

  return (
    <NativePressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      disabled={disabled}
      minTouch={layout.headerIconButtonSize}
      onPress={onPress}
      style={StyleSheet.flatten([styles.button, style])}>
      <AppIconFrame
        backgroundTone={variant === 'ghost' ? 'none' : 'neutral'}
        name={icon}
        size={layout.headerIconButtonSize}
        tone={iconTone}
        iconSize={layout.headerIconSize}
      />
    </NativePressable>
  );
}

export function HeaderIconSlot({ children, style }: { children?: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={StyleSheet.flatten([styles.slot, style])}>{children}</View>;
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
  },
  slot: {
    alignItems: 'center',
    height: layout.headerIconButtonSize,
    justifyContent: 'center',
    width: layout.headerIconButtonSize,
  },
});
