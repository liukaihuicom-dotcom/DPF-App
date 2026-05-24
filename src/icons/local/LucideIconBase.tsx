import Svg, { Circle, Ellipse, G, Line, Path, Polygon, Polyline, Rect } from 'react-native-svg';

import type { LocalIconProps } from './types';

type LucideNode = [
  'circle' | 'ellipse' | 'g' | 'line' | 'path' | 'polygon' | 'polyline' | 'rect',
  Record<string, string>,
];
type ReadonlyLucideNode = readonly [
  LucideNode[0],
  Readonly<Record<string, string>>,
];

type LucideIconBaseProps = LocalIconProps & {
  iconNode: readonly ReadonlyLucideNode[];
};

const nodeMap = {
  circle: Circle,
  ellipse: Ellipse,
  g: G,
  line: Line,
  path: Path,
  polygon: Polygon,
  polyline: Polyline,
  rect: Rect,
} as const;

export function LucideIconBase({ color = 'currentColor', height, iconNode, size = 24, strokeWidth = 2, style, width }: LucideIconBaseProps) {
  const resolvedWidth = width ?? size;
  const resolvedHeight = height ?? size;

  return (
    <Svg
      fill="none"
      height={resolvedHeight}
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      style={style}
      viewBox="0 0 24 24"
      width={resolvedWidth}>
      {iconNode.map(([tag, attrs], index) => {
        const Node = nodeMap[tag];
        const fallbackKey = tag + '-' + index;
        return <Node {...attrs} key={attrs.key ?? fallbackKey} />;
      })}
    </Svg>
  );
}
