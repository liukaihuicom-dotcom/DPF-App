import { StyleProp, ViewStyle } from 'react-native';

import { localIconComponents } from '@/src/icons/local/iconComponentMap';
import { iconRegistry, resolveIconName, resolveIconTone, type AppIconName, type IconTone, type LegacyAppIconName } from '@/src/icons/iconRegistry';
import { useThemePalette } from '@/src/settings/ProductSettings';

type AppIconProps = {
  name: AppIconName | LegacyAppIconName;
  size?: number;
  style?: StyleProp<ViewStyle>;
  tone?: IconTone | string;
};

export function AppIcon({ name, size, style, tone }: AppIconProps) {
  const palette = useThemePalette();
  const resolvedName = resolveIconName(name);
  const icon = iconRegistry[resolvedName];
  const resolvedColor = resolveIconTone(palette, tone ?? 'text');
  const resolvedSize = size ?? icon.defaultSize;
  const componentKey = `${icon.sourceLibrary}:${icon.sourceIconName}` as keyof typeof localIconComponents;
  const Icon = localIconComponents[componentKey];

  if (!Icon) {
    return null;
  }

  return <Icon color={resolvedColor} size={resolvedSize} strokeWidth={icon.sourceLibrary === 'lucide' ? 1.9 : undefined} style={style} />;
}

export type { AppIconName, IconTone, LegacyAppIconName };
