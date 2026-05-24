import { StyleSheet, View } from 'react-native';

import { useThemeColors } from '@/src/settings/ProductSettings';
import { lineWidth, radius, size, spacing } from '@/src/theme/tokens';

import { NativePressable } from '../NativePressable';

type SwitchControlProps = {
  accessibilityLabel: string;
  onValueChange: (value: boolean) => void;
  value: boolean;
};

export function SwitchControl({ accessibilityLabel, onValueChange, value }: SwitchControlProps) {
  const colors = useThemeColors();

  return (
    <NativePressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      minTouch={size.touch.min}
      onPress={() => onValueChange(!value)}
      style={StyleSheet.flatten([
        styles.track,
        {
          backgroundColor: value ? colors.brand.fg : colors.surface.subtle,
          borderColor: value ? colors.brand.fg : colors.border.subtle,
        },
      ])}>
      <View style={StyleSheet.flatten([styles.thumb, { backgroundColor: value ? colors.text.inverse : colors.text.tertiary, transform: [{ translateX: value ? 18 : 0 }] }])} />
    </NativePressable>
  );
}

const styles = StyleSheet.create({
  thumb: {
    borderRadius: radius.full,
    height: size.icon.md,
    width: size.icon.md,
  },
  track: {
    alignItems: 'center',
    borderRadius: radius.full,
    borderWidth: lineWidth.hairline,
    flexDirection: 'row',
    height: size.control.xs,
    paddingHorizontal: spacing.xxs,
    width: size.control.md,
  },
});
