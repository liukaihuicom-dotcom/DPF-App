import { PropsWithChildren } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { useThemePalette } from '@/src/settings/ProductSettings';

export function AppViewport({ children }: PropsWithChildren) {
  const palette = useThemePalette();

  if (Platform.OS !== 'web') {
    return <View style={StyleSheet.flatten([styles.native, { backgroundColor: palette.bg }])}>{children}</View>;
  }

  return (
    <View style={StyleSheet.flatten([styles.stage, { backgroundColor: palette.panelSoft }])}>
      <View style={StyleSheet.flatten([styles.phone, { backgroundColor: palette.bg, borderColor: palette.lineSoft }])}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  phone: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
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
