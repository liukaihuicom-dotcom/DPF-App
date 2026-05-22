import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  AppleIcon,
  ArrowDown01Icon,
  ArrowLeft02Icon,
  ArrowReloadHorizontalIcon,
  ArrowRight01Icon,
  ArrowRight02Icon,
  Award01Icon,
  Cancel01Icon,
  ChartCandlestickIcon,
  CheckListIcon,
  CheckmarkCircle02Icon,
  CompassIcon,
  Exchange03Icon,
  FilterHorizontalIcon,
  GiftIcon,
  GlobeIcon,
  HeadsetIcon,
  InformationCircleIcon,
  ListViewIcon,
  MailOpenIcon,
  Message01Icon,
  MoreHorizontalIcon,
  Notification02Icon,
  QrCodeIcon,
  School01Icon,
  Search01Icon,
  SecurityCheckIcon,
  SecurityLockIcon,
  Share08Icon,
  Tick02Icon,
  TicketStarIcon,
  TransactionHistoryIcon,
  UserAdd01Icon,
  UserCircleIcon,
  UserGroupIcon,
  UserIcon,
  UserIdVerificationIcon,
  Wallet01Icon,
} from '@hugeicons/core-free-icons';
import { StyleProp, ViewStyle } from 'react-native';

import { iconRegistry, resolveIconTone, type AppIconName, type IconTone } from '@/src/icons/iconRegistry';
import { useThemePalette } from '@/src/settings/ProductSettings';

type AppIconProps = {
  color?: string;
  name: AppIconName;
  size?: number;
  style?: StyleProp<ViewStyle>;
  tone?: IconTone;
};

const hugeicons = {
  AppleIcon,
  ArrowDown01Icon,
  ArrowLeft02Icon,
  ArrowReloadHorizontalIcon,
  ArrowRight01Icon,
  ArrowRight02Icon,
  Award01Icon,
  Cancel01Icon,
  ChartCandlestickIcon,
  CheckListIcon,
  CheckmarkCircle02Icon,
  CompassIcon,
  Exchange03Icon,
  FilterHorizontalIcon,
  GiftIcon,
  GlobeIcon,
  HeadsetIcon,
  InformationCircleIcon,
  ListViewIcon,
  MailOpenIcon,
  Message01Icon,
  MoreHorizontalIcon,
  Notification02Icon,
  QrCodeIcon,
  School01Icon,
  Search01Icon,
  SecurityCheckIcon,
  SecurityLockIcon,
  Share08Icon,
  Tick02Icon,
  TicketStarIcon,
  TransactionHistoryIcon,
  UserAdd01Icon,
  UserCircleIcon,
  UserGroupIcon,
  UserIcon,
  UserIdVerificationIcon,
  Wallet01Icon,
} as const;

export function AppIcon({ color, name, size, style, tone }: AppIconProps) {
  const palette = useThemePalette();
  const icon = iconRegistry[name];
  const resolvedColor = color ?? resolveIconTone(palette, tone ?? icon.primaryTone);
  const iconNode = hugeicons[icon.providerIcon as keyof typeof hugeicons];

  return <HugeiconsIcon color={resolvedColor} icon={iconNode} size={size ?? icon.defaultSize} strokeWidth={icon.strokeWidth} style={style} />;
}

export type { AppIconName, IconTone };
