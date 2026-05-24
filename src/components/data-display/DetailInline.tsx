import { StyleSheet, View } from 'react-native';

import { spacing } from '@/src/theme/tokens';

import { AppText } from '../Typography';

type DetailInlineProps = {
  label: string;
  value: string;
};

export function DetailInline({ label, value }: DetailInlineProps) {
  return (
    <View style={styles.inline}>
      <AppText tone="muted" variant="body">
        {label}
      </AppText>
      <AppText variant="body">{value}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  inline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
});
