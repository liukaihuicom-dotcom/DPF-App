import { memo, useId, useMemo, useState } from 'react';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

import { useThemeColors } from '@/src/settings/ProductSettings';

type SparklineProps = {
  values: number[];
  width?: number | `${number}%`;
  height?: number;
  color?: string;
  edgeToEdge?: boolean;
};

const fallbackResponsiveWidth = 180;

function SparklineComponent({ values, width = 92, height = 34, color, edgeToEdge = false }: SparklineProps) {
  const colors = useThemeColors();
  const gradientIdSource = useId();
  const gradientId = useMemo(() => `sparkline-fill-${gradientIdSource.replace(/[^a-zA-Z0-9_-]/g, '')}`, [gradientIdSource]);
  const strokeColor = color ?? colors.market.up.fg;
  const [measuredWidth, setMeasuredWidth] = useState(typeof width === 'number' ? width : 0);
  const chartWidth = typeof width === 'number' ? width : measuredWidth || fallbackResponsiveWidth;
  const chart = useMemo(() => {
    if (!values.length || chartWidth <= 0) {
      return { areaPath: '', linePath: '' };
    }

    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    const verticalPadding = 2;
    const chartHeight = Math.max(height - verticalPadding * 2, 1);
    const coordinates = values.map((value, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * chartWidth;
      const y = verticalPadding + chartHeight - ((value - min) / range) * chartHeight;

      return { x, y };
    });

    if (coordinates.length === 1) {
      const y = coordinates[0].y;
      return {
        areaPath: `M 0 ${height} L 0 ${y} L ${chartWidth} ${y} L ${chartWidth} ${height} Z`,
        linePath: `M 0 ${y} L ${chartWidth} ${y}`,
      };
    }

    const linePath = buildSoftLinePath(coordinates);
    const first = coordinates[0];
    const last = coordinates[coordinates.length - 1];
    const areaPath = `M ${first.x} ${height} ${linePath.replace('M', 'L')} L ${last.x} ${height} Z`;

    return { areaPath, linePath };
  }, [chartWidth, height, values]);

  return (
    <Svg
      height={height}
      onLayout={typeof width === 'number' ? undefined : (event) => setMeasuredWidth(event.nativeEvent.layout.width)}
      preserveAspectRatio={edgeToEdge ? 'none' : undefined}
      viewBox={`0 0 ${chartWidth} ${height}`}
      width={width}>
      <Defs>
        <LinearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
          <Stop offset="0" stopColor={strokeColor} stopOpacity={0.12} />
          <Stop offset="1" stopColor={strokeColor} stopOpacity={0.01} />
        </LinearGradient>
      </Defs>
      <Path d={chart.areaPath} fill={`url(#${gradientId})`} />
      <Path d={chart.linePath} fill="none" stroke={strokeColor} strokeLinecap="round" strokeLinejoin="round" strokeOpacity={0.86} strokeWidth={1.45} />
    </Svg>
  );
}

function buildSoftLinePath(points: { x: number; y: number }[]) {
  return points.reduce((path, point, index) => {
    if (index === 0) {
      return `M ${point.x} ${point.y}`;
    }

    const previous = points[index - 1];
    const controlX = (previous.x + point.x) / 2;
    const controlY = previous.y;

    return `${path} Q ${controlX} ${controlY} ${point.x} ${point.y}`;
  }, '');
}

export const Sparkline = memo(SparklineComponent);
