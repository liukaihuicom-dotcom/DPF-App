import { PropsWithChildren } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { lineWidth } from '@/src/theme/tokens';
import { useThemeColors } from '@/src/settings/ProductSettings';

export function AppViewport({ children }: PropsWithChildren) {
  const colors = useThemeColors();

  if (Platform.OS !== 'web') {
    return <View style={StyleSheet.flatten([styles.native, { backgroundColor: colors.surface.canvas }])}>{children}</View>;
  }

  return (
    <View style={StyleSheet.flatten([styles.stage, { backgroundColor: colors.surface.subtle }])}>
      <View style={StyleSheet.flatten([styles.phone, { backgroundColor: colors.surface.canvas, borderColor: colors.border.subtle }])}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  phone: {
    borderLeftWidth: lineWidth.hairline,
    borderRightWidth: lineWidth.hairline,
    flex: 1,
    maxWidth: 430,
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
  },
  native: {
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  stage: {
    alignItems: 'center',
    flex: 1,
    width: '100%',
  },
});
