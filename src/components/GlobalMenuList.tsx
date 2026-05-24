import { StyleSheet, View } from 'react-native';

import { useThemeColors } from '@/src/settings/ProductSettings';
import { lineWidth, radius, size, spacing } from '@/src/theme/tokens';

import { AppIcon, type AppIconName } from './AppIcon';
import { Card } from './Card';
import { NativePressable } from './NativePressable';
import { AppText } from './Typography';

export type GlobalMenuListItem = {
  accessibilityLabel?: string;
  description?: string;
  icon: AppIconName;
  label: string;
  onPress?: () => void;
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
    <View style={StyleSheet.flatten([styles.list, contained && { borderColor: colors.border.subtle }])}>
      {items.map((item, index) => {
        const isDanger = item.tone === 'danger';
        const iconTone = isDanger ? 'danger' : variant === 'descriptive' ? 'textDim' : 'text';
        const textTone = isDanger ? 'danger' : 'default';

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
              <View
                style={StyleSheet.flatten([
                  styles.iconWrap,
                  variant === 'descriptive' && styles.descriptiveIconWrap,
                  variant === 'descriptive' && { backgroundColor: colors.surface.subtle, borderColor: colors.border.subtle },
                ])}>
                <AppIcon name={item.icon} size={variant === 'descriptive' ? size.icon.md : size.icon.lg} tone={iconTone} />
              </View>
              <View style={styles.rowText}>
                <AppText numberOfLines={1} tone={textTone} variant="buttonMd">
                  {item.label}
                </AppText>
                {item.description ? (
                  <AppText numberOfLines={2} tone="muted" variant="caption">
                    {item.description}
                  </AppText>
                ) : null}
              </View>
            </View>
            {showChevron ? <AppIcon name="icon.system.chevron_right" size={size.icon.sm} /> : null}
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
  descriptiveIconWrap: {
    backgroundColor: 'transparent',
    borderRadius: radius.md,
    borderWidth: lineWidth.hairline,
  },
  iconWrap: {
    alignItems: 'center',
    height: size.control.sm,
    justifyContent: 'center',
    width: size.control.sm,
  },
  descriptiveRow: {
    gap: spacing.md,
    minHeight: 76,
    paddingVertical: spacing.md,
  },
  list: {
    overflow: 'hidden',
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
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
});
