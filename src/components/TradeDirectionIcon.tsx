import { type StyleProp, type ViewStyle } from 'react-native';

import type { IconTone } from '@/src/components/AppIcon';
import { AppIconFrame } from '@/src/components/AppIconFrame';
import type { Direction } from '@/src/domain/types';

type TradeDirectionIconProps = {
  direction: Direction;
  size?: number;
  style?: StyleProp<ViewStyle>;
};

export function TradeDirectionIcon({ direction, size = 42, style }: TradeDirectionIconProps) {
  const tone: IconTone = direction === 'buy' ? 'down' : 'up';
  const glyphSize = Math.max(18, size * 0.56);
  const iconName = direction === 'buy' ? 'icon.trading.buy' : 'icon.trading.sell';

  return <AppIconFrame backgroundTone="neutral" name={iconName} size={size} tone={tone} iconSize={glyphSize} style={style} />;
}
