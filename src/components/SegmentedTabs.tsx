import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { useThemeColors } from '@/src/settings/ProductSettings';
import { lineWidth, radius, size, spacing } from '@/src/theme/tokens';

import { NativePressable } from './NativePressable';
import { AppText } from './Typography';

export type SegmentedTabItem<T extends string> = {
  accessibilityLabel?: string;
  label: string;
  value: T;
};

type SegmentedTabsProps<T extends string> = {
  items: SegmentedTabItem<T>[];
  onValueChange: (value: T) => void;
  style?: StyleProp<ViewStyle>;
  value: T;
};

export function SegmentedTabs<T extends string>({ items, onValueChange, style, value }: SegmentedTabsProps<T>) {
  const colors = useThemeColors();

  return (
    <View style={StyleSheet.flatten([styles.rail, { backgroundColor: colors.surface.subtle, borderColor: colors.border.subtle }, style])}>
      {items.map((item) => {
        const selected = value === item.value;

        return (
          <NativePressable
            accessibilityLabel={item.accessibilityLabel ?? item.label}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            key={item.value}
            minTouch={size.tab.itemMinHeight}
            onPress={() => onValueChange(item.value)}
            style={StyleSheet.flatten([styles.item, selected && { backgroundColor: colors.surface.panel, borderColor: colors.border.default }])}>
            <AppText adjustsFontSizeToFit numberOfLines={1} tone={selected ? 'default' : 'muted'} variant="caption">
              {item.label}
            </AppText>
          </NativePressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    alignItems: 'center',
    borderColor: 'transparent',
    borderRadius: radius.full,
    borderWidth: lineWidth.hairline,
    flex: 1,
    justifyContent: 'center',
    minHeight: size.tab.itemMinHeight,
    minWidth: 0,
  },
  rail: {
    borderRadius: radius.full,
    borderWidth: lineWidth.hairline,
    flexDirection: 'row',
    gap: spacing.xs,
    padding: spacing.xs,
  },
});
