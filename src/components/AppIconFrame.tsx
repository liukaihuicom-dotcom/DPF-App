import { StyleProp, StyleSheet, View, ViewProps, ViewStyle } from 'react-native';

import { useThemeColors } from '@/src/settings/ProductSettings';
import { radius, size as sizeTokens } from '@/src/theme/tokens';

import {
  AppIcon,
  type AppIconName,
  type AppIconSizeVariant,
  type AppIconStyleVariant,
  type IconTone,
  type LegacyAppIconName,
} from './AppIcon';

export type AppIconFrameBackgroundTone =
  | 'neutral'
  | 'brand'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger'
  | 'up'
  | 'down'
  | 'disabled'
  | 'inverse'
  | 'none';

export type AppIconFrameSizeVariant = keyof typeof sizeTokens.iconFrame;
export type AppIconFrameShape = 'circle' | 'rounded';

type AppIconFrameProps = Omit<ViewProps, 'children' | 'style'> & {
  accessibilityLabel?: string;
  backgroundTone?: AppIconFrameBackgroundTone;
  iconSize?: number;
  iconSizeVariant?: AppIconSizeVariant;
  iconStyleVariant?: AppIconStyleVariant;
  name: AppIconName | LegacyAppIconName;
  shape?: AppIconFrameShape;
  size?: number;
  sizeVariant?: AppIconFrameSizeVariant;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  tone?: IconTone;
};

export function AppIconFrame({
  accessibilityLabel,
  backgroundTone,
  iconSize,
  iconSizeVariant,
  iconStyleVariant = 'line',
  name,
  shape = 'circle',
  size,
  sizeVariant = 'md',
  style,
  testID,
  tone,
  ...viewProps
}: AppIconFrameProps) {
  const colors = useThemeColors();
  const frameSize = size ?? sizeTokens.iconFrame[sizeVariant] ?? sizeTokens.iconFrame.md;
  const resolvedIconSize = iconSize ?? (iconSizeVariant ? undefined : sizeTokens.iconFrameGlyph[sizeVariant]);
  const resolvedIconSizeVariant = iconSizeVariant ?? resolveIconSizeVariant(sizeVariant);
  const resolvedBackgroundTone = backgroundTone ?? resolveBackgroundToneByIconTone(tone);
  const iconTone = tone ?? resolveIconToneByBackgroundTone(resolvedBackgroundTone);
  const backgroundColor = resolveBackgroundTone(colors, resolvedBackgroundTone);

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityLabel ? 'image' : undefined}
      accessible={Boolean(accessibilityLabel)}
      {...viewProps}
      style={StyleSheet.flatten([
        styles.frame,
        {
          borderRadius: shape === 'circle' ? radius.full : radius.sm,
          height: frameSize,
          width: frameSize,
        },
        backgroundColor ? { backgroundColor } : null,
        style,
      ])}
      testID={testID}>
      <AppIcon name={name} size={resolvedIconSize} sizeVariant={resolvedIconSizeVariant} styleVariant={iconStyleVariant} tone={iconTone} />
    </View>
  );
}

function resolveIconSizeVariant(sizeVariant: AppIconFrameSizeVariant): AppIconSizeVariant {
  switch (sizeVariant) {
    case 'mini':
      return 'mini';
    case 'xs':
      return 'xs';
    case 'sm':
      return 'sm';
    case 'lg':
      return 'md';
    case 'xl':
      return 'lg';
    case 'display':
      return 'xl';
    case 'md':
    default:
      return 'md';
  }
}

function resolveBackgroundTone(colors: ReturnType<typeof useThemeColors>, tone: AppIconFrameBackgroundTone) {
  switch (tone) {
    case 'brand':
      return colors.iconBg.active;
    case 'danger':
      return colors.iconBg.danger;
    case 'disabled':
      return colors.iconBg.subtle;
    case 'down':
      return colors.iconBg.marketDown;
    case 'info':
      return colors.iconBg.info;
    case 'inverse':
      return colors.iconBg.inverse;
    case 'none':
      return undefined;
    case 'success':
      return colors.iconBg.success;
    case 'up':
      return colors.iconBg.marketUp;
    case 'warning':
      return colors.iconBg.warning;
    case 'neutral':
    default:
      return colors.iconBg.neutral;
  }
}

function resolveIconToneByBackgroundTone(tone: AppIconFrameBackgroundTone): IconTone {
  switch (tone) {
    case 'brand':
      return 'brand';
    case 'danger':
      return 'danger';
    case 'disabled':
      return 'disabled';
    case 'down':
      return 'down';
    case 'info':
      return 'info';
    case 'inverse':
      return 'inverse';
    case 'success':
      return 'success';
    case 'up':
      return 'up';
    case 'warning':
      return 'warning';
    case 'neutral':
    case 'none':
    default:
      return 'textDim';
  }
}

function resolveBackgroundToneByIconTone(tone?: IconTone): AppIconFrameBackgroundTone {
  switch (tone) {
    case 'amber':
    case 'warning':
      return 'warning';
    case 'blue':
    case 'info':
      return 'info';
    case 'brand':
      return 'brand';
    case 'danger':
      return 'danger';
    case 'disabled':
      return 'disabled';
    case 'down':
      return 'down';
    case 'success':
      return 'success';
    case 'up':
      return 'up';
    case 'inverse':
    case 'panel':
    case 'white':
      return 'inverse';
    case 'primary':
    case 'secondary':
    case 'tertiary':
    case 'text':
    case 'textDim':
    case 'textMuted':
    case undefined:
    default:
      return 'neutral';
  }
}

const styles = StyleSheet.create({
  frame: {
    alignItems: 'center',
    flexShrink: 0,
    justifyContent: 'center',
  },
});

export type { AppIconFrameProps };
