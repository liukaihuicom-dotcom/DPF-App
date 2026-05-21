import { StyleSheet, StyleProp, View, ViewStyle } from 'react-native';

import { AppText, type AppTextTone } from './Typography';

export type KeyValueListItem = {
  id?: string;
  label: string;
  tone?: AppTextTone;
  value: string;
};

type KeyValueListProps = {
  items: KeyValueListItem[];
  style?: StyleProp<ViewStyle>;
};

export function KeyValueList({ items, style }: KeyValueListProps) {
  return (
    <View style={StyleSheet.flatten([styles.list, style])}>
      {items.map((item) => (
        <View key={item.id ?? item.label} style={styles.row}>
          <AppText numberOfLines={1} style={styles.label} tone="muted" variant="body">
            {item.label}
          </AppText>
          <AppText adjustsFontSizeToFit numberOfLines={1} style={styles.value} tone={item.tone ?? 'default'} variant="subtitle">
            {item.value}
          </AppText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    flex: 1,
    minWidth: 0,
  },
  list: {
    gap: 8,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'space-between',
    minHeight: 24,
  },
  value: {
    flexShrink: 1,
    minWidth: 92,
    textAlign: 'right',
  },
});
