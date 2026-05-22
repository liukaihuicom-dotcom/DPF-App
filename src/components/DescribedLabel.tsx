import { StyleSheet, View } from 'react-native';

import { useThemePalette } from '@/src/settings/ProductSettings';
import { spacing } from '@/src/theme/tokens';

import { AppText } from './Typography';

type DescribedLabelProps = {
  label: string;
};

export function DescribedLabel({ label }: DescribedLabelProps) {
  const palette = useThemePalette();

  return (
    <View style={styles.wrap} testID="described-label">
      <AppText tone="muted" variant="caption">
        {label}
      </AppText>
      <View style={StyleSheet.flatten([styles.underline, { borderBottomColor: palette.textDim }])} testID="described-label-underline" />
    </View>
  );
}

const styles = StyleSheet.create({
  underline: {
    alignSelf: 'stretch',
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    marginTop: spacing.xxs,
  },
  wrap: {
    alignSelf: 'flex-start',
  },
});
