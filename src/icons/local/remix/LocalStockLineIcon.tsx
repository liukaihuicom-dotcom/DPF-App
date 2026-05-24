/* Vendored from Remix Icon stock-line; source license: Remix Icon License v1.0. */
import { RemixIconBase } from '../RemixIconBase';
import type { LocalIconProps } from '../types';

const paths = [
  "M8.005 5.003h3v9h-3v3h-2v-3h-3v-9h3v-3h2zm-3 2v5h4v-5zm13 3h3v9h-3v3h-2v-3h-3v-9h3v-3h2zm-3 2v5h4v-5z"
] as const;

export function LocalStockLineIcon(props: LocalIconProps) {
  return <RemixIconBase paths={[...paths]} {...props} />;
}
