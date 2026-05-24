import { StyleProp, ViewStyle } from 'react-native';

import { AppIcon, type AppIconName, type IconTone } from '@/src/components/AppIcon';

type TabBarIconProps = {
  name: AppIconName;
  style?: StyleProp<ViewStyle>;
  tone: IconTone;
};

export function TabBarIcon({ name, style, tone }: TabBarIconProps) {
  return <AppIcon name={name} size={20} style={[{ marginBottom: -2 }, style]} tone={tone} />;
}
