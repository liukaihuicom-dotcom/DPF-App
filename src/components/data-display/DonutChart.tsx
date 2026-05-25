import { StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { useThemeColors } from '@/src/settings/ProductSettings';

import { AppText } from '../Typography';

export type DonutChartSegment = {
  color: string;
  value: number;
};

type DonutChartProps = {
  label: string;
  segments: DonutChartSegment[];
  value: string;
};

const chartSize = 118;
const center = chartSize / 2;
const radius = 44;
const strokeWidth = 14;

export function DonutChart({ label, segments, value }: DonutChartProps) {
  const colors = useThemeColors();
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);

  return (
    <View style={styles.wrap}>
      <Svg height={chartSize} viewBox={`0 0 ${chartSize} ${chartSize}`} width={chartSize}>
        <Circle cx={center} cy={center} fill="none" r={radius} stroke={colors.surface.subtle} strokeWidth={strokeWidth} />
        {segments.map((segment, index) => (
          <DonutSegment index={index} key={`${segment.color}-${index}`} segment={segment} segments={segments} total={total} />
        ))}
      </Svg>
      <View style={styles.center}>
        <AppText adjustsFontSizeToFit numberOfLines={1} variant="subtitle">
          {value}
        </AppText>
        <AppText tone="muted" variant="caption">
          {label}
        </AppText>
      </View>
    </View>
  );
}

function DonutSegment({
  index,
  segment,
  segments,
  total,
}: {
  index: number;
  segment: DonutChartSegment;
  segments: DonutChartSegment[];
  total: number;
}) {
  const circumference = 2 * Math.PI * radius;
  const segmentLength = total > 0 ? (segment.value / total) * circumference : 0;
  const previousLength = segments.slice(0, index).reduce((sum, current) => sum + (total > 0 ? (current.value / total) * circumference : 0), 0);

  return (
    <Circle
      cx={center}
      cy={center}
      fill="none"
      origin={`${center}, ${center}`}
      r={radius}
      rotation={-90}
      stroke={segment.color}
      strokeDasharray={`${Math.max(segmentLength - 2, 0)} ${circumference}`}
      strokeDashoffset={-previousLength}
      strokeLinecap="round"
      strokeWidth={strokeWidth}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  wrap: {
    alignItems: 'center',
    height: chartSize,
    justifyContent: 'center',
    width: chartSize,
  },
});
