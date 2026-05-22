import type { TextStyle } from 'react-native';

export const spacing = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  section: 48,
} as const;

export const radius = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 14,
  xl: 16,
  sheet: 24,
  full: 999,
} as const;

export const layout = {
  appMaxWidth: 430,
  fundActionIconBoxSize: 40,
  fundActionIconSize: 24,
  screenPaddingX: spacing.md,
  screenGap: spacing.md,
  screenBottomPadding: spacing.xxl,
  headerIconButtonSize: 40,
  headerIconSize: 24,
  sheetHeaderHeight: 56,
  touchTargetMin: 44,
  topReservedSpace: spacing.xl,
} as const;

export const typography = {
  displayXl: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 40,
  },
  displayLg: {
    fontSize: 22,
    fontWeight: '500',
    lineHeight: 26,
  },
  titleMd: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
  },
  titleSm: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 20,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 24,
  },
  bodyMd: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  bodySm: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  caption: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 18,
  },
  captionSm: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 16,
  },
  microLabel: {
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
  },
  buttonMd: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 20,
  },
  number: {
    fontSize: 17,
    fontWeight: '500',
    lineHeight: 22,
  },
  quote: {
    fontSize: 34,
    fontWeight: '700',
    lineHeight: 40,
  },
  quoteLg: {
    fontSize: 42,
    fontWeight: '800',
    lineHeight: 50,
  },
} satisfies Record<string, TextStyle>;

export type TypographyToken = keyof typeof typography;
