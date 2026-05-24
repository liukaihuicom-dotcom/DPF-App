/* Vendored from lucide-react-native Trash2; source license: ISC. */
import { LucideIconBase } from '../LucideIconBase';
import type { LocalIconProps } from '../types';

const iconNode = [
  ["path", { d: "M10 11v6", key: "nco0om" }],
  ["path", { d: "M14 11v6", key: "outv1u" }],
  ["path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6", key: "miytrc" }],
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2", key: "e791ji" }]
] as const;

export function LocalTrash2Icon(props: LocalIconProps) {
  return <LucideIconBase iconNode={iconNode} {...props} />;
}
