import { StyleSheet, View } from 'react-native';

import { useThemePalette } from '@/src/settings/ProductSettings';
import { radius, spacing } from '@/src/theme/tokens';

import { AppIcon, type AppIconName } from './AppIcon';
import { Card } from './Card';
import { NativePressable } from './NativePressable';
import { AppText } from './Typography';

export type GlobalMenuListItem = {
  accessibilityLabel?: string;
  icon: AppIconName;
  label: string;
  onPress?: () => void;
};

type GlobalMenuListProps = {
  items: GlobalMenuListItem[];
  contained?: boolean;
};

export function GlobalMenuList({ contained, items }: GlobalMenuListProps) {
  const palette = useThemePalette();
  const content = (
    <View style={StyleSheet.flatten([styles.list, contained && { borderColor: palette.lineSoft }])}>
      {items.map((item, index) => (
        <NativePressable
          accessibilityLabel={item.accessibilityLabel ?? item.label}
          key={item.label}
          minTouch={58}
          onPress={item.onPress}
          style={StyleSheet.flatten([styles.row, index < items.length - 1 && { borderBottomColor: palette.lineSoft, borderBottomWidth: 1 }])}>
          <View style={styles.rowLeft}>
            <AppIcon color={palette.text} name={item.icon} size={22} />
            <AppText numberOfLines={1} variant="subtitle">
              {item.label}
            </AppText>
          </View>
          <AppIcon color={palette.textDim} name="navigateNext" size={18} />
        </NativePressable>
      ))}
    </View>
  );

  if (contained) {
    return <View style={StyleSheet.flatten([styles.container, { backgroundColor: palette.panel, borderColor: palette.lineSoft }])}>{content}</View>;
  }

  return <Card compact>{content}</Card>;
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.xl,
    borderWidth: 1,
    overflow: 'hidden',
    paddingHorizontal: spacing.md,
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
    gap: spacing.md,
    minWidth: 0,
  },
});
