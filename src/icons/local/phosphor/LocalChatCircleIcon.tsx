/* Vendored from phosphor-react-native ChatCircle; source license: MIT. */
import { PhosphorIconBase } from '../PhosphorIconBase';
import type { LocalIconProps } from '../types';

const paths = [
  "M128 24a104 104 0 0 0-91.82 152.88l-11.35 34.05a16 16 0 0 0 20.24 20.24l34.05-11.35A104 104 0 1 0 128 24m0 192a87.87 87.87 0 0 1-44.06-11.81 8 8 0 0 0-6.54-.67L40 216l12.47-37.4a8 8 0 0 0-.66-6.54A88 88 0 1 1 128 216"
] as const;

export function LocalChatCircleIcon(props: LocalIconProps) {
  return <PhosphorIconBase paths={[...paths]} {...props} />;
}
