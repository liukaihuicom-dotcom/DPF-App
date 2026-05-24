import Svg, { G, Path } from 'react-native-svg';

import type { LocalIconProps } from './types';

type PhosphorIconBaseProps = LocalIconProps & {
  paths: string[];
};

export function PhosphorIconBase({ color = 'currentColor', fill, height, paths, size = 24, style, width }: PhosphorIconBaseProps) {
  const resolvedWidth = width ?? size;
  const resolvedHeight = height ?? size;
  const resolvedFill = fill ?? color;

  return (
    <Svg color={color} fill="currentColor" height={resolvedHeight} style={style} viewBox="0 0 256 256" width={resolvedWidth}>
      <G fill={resolvedFill}>{paths.map((d) => <Path d={d} key={d} />)}</G>
    </Svg>
  );
}
