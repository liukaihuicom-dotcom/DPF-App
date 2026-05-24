import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { AppIcon, type IconTone } from '@/src/components/AppIcon';
import type { Direction } from '@/src/domain/types';
import { useThemeColors } from '@/src/settings/ProductSettings';

type TradeDirectionIconProps = {
  direction: Direction;
  size?: number;
  style?: StyleProp<ViewStyle>;
};

export function TradeDirectionIcon({ direction, size = 42, style }: TradeDirectionIconProps) {
  const colors = useThemeColors();
  const tone: IconTone = direction === 'buy' ? 'down' : 'up';
  const glyphSize = Math.max(18, size * 0.56);
  const iconName = direction === 'buy' ? 'icon.trading.buy' : 'icon.trading.sell';

  return (
    <View
      style={StyleSheet.flatten([
        styles.shell,
        {
          backgroundColor: colors.surface.subtle,
          height: size,
          width: size,
        },
        style,
      ])}>
      <AppIcon name={iconName} size={glyphSize} tone={tone} />
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
