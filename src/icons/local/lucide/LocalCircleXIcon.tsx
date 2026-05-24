/* Vendored from lucide-react-native CircleX; source license: ISC. */
import { LucideIconBase } from '../LucideIconBase';
import type { LocalIconProps } from '../types';

const iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
  ["path", { d: "m9 9 6 6", key: "z0biqf" }]
] as const;

export function LocalCircleXIcon(props: LocalIconProps) {
  return <LucideIconBase iconNode={iconNode} {...props} />;
}
