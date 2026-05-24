/* Vendored from phosphor-react-native Wallet; source license: MIT. */
import { PhosphorIconBase } from '../PhosphorIconBase';
import type { LocalIconProps } from '../types';

const paths = [
  "M216 64H56a8 8 0 0 1 0-16h136a8 8 0 0 0 0-16H56a24 24 0 0 0-24 24v128a24 24 0 0 0 24 24h160a16 16 0 0 0 16-16V80a16 16 0 0 0-16-16m0 128H56a8 8 0 0 1-8-8V78.63A23.8 23.8 0 0 0 56 80h160Zm-48-60a12 12 0 1 1 12 12 12 12 0 0 1-12-12"
] as const;

export function LocalWalletIcon(props: LocalIconProps) {
  return <PhosphorIconBase paths={[...paths]} {...props} />;
}
