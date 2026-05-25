import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { useThemeColors } from '@/src/settings/ProductSettings';
import { lineWidth, radius, size, spacing } from '@/src/theme/tokens';

import { AppIcon, type AppIconName } from './AppIcon';
import { Card } from './Card';
import { NativePressable } from './NativePressable';
import { AppText } from './Typography';

export type GlobalMenuListItem = {
  accessibilityLabel?: string;
  accessory?: ReactNode;
  description?: string;
  icon?: AppIconName;
  label: string;
  onPress?: () => void;
  rightLabel?: string;
  showChevron?: boolean;
  tone?: 'default' | 'danger';
};

type GlobalMenuListProps = {
  items: GlobalMenuListItem[];
  contained?: boolean;
  showChevron?: boolean;
  variant?: 'navigation' | 'descriptive';
};

export function GlobalMenuList({ contained, items, showChevron = true, variant = 'navigation' }: GlobalMenuListProps) {
  const colors = useThemeColors();
  const content = (
    <View style={styles.list}>
      {items.map((item, index) => {
        const isDanger = item.tone === 'danger';
        const iconTone = isDanger ? 'danger' : variant === 'descriptive' ? 'textDim' : 'text';
        const textTone = isDanger ? 'danger' : 'default';
        const shouldShowChevron = item.showChevron ?? showChevron;

        return (
          <NativePressable
            accessibilityLabel={item.accessibilityLabel ?? item.label}
            key={item.label}
            minTouch={58}
            onPress={item.onPress}
            style={StyleSheet.flatten([
              styles.row,
              variant === 'descriptive' && styles.descriptiveRow,
              index < items.length - 1 && { borderBottomColor: colors.border.subtle, borderBottomWidth: lineWidth.hairline },
            ])}>
            <View style={styles.rowLeft}>
              {item.icon ? (
                <AppIcon name={item.icon} sizeVariant="md" tone={iconTone} />
              ) : (
                <View style={styles.emptyIconSlot} />
              )}
              <View style={styles.rowText}>
                <AppText numberOfLines={1} tone={textTone} variant="title.listItem">
                  {item.label}
                </AppText>
                {item.description ? (
                  <AppText numberOfLines={2} tone="muted" variant="body.secondary">
                    {item.description}
                  </AppText>
                ) : null}
              </View>
            </View>
            <View style={styles.rowRight}>
              {item.accessory ? item.accessory : null}
              {item.rightLabel ? (
                <AppText numberOfLines={1} style={styles.rightLabel} tone="muted" variant="body.secondary">
                  {item.rightLabel}
                </AppText>
              ) : null}
              {shouldShowChevron ? <AppIcon name="icon.system.chevron_right" sizeVariant="md" /> : null}
            </View>
          </NativePressable>
        );
      })}
    </View>
  );

  if (contained) {
    return <View style={styles.container}>{content}</View>;
  }

  return <Card compact>{content}</Card>;
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.md,
    borderWidth: lineWidth.none,
    overflow: 'hidden',
  },
  descriptiveRow: {
    gap: spacing.md,
    minHeight: 76,
    paddingVertical: spacing.md,
  },
  list: {
    overflow: 'hidden',
  },
  emptyIconSlot: {
    height: size.icon.md,
    width: size.icon.md,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
    minHeight: 58,
  },
  rowLeft: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    minWidth: 0,
  },
  rowText: {
    flex: 1,
    gap: spacing.xs,
    minWidth: 0,
  },
  rowRight: {
    alignItems: 'center',
    flexDirection: 'row',
    flexShrink: 0,
    gap: spacing.xs,
    justifyContent: 'flex-end',
    maxWidth: '48%',
  },
  rightLabel: {
    flexShrink: 1,
  },
});
