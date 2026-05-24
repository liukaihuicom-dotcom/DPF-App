import Svg, { Path } from 'react-native-svg';

import type { LocalIconProps } from './types';

type RemixIconBaseProps = LocalIconProps & {
  paths: string[];
};

export function RemixIconBase({ color = 'currentColor', height, paths, size = 24, style, width }: RemixIconBaseProps) {
  const resolvedWidth = width ?? size;
  const resolvedHeight = height ?? size;

  return (
    <Svg fill={color} height={resolvedHeight} style={style} viewBox="0 0 24 24" width={resolvedWidth}>
      {paths.map((d) => <Path d={d} key={d} />)}
    </Svg>
  );
}
