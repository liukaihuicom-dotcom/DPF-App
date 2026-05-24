import { StyleSheet } from 'react-native';

import { spacing } from '@/src/theme/tokens';

import { AppText } from '../Typography';

type SheetGroupTitleProps = {
  title: string;
};

export function SheetGroupTitle({ title }: SheetGroupTitleProps) {
  return (
    <AppText style={styles.title} tone="muted" variant="caption">
      {title}
    </AppText>
  );
}

const styles = StyleSheet.create({
  title: {
    paddingHorizontal: spacing.sm,
  },
});
