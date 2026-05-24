/* Vendored from lucide-react-native Ellipsis; source license: ISC. */
import { LucideIconBase } from '../LucideIconBase';
import type { LocalIconProps } from '../types';

const iconNode = [
  ["circle", { cx: "12", cy: "12", r: "1", key: "41hilf" }],
  ["circle", { cx: "19", cy: "12", r: "1", key: "1wjl8i" }],
  ["circle", { cx: "5", cy: "12", r: "1", key: "1pcz8c" }]
] as const;

export function LocalEllipsisIcon(props: LocalIconProps) {
  return <LucideIconBase iconNode={iconNode} {...props} />;
}
