/* Vendored from phosphor-react-native ListBullets; source license: MIT. */
import { PhosphorIconBase } from '../PhosphorIconBase';
import type { LocalIconProps } from '../types';

const paths = [
  "M80 64a8 8 0 0 1 8-8h128a8 8 0 0 1 0 16H88a8 8 0 0 1-8-8m136 56H88a8 8 0 0 0 0 16h128a8 8 0 0 0 0-16m0 64H88a8 8 0 0 0 0 16h128a8 8 0 0 0 0-16M44 52a12 12 0 1 0 12 12 12 12 0 0 0-12-12m0 64a12 12 0 1 0 12 12 12 12 0 0 0-12-12m0 64a12 12 0 1 0 12 12 12 12 0 0 0-12-12"
] as const;

export function LocalListBulletsIcon(props: LocalIconProps) {
  return <PhosphorIconBase paths={[...paths]} {...props} />;
}
