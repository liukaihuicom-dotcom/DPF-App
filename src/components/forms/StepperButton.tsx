import { StyleSheet } from 'react-native';

import { useThemePalette } from '@/src/settings/ProductSettings';
import { lineWidth, radius, size } from '@/src/theme/tokens';

import { NativePressable } from '../NativePressable';
import { AppText } from '../Typography';

type StepperButtonProps = {
  label: string;
  onPress: () => void;
  symbol: string;
};

export function StepperButton({ label, onPress, symbol }: StepperButtonProps) {
  const palette = useThemePalette();

  return (
    <NativePressable
      accessibilityLabel={label}
      accessibilityRole="button"
      minTouch={size.control.md}
      onPress={onPress}
      style={StyleSheet.flatten([styles.button, { backgroundColor: palette.panel, borderColor: palette.lineSoft }])}>
      <AppText variant="titleMd">{symbol}</AppText>
    </NativePressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: radius.full,
    borderWidth: lineWidth.hairline,
    height: size.control.md,
    justifyContent: 'center',
    width: size.control.md,
  },
});
