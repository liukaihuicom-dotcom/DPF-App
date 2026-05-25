import { Image, ImageSourcePropType, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { SvgUri } from 'react-native-svg';

import { flagAssetRegistry, type FlagCode, type FlagShape } from '@/src/assets/flags';
import { useThemeColors } from '@/src/settings/ProductSettings';

type FlagIconProps = {
  accessibilityLabel?: string;
  code: string;
  shape?: FlagShape;
  size?: number;
  style?: StyleProp<ViewStyle>;
};

export function FlagIcon({ accessibilityLabel, code, shape = 'circle', size = 18, style }: FlagIconProps) {
  const colors = useThemeColors();
  const normalizedCode = normalizeFlagCode(code);
  const flag = normalizedCode ? flagAssetRegistry[normalizedCode] : undefined;
  const aspect = shape === 'rectangle' ? '4x3' : '1x1';
  const width = shape === 'rectangle' ? Math.round(size * 4 / 3) : size;
  const uri = flag ? resolveFlagAssetUri(flag.aspect[aspect]) : undefined;

  return (
    <View
      accessibilityLabel={accessibilityLabel ?? `${normalizedCode?.toUpperCase() ?? code.toUpperCase()} flag`}
      style={StyleSheet.flatten([
        styles.frame,
        {
          backgroundColor: colors.surface.subtle,
          borderRadius: shape === 'circle' ? size / 2 : Math.max(2, Math.round(size * 0.12)),
          height: size,
          width,
        },
        style,
      ])}>
      {uri ? (
        <SvgUri height="100%" uri={uri} width="100%" />
      ) : (
        <View style={StyleSheet.flatten([styles.fallback, { backgroundColor: colors.surface.subtle }])} />
      )}
    </View>
  );
}

function resolveFlagAssetUri(source: ImageSourcePropType): string | undefined {
  if (typeof source === 'string') {
    return source;
  }

  if (source && typeof source === 'object') {
    if ('uri' in source && typeof source.uri === 'string') {
      return source.uri;
    }

    if ('default' in source) {
      const nested = source.default as ImageSourcePropType;
      if (nested !== source) {
        return resolveFlagAssetUri(nested);
      }
    }
  }

  const resolveAssetSource = typeof Image.resolveAssetSource === 'function' ? Image.resolveAssetSource : undefined;
  return resolveAssetSource?.(source)?.uri;
}

export function isFlagCode(code: string): code is FlagCode {
  return Boolean(normalizeFlagCode(code));
}

function normalizeFlagCode(code: string): FlagCode | undefined {
  const normalized = code.trim().toLowerCase();
  return normalized in flagAssetRegistry ? (normalized as FlagCode) : undefined;
}

const styles = StyleSheet.create({
  fallback: {
    height: '100%',
    width: '100%',
  },
  frame: {
    overflow: 'hidden',
  },
});
