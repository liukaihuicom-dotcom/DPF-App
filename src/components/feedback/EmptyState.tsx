import { StyleSheet, View } from 'react-native';

import { useThemeColors } from '@/src/settings/ProductSettings';
import { radius, spacing } from '@/src/theme/tokens';

import { ActionButton } from '../ActionButton';
import type { AppIconName } from '../AppIcon';
import { AppIconFrame } from '../AppIconFrame';
import { Card } from '../Card';
import { AppText } from '../Typography';

type EmptyStateProps = {
  actionLabel?: string;
  body: string;
  icon?: AppIconName;
  onAction?: () => void;
  onSecondaryAction?: () => void;
  secondaryLabel?: string;
  title?: string;
  variant?: 'plain' | 'card';
};

export function EmptyState({
  actionLabel,
  body,
  icon,
  onAction,
  onSecondaryAction,
  secondaryLabel,
  title,
  variant = 'plain',
}: EmptyStateProps) {
  const colors = useThemeColors();

  if (variant === 'card') {
    return (
      <Card compact style={styles.card}>
        <View style={styles.row}>
          {icon ? (
            <AppIconFrame name={icon} sizeVariant="lg" iconSizeVariant="md" />
          ) : null}
          <View style={styles.text}>
            {title ? <AppText variant="title.card">{title}</AppText> : null}
            <AppText tone="muted" variant="label.helper">
              {body}
            </AppText>
          </View>
        </View>
        <View style={styles.actionRow}>
          {secondaryLabel && onSecondaryAction ? (
            <ActionButton label={secondaryLabel} onPress={onSecondaryAction} style={styles.action} tone="neutral" />
          ) : (
            <View style={styles.action} />
          )}
          {actionLabel && onAction ? (
            <ActionButton label={actionLabel} onPress={onAction} style={styles.action} tone="brand" />
          ) : (
            <View style={styles.action} />
          )}
        </View>
      </Card>
    );
  }

  return (
    <View style={StyleSheet.flatten([styles.plain, { backgroundColor: colors.surface.subtle }])}>
      <AppText tone="muted" variant="body.secondary">
        {body}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  action: {
    flex: 1,
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  card: {
    gap: spacing.md,
  },
  plain: {
    alignItems: 'center',
    borderRadius: radius.md,
    padding: spacing.lg,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  text: {
    flex: 1,
    gap: spacing.xs,
    minWidth: 0,
  },
});
