/* Vendored from phosphor-react-native Info; source license: MIT. */
import { PhosphorIconBase } from '../PhosphorIconBase';
import type { LocalIconProps } from '../types';

const paths = [
  "M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24m0 192a88 88 0 1 1 88-88 88.1 88.1 0 0 1-88 88m16-40a8 8 0 0 1-8 8 16 16 0 0 1-16-16v-40a8 8 0 0 1 0-16 16 16 0 0 1 16 16v40a8 8 0 0 1 8 8m-32-92a12 12 0 1 1 12 12 12 12 0 0 1-12-12"
] as const;

export function LocalInfoIcon(props: LocalIconProps) {
  return <PhosphorIconBase paths={[...paths]} {...props} />;
}
