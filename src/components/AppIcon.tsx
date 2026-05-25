import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { localIconComponents } from '@/src/icons/local/iconComponentMap';
import { iconRegistry, resolveIconName, resolveIconTone, type AppIconName, type IconTone, type LegacyAppIconName } from '@/src/icons/iconRegistry';
import { useThemeColors } from '@/src/settings/ProductSettings';
import { lineWidth, size as sizeTokens } from '@/src/theme/tokens';

export type AppIconSizeVariant = 'micro' | 'mini' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'display';
export type AppIconStyleVariant = 'line' | 'fill';

type AppIconProps = {
  name: AppIconName | LegacyAppIconName;
  size?: number;
  sizeVariant?: AppIconSizeVariant;
  style?: StyleProp<ViewStyle>;
  styleVariant?: AppIconStyleVariant;
  tone?: IconTone;
};

export function AppIcon({ name, size, sizeVariant = 'md', style, styleVariant = 'line', tone }: AppIconProps) {
  const colors = useThemeColors();
  const resolvedName = resolveIconName(name);
  const icon = iconRegistry[resolvedName];
  const resolvedColor = resolveIconTone(colors, tone ?? getDefaultIconTone(resolvedName, icon.defaultTone));
  const resolvedCanvasSize = size ?? sizeTokens.icon[sizeVariant] ?? sizeTokens.icon.md;
  const resolvedGlyphSize = resolveGlyphSize(icon, resolvedCanvasSize, sizeVariant);
  const fill = styleVariant === 'fill' ? resolvedColor : undefined;
  const componentKey = `${icon.sourceLibrary}:${icon.sourceIconName}` as keyof typeof localIconComponents;
  const Icon = localIconComponents[componentKey];

  if (!Icon) {
    return null;
  }

  return (
    <View
      style={StyleSheet.flatten([
        styles.canvas,
        {
          height: resolvedCanvasSize,
          width: resolvedCanvasSize,
        },
        style,
      ])}>
      <Icon color={resolvedColor} fill={fill} size={resolvedGlyphSize} strokeWidth={lineWidth.icon.default} styleVariant={styleVariant} />
    </View>
  );
}

export type { AppIconName, IconTone, LegacyAppIconName };

function getDefaultIconTone(name: AppIconName, registeredTone?: IconTone): IconTone {
  if (name === 'icon.system.chevron_right' || name === 'icon.system.chevron_down') {
    return registeredTone ?? 'textDim';
  }

  return 'primary';
}

function resolveGlyphSize(icon: (typeof iconRegistry)[AppIconName], canvasSize: number, sizeVariant: AppIconSizeVariant) {
  if (icon.category === 'brand') {
    return canvasSize;
  }

  const tokenGlyphSize = sizeTokens.iconGlyph[sizeVariant] ?? sizeTokens.iconGlyph.md;
  if (canvasSize === (sizeTokens.icon[sizeVariant] ?? sizeTokens.icon.md)) {
    return tokenGlyphSize;
  }

  const defaultCanvasSize = icon.defaultCanvasSize ?? sizeTokens.icon.md;
  const defaultGlyphSize = icon.defaultGlyphSize ?? sizeTokens.iconGlyph.md;
  return canvasSize * (defaultGlyphSize / defaultCanvasSize);
}

const styles = StyleSheet.create({
  canvas: {
    alignItems: 'center',
    flexShrink: 0,
    justifyContent: 'center',
  },
});
