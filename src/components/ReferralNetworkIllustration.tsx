import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, Ellipse, G, Line, Path, Rect, Text as SvgText } from 'react-native-svg';

import { useProductSettings } from '@/src/settings/ProductSettings';

type ReferralNetworkIllustrationProps = {
  style?: StyleProp<ViewStyle>;
};

export function ReferralNetworkIllustration({ style }: ReferralNetworkIllustrationProps) {
  const { colors, resolvedThemeMode } = useProductSettings();
  const isDark = resolvedThemeMode !== 'lightBroker';
  const lineColor = isDark ? colors.accent.cyan.fg : colors.accent.cyan.border;
  const primary = colors.brand.fg;
  const primaryDeep = isDark ? colors.accent.cyan.fg : colors.accent.cyan.solid;
  const portraitFill = isDark ? colors.overlay.info.muted : colors.overlay.info.subtle;
  const portraitAltFill = isDark ? colors.overlay.success.muted : colors.overlay.success.subtle;
  const whiteNode = isDark ? colors.surface.raised : colors.surface.panel;
  const skinLight = isDark ? '#F6B28E' : '#FFB28D';
  const skinMedium = isDark ? '#9B6548' : '#8F5F45';
  const hair = isDark ? '#062A36' : '#083744';
  const shirt = isDark ? '#1FB7BE' : '#22BCC4';
  const shirtSoft = isDark ? '#7EDBE0' : '#A9EDF0';

  return (
    <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={StyleSheet.flatten([styles.root, style])}>
      <Svg height="100%" viewBox="0 0 220 168" width="100%">
        <Line stroke={lineColor} strokeDasharray="7 8" strokeLinecap="round" strokeWidth={4} x1={107} x2={66} y1={86} y2={118} />
        <Line stroke={lineColor} strokeDasharray="7 8" strokeLinecap="round" strokeWidth={4} x1={124} x2={164} y1={86} y2={119} />
        <Line stroke={lineColor} strokeDasharray="7 8" strokeLinecap="round" strokeWidth={4} x1={86} x2={142} y1={129} y2={129} />
        <Line stroke={lineColor} strokeDasharray="7 8" strokeLinecap="round" strokeWidth={4} x1={116} x2={116} y1={72} y2={92} />

        <RewardCoin cx={48} cy={48} fill={primary} surface={whiteNode} />
        <RewardCoin cx={188} cy={45} fill={primary} surface={whiteNode} />
        <RewardCoin cx={132} cy={142} fill={primary} surface={whiteNode} />
        <GiftMark color={primaryDeep} x={34} y={139} />
        <GiftMark color={primaryDeep} x={185} y={136} />
        <SparkMark color={primaryDeep} x={62} y={76} />
        <SparkMark color={primaryDeep} x={122} y={154} />

        <G>
          <Circle cx={118} cy={46} fill={portraitFill} r={48} />
          <Path d="M85 85 C95 64 139 62 151 85 L151 97 L85 97 Z" fill={shirt} />
          <Ellipse cx={116} cy={43} fill={skinLight} rx={13} ry={18} />
          <Path d="M96 38 C97 23 112 20 124 25 C138 30 136 43 128 49 C123 39 110 42 102 35 C101 43 99 48 94 52 C91 48 91 43 96 38 Z" fill={hair} />
          <Path d="M101 50 C107 66 126 66 132 50 C130 70 121 77 112 76 C104 75 99 66 101 50 Z" fill={hair} opacity={0.9} />
          <Path d="M101 72 L107 66 L116 72 L126 66 L133 72 L128 92 L106 92 Z" fill={isDark ? '#178E99' : '#188F98'} opacity={0.9} />
        </G>

        <G>
          <Circle cx={65} cy={119} fill={portraitAltFill} r={40} />
          <Path d="M33 154 C43 131 82 131 96 154 Z" fill={shirtSoft} />
          <Ellipse cx={63} cy={113} fill={skinMedium} rx={13} ry={17} />
          <Path d="M45 108 C48 92 69 89 80 101 C72 99 66 105 59 101 C56 108 49 111 45 108 Z" fill={hair} />
          <Path d="M50 113 C44 118 45 127 52 133 C51 124 53 119 57 116 Z" fill={hair} opacity={0.86} />
          <Path d="M74 112 C82 118 82 128 75 134 C76 125 75 119 70 116 Z" fill={hair} opacity={0.86} />
        </G>

        <G>
          <Circle cx={166} cy={119} fill={portraitFill} r={40} />
          <Path d="M132 154 C143 132 184 131 198 154 Z" fill={shirt} />
          <Ellipse cx={164} cy={112} fill={skinLight} rx={13} ry={17} />
          <Circle cx={151} cy={101} fill={hair} r={8} />
          <Circle cx={177} cy={99} fill={hair} r={10} />
          <Path d="M151 105 C157 92 174 93 181 106 C173 104 163 105 154 111 Z" fill={hair} />
        </G>

        <G>
          <Circle cx={116} cy={96} fill={whiteNode} opacity={isDark ? 0.94 : 1} r={25} />
          <Circle cx={106} cy={99} fill={primary} r={6} />
          <Circle cx={116} cy={91} fill={primary} r={8} />
          <Circle cx={128} cy={100} fill={primary} r={6} />
          <Path d="M96 113 C98 103 113 103 116 113 Z M116 113 C119 103 134 103 136 113 Z" fill={primary} />
        </G>
      </Svg>
    </View>
  );
}

function RewardCoin({ cx, cy, fill, surface }: { cx: number; cy: number; fill: string; surface: string }) {
  return (
    <G>
      <Circle cx={cx} cy={cy} fill={fill} opacity={0.18} r={20} />
      <Circle cx={cx} cy={cy} fill={fill} opacity={0.9} r={13} />
      <SvgText fill={surface} fontSize={19} fontWeight="700" textAnchor="middle" x={cx} y={cy + 7}>
        $
      </SvgText>
    </G>
  );
}

function GiftMark({ color, x, y }: { color: string; x: number; y: number }) {
  return (
    <G opacity={0.78}>
      <Rect fill={color} height={18} rx={3} width={22} x={x} y={y} />
      <Rect fill={color} height={5} rx={2.5} width={28} x={x - 3} y={y - 5} />
      <Rect fill="rgba(255,255,255,0.55)" height={18} width={4} x={x + 9} y={y} />
      <Circle cx={x + 8} cy={y - 8} fill="none" r={5} stroke={color} strokeWidth={3} />
      <Circle cx={x + 16} cy={y - 8} fill="none" r={5} stroke={color} strokeWidth={3} />
    </G>
  );
}

function SparkMark({ color, x, y }: { color: string; x: number; y: number }) {
  return (
    <Path
      d={`M${x} ${y - 9} C${x + 2} ${y - 3} ${x + 5} ${y} ${x + 11} ${y + 2} C${x + 5} ${y + 4} ${x + 2} ${y + 7} ${x} ${y + 13} C${x - 2} ${y + 7} ${x - 5} ${y + 4} ${x - 11} ${y + 2} C${x - 5} ${y} ${x - 2} ${y - 3} ${x} ${y - 9} Z`}
      fill={color}
      opacity={0.58}
    />
  );
}

const styles = StyleSheet.create({
  root: {
    flexShrink: 0,
    height: 160,
    width: 206,
  },
});
