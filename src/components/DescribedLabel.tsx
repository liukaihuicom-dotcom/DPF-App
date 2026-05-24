import { StyleSheet, View } from 'react-native';

import { useThemePalette } from '@/src/settings/ProductSettings';
import { lineWidth, spacing } from '@/src/theme/tokens';

import { NativePressable } from './NativePressable';
import { AppText } from './Typography';

type DescribedLabelProps = {
  accessibilityLabel?: string;
  label: string;
  onPress?: () => void;
};

export function DescribedLabel({ accessibilityLabel, label, onPress }: DescribedLabelProps) {
  const palette = useThemePalette();
  const content = (
    <View style={styles.wrap} testID="described-label">
      <AppText tone="muted" variant="caption">
        {label}
      </AppText>
      <View style={StyleSheet.flatten([styles.underline, { borderBottomColor: palette.textDim }])} testID="described-label-underline" />
    </View>
  );

  if (!onPress) {
    return content;
  }

  return (
    <NativePressable accessibilityLabel={accessibilityLabel ?? label} minTouch={32} onPress={onPress}>
      {content}
    </NativePressable>
  );
}

const styles = StyleSheet.create({
  underline: {
    alignSelf: 'stretch',
    borderBottomWidth: lineWidth.hairline,
    borderStyle: 'dashed',
    marginTop: spacing.xxs,
  },
  wrap: {
    alignSelf: 'flex-start',
  },
});
