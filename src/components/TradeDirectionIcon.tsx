import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import type { Direction } from '@/src/domain/types';
import { useThemePalette } from '@/src/settings/ProductSettings';

type TradeDirectionIconProps = {
  direction: Direction;
  size?: number;
  style?: StyleProp<ViewStyle>;
};

export function TradeDirectionIcon({ direction, size = 42, style }: TradeDirectionIconProps) {
  const palette = useThemePalette();
  const color = direction === 'buy' ? palette.down : palette.up;
  const glyphSize = Math.max(18, size * 0.56);

  return (
    <View
      style={StyleSheet.flatten([
        styles.shell,
        {
          backgroundColor: palette.panelSoft,
          height: size,
          width: size,
        },
        style,
      ])}>
      <Svg height={glyphSize} viewBox="0 0 24 24" width={glyphSize}>
        {direction === 'buy' ? (
          <Path d="M7 17L17 7M17 7H9M17 7V15" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} />
        ) : (
          <Path d="M7 7L17 17M17 17H9M17 17V9" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} />
        )}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    alignItems: 'center',
    borderRadius: 999,
    justifyContent: 'center',
  },
});
