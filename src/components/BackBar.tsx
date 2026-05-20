import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { useThemePalette } from '@/src/settings/ProductSettings';

import { AppText } from './Typography';
import { PhosphorIcon } from './PhosphorIcon';

type BackBarProps = {
  label: string;
};

export function BackBar({ label }: BackBarProps) {
  const palette = useThemePalette();

  return (
    <View style={styles.bar}>
      <Pressable
        accessibilityRole="button"
        onPress={() => router.back()}
        style={StyleSheet.flatten([styles.button, { backgroundColor: palette.panelSoft, borderColor: palette.line }])}>
        <PhosphorIcon color={palette.text} name="caret-left" size={22} />
      </Pressable>
      <AppText numberOfLines={1} variant="subtitle">
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    paddingTop: 8,
  },
  button: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
});
