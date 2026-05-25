import { Platform, Pressable, StyleSheet, Switch, View } from 'react-native';

import { useThemeColors } from '@/src/settings/ProductSettings';
import { shadows } from '@/src/theme/colors';
import { lineWidth, radius, size, spacing } from '@/src/theme/tokens';

const iosSwitchSize = {
  thumb: size.control.xs,
  thumbTravel: size.control.lg - (spacing.xxs * 2) - size.control.xs,
  trackHeight: size.control.sm - spacing.sm,
  trackWidth: size.control.lg,
} as const;

type SwitchControlProps = {
  accessibilityLabel: string;
  disabled?: boolean;
  onValueChange: (value: boolean) => void;
  value: boolean;
};

export function SwitchControl({ accessibilityLabel, disabled, onValueChange, value }: SwitchControlProps) {
  const colors = useThemeColors();

  if (Platform.OS === 'web') {
    return (
      <View style={styles.touchTarget}>
        <Pressable
          accessibilityLabel={accessibilityLabel}
          accessibilityRole="switch"
          accessibilityState={{ checked: value, disabled }}
          disabled={disabled}
          hitSlop={10}
          onPress={() => onValueChange(!value)}
          style={StyleSheet.flatten([
            styles.iosTrack,
            {
              backgroundColor: value ? colors.status.success.solid : colors.surface.disabled,
              borderColor: value ? colors.status.success.solid : colors.border.subtle,
              opacity: disabled ? 0.5 : 1,
            },
          ])}>
          <View
            style={StyleSheet.flatten([
              styles.iosThumb,
              {
                backgroundColor: colors.surface.panel,
                transform: [{ translateX: value ? iosSwitchSize.thumbTravel : 0 }],
              },
            ])}
          />
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.touchTarget}>
      <Switch
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="switch"
        accessibilityState={{ checked: value, disabled }}
        disabled={disabled}
        hitSlop={10}
        onValueChange={onValueChange}
        thumbColor={Platform.OS === 'android' ? colors.surface.panel : undefined}
        trackColor={{ false: colors.surface.disabled, true: colors.status.success.solid }}
        value={value}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  iosThumb: {
    borderRadius: radius.full,
    height: iosSwitchSize.thumb,
    width: iosSwitchSize.thumb,
    ...shadows.panel,
  },
  iosTrack: {
    borderRadius: radius.full,
    borderWidth: lineWidth.strong,
    height: iosSwitchSize.trackHeight,
    justifyContent: 'center',
    paddingHorizontal: spacing.xxs,
    width: iosSwitchSize.trackWidth,
  },
  touchTarget: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: size.touch.min,
    minWidth: size.touch.min,
  },
});
