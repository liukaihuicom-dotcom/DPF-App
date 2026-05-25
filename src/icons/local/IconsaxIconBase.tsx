import type { ComponentType } from 'react';
import Svg, { Circle, Defs, Ellipse, G, Line, LinearGradient, Path, Polygon, Polyline, Rect, Stop } from 'react-native-svg';

import type { LocalIconProps } from './types';

type IconsaxTag = 'circle' | 'defs' | 'ellipse' | 'g' | 'linearGradient' | 'line' | 'path' | 'polygon' | 'polyline' | 'rect' | 'stop';
type IconsaxAttrs = Readonly<Record<string, string | number>>;

export type IconsaxNode = readonly [IconsaxTag, IconsaxAttrs] | readonly [IconsaxTag, IconsaxAttrs, readonly IconsaxNode[]];

type IconsaxIconBaseProps = LocalIconProps & {
  boldNodes: readonly IconsaxNode[];
  linearNodes: readonly IconsaxNode[];
};

const nodeMap: Record<IconsaxTag, ComponentType<Record<string, unknown>>> = {
  circle: Circle,
  defs: Defs,
  ellipse: Ellipse,
  g: G,
  linearGradient: LinearGradient,
  line: Line,
  path: Path,
  polygon: Polygon,
  polyline: Polyline,
  rect: Rect,
  stop: Stop,
} as const;

export function IconsaxIconBase({ boldNodes, color = 'currentColor', height, linearNodes, size = 24, style, styleVariant = 'line', width }: IconsaxIconBaseProps) {
  const resolvedWidth = width ?? size;
  const resolvedHeight = height ?? size;
  const nodes = styleVariant === 'fill' ? boldNodes : linearNodes;

  return (
    <Svg fill="none" height={resolvedHeight} style={style} viewBox="0 0 24 24" width={resolvedWidth}>
      {nodes.map((node, index) => renderIconsaxNode(node, color, `iconsax-${index}`))}
    </Svg>
  );
}

function renderIconsaxNode([tag, attrs, children]: IconsaxNode, color: string, key: string): React.JSX.Element {
  const Node = nodeMap[tag];
  const resolvedAttrs = resolvePaintAttrs(attrs, color);

  return (
    <Node {...resolvedAttrs} key={String(attrs.id ?? attrs.key ?? key)}>
      {children?.map((child, index) => renderIconsaxNode(child, color, `${key}-${index}`))}
    </Node>
  );
}

function resolvePaintAttrs(attrs: Readonly<Record<string, string | number>>, color: string) {
  const resolved: Record<string, string | number> = {};

  for (const [rawKey, value] of Object.entries(attrs)) {
    const key = toReactNativeSvgAttr(rawKey);
    if ((key === 'stroke' || key === 'fill' || key === 'stopColor') && isSourcePaint(value)) {
      resolved[key] = color;
    } else {
      resolved[key] = value;
    }
  }

  return resolved;
}

function isSourcePaint(value: string | number) {
  return typeof value === 'string' && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value);
}

function toReactNativeSvgAttr(key: string) {
  switch (key) {
    case 'clip-rule':
      return 'clipRule';
    case 'fill-rule':
      return 'fillRule';
    case 'stop-color':
      return 'stopColor';
    case 'stop-opacity':
      return 'stopOpacity';
    case 'stroke-dasharray':
      return 'strokeDasharray';
    case 'stroke-linecap':
      return 'strokeLinecap';
    case 'stroke-linejoin':
      return 'strokeLinejoin';
    case 'stroke-miterlimit':
      return 'strokeMiterlimit';
    case 'stroke-opacity':
      return 'strokeOpacity';
    case 'stroke-width':
      return 'strokeWidth';
    default:
      return key;
  }
}
