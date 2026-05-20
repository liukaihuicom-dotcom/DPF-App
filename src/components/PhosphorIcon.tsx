import { StyleProp, ViewStyle } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { phosphorIcons, type PhosphorIconName } from '@/src/icons/phosphor';

type PhosphorIconProps = {
  color: string;
  name: PhosphorIconName;
  size?: number;
  style?: StyleProp<ViewStyle>;
};

export function PhosphorIcon({ color, name, size = 20, style }: PhosphorIconProps) {
  return <SvgXml color={color} height={size} style={style} width={size} xml={phosphorIcons[name]} />;
}

export type { PhosphorIconName };
