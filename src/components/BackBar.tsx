import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { useThemeColors } from '@/src/settings/ProductSettings';

import { AppText } from './Typography';
import { HeaderIconButton } from './HeaderIconButton';

type BackBarProps = {
  label: string;
};

export function BackBar({ label }: BackBarProps) {
  const colors = useThemeColors();

  return (
    <View style={styles.bar}>
      <HeaderIconButton
        accessibilityLabel={label}
        icon="icon.system.back"
        onPress={() => router.back()}
        tone="default"
      />
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
});
