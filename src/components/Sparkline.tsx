import { memo, useId, useMemo } from 'react';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

import { useThemePalette } from '@/src/settings/ProductSettings';

type SparklineProps = {
  values: number[];
  width?: number;
  height?: number;
  color?: string;
};

function SparklineComponent({ values, width = 92, height = 34, color }: SparklineProps) {
  const palette = useThemePalette();
  const gradientIdSource = useId();
  const gradientId = useMemo(() => `sparkline-fill-${gradientIdSource.replace(/[^a-zA-Z0-9_-]/g, '')}`, [gradientIdSource]);
  const strokeColor = color ?? palette.up;
  const chart = useMemo(() => {
    if (!values.length) {
      return { areaPath: '', linePath: '' };
    }

    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    const verticalPadding = 2;
    const chartHeight = Math.max(height - verticalPadding * 2, 1);
    const coordinates = values.map((value, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * width;
      const y = verticalPadding + chartHeight - ((value - min) / range) * chartHeight;

      return { x, y };
    });

    if (coordinates.length === 1) {
      const y = coordinates[0].y;
      return {
        areaPath: `M 0 ${height} L 0 ${y} L ${width} ${y} L ${width} ${height} Z`,
        linePath: `M 0 ${y} L ${width} ${y}`,
      };
    }

    const linePath = coordinates.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
    const first = coordinates[0];
    const last = coordinates[coordinates.length - 1];
    const areaPath = `M ${first.x} ${height} ${linePath.replace('M', 'L')} L ${last.x} ${height} Z`;

    return { areaPath, linePath };
  }, [height, values, width]);

  return (
    <Svg height={height} width={width}>
      <Defs>
        <LinearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
          <Stop offset="0" stopColor={strokeColor} stopOpacity={0.24} />
          <Stop offset="1" stopColor={strokeColor} stopOpacity={0.02} />
        </LinearGradient>
      </Defs>
      <Path d={chart.areaPath} fill={`url(#${gradientId})`} />
      <Path d={chart.linePath} fill="none" stroke={strokeColor} strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} />
    </Svg>
  );
}

export const Sparkline = memo(SparklineComponent);
