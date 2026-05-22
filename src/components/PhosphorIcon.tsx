import { StyleProp, ViewStyle } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { phosphorIcons, type PhosphorIconName } from '@/src/icons/phosphor';

type PhosphorIconProps = {
  color: string;
  height?: number;
  name: PhosphorIconName;
  size?: number;
  style?: StyleProp<ViewStyle>;
  width?: number;
};

export function PhosphorIcon({ color, height, name, size = 20, style, width }: PhosphorIconProps) {
  return <SvgXml color={color} height={height ?? size} style={style} width={width ?? size} xml={phosphorIcons[name]} />;
}

export type { PhosphorIconName };
