import { StyleProp, ViewStyle } from 'react-native';

import { AppIcon, type AppIconName, type AppIconStyleVariant, type IconTone } from '@/src/components/AppIcon';
import { size } from '@/src/theme/tokens';

type TabBarIconProps = {
  name: AppIconName;
  style?: StyleProp<ViewStyle>;
  styleVariant?: AppIconStyleVariant;
  tone: IconTone;
};

export function TabBarIcon({ name, style, styleVariant = 'line', tone }: TabBarIconProps) {
  return <AppIcon name={name} size={size.tab.icon} style={[{ marginBottom: -2 }, style]} styleVariant={styleVariant} tone={tone} />;
}
