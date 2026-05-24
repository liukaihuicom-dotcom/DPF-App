/* Vendored from phosphor-react-native TrendDown; source license: MIT. */
import { PhosphorIconBase } from '../PhosphorIconBase';
import type { LocalIconProps } from '../types';

const paths = [
  "M240 128v64a8 8 0 0 1-8 8h-64a8 8 0 0 1 0-16h44.69L136 107.31l-34.34 34.35a8 8 0 0 1-11.32 0l-72-72a8 8 0 0 1 11.32-11.32L96 124.69l34.34-34.35a8 8 0 0 1 11.32 0L224 172.69V128a8 8 0 0 1 16 0"
] as const;

export function LocalTrendDownIcon(props: LocalIconProps) {
  return <PhosphorIconBase paths={[...paths]} {...props} />;
}
