import Svg, { Polyline } from 'react-native-svg';

import { useThemePalette } from '@/src/settings/ProductSettings';

type SparklineProps = {
  values: number[];
  width?: number;
  height?: number;
  color?: string;
};

export function Sparkline({ values, width = 92, height = 34, color }: SparklineProps) {
  const palette = useThemePalette();
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const points = values
    .map((value, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <Svg height={height} width={width}>
      <Polyline fill="none" points={points} stroke={color ?? palette.up} strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
    </Svg>
  );
}
