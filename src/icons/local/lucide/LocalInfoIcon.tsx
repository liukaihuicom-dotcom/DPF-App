/* Vendored from lucide-react-native Info; source license: ISC. */
import { LucideIconBase } from '../LucideIconBase';
import type { LocalIconProps } from '../types';

const iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 16v-4", key: "1dtifu" }],
  ["path", { d: "M12 8h.01", key: "e9boi3" }]
] as const;

export function LocalInfoIcon(props: LocalIconProps) {
  return <LucideIconBase iconNode={iconNode} {...props} />;
}
