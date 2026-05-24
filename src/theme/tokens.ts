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
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 14,
  xl: 16,
  sheet: 24,
  full: 999,
} as const;

export const lineWidth = {
  none: 0,
  hairline: 0.5,
  default: 0.5,
  strong: 1,
  selected: 2,
} as const;

export const size = {
  button: {
    icon: 40,
    minHeight: 48,
    textMinTouch: 44,
  },
  control: {
    xs: 28,
    sm: 40,
    md: 48,
    lg: 56,
  },
  icon: {
    xs: 8,
    sm: 16,
    md: 20,
    lg: 24,
    header: 24,
    fundAction: 24,
    fundActionBox: 40,
  },
  input: {
    authOtpCellHeight: 52,
    authOtpCellWidth: 44,
    badgeSm: 18,
    contentMinHeight: 46,
    countryBadge: 30,
    countryDialWidth: 52,
    countryRowMinHeight: 58,
    countrySearchMinHeight: 42,
    floatingMinHeight: 58,
    hiddenInput: 1,
    multilineContentMinHeight: 92,
    multilineMinHeight: 118,
    phoneChipMinHeight: 58,
    singleLineMinHeight: 58,
  },
  sheet: {
    handleWidth: 40,
    headerHeight: 56,
    tradeHeaderMinHeight: 76,
  },
  surface: {
    toastMinHeight: 52,
  },
  tab: {
    barHeight: 68,
    icon: 20,
    itemMinHeight: 44,
  },
  tag: {
    barMinHeight: 6,
    chipMinHeight: 34,
    mdMinHeight: 30,
    smMinHeight: 26,
  },
  touch: {
    min: 44,
  },
  viewport: {
    appMaxWidth: 430,
    chartCompactMinHeight: 176,
    detailSideMaxWidth: 132,
    detailSideMinWidth: 104,
    launchVisualMaxHeight: 360,
    launchVisualMinHeight: 260,
    toastMaxWidth: 420,
  },
} as const;

export const layout = {
  appMaxWidth: size.viewport.appMaxWidth,
  fundActionIconBoxSize: size.icon.fundActionBox,
  fundActionIconSize: size.icon.fundAction,
  screenPaddingX: spacing.lg,
  screenGap: spacing.md,
  screenBottomPadding: spacing.xxl,
  headerIconButtonSize: size.button.icon,
  headerIconSize: size.icon.header,
  sheetHeaderHeight: size.sheet.headerHeight,
  sheetTradeHeaderMinHeight: size.sheet.tradeHeaderMinHeight,
  touchTargetMin: size.touch.min,
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
  pageTitle: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 30,
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
  bodyLg: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 22,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 24,
  },
  bodyMd: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
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
    fontWeight: '600',
    lineHeight: 20,
  },
  buttonLg: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
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
