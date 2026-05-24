export type ResolvedThemeMode = 'darkTerminal' | 'lightBroker' | 'midnightBlue';
export type ThemeMode = 'system' | ResolvedThemeMode;

export type ThemePalette = {
  bg: string;
  panel: string;
  panelHigh: string;
  panelSoft: string;
  line: string;
  lineSoft: string;
  text: string;
  textMuted: string;
  textDim: string;
  up: string;
  down: string;
  brand: string;
  amber: string;
  blue: string;
  cyan: string;
  danger: string;
  disabledBorder: string;
  disabledSurface: string;
  disabledText: string;
  launch: string;
  link: string;
  white: string;
};

export const themePalettes: Record<ResolvedThemeMode, ThemePalette> = {
  darkTerminal: {
    amber: '#F4B000',
    bg: '#070707',
    brand: '#2EB5C4',
    blue: '#2EB5C4',
    cyan: '#2EB5C4',
    danger: '#FF6B7E',
    disabledBorder: '#555555',
    disabledSurface: '#303030',
    disabledText: '#B8B8B8',
    down: '#24C985',
    launch: '#9CE56D',
    link: '#74A8FF',
    line: '#444444',
    lineSoft: '#2F2F2F',
    panel: '#181818',
    panelHigh: '#222222',
    panelSoft: '#2C2C2C',
    text: '#F8FAFC',
    textDim: '#B8B8B8',
    textMuted: '#E2E2E2',
    up: '#FF5A68',
    white: '#FFFFFF',
  },
  lightBroker: {
    amber: '#A86D00',
    bg: '#F7F7F7',
    brand: '#2EB5C4',
    blue: '#2EB5C4',
    cyan: '#2EB5C4',
    danger: '#CF202F',
    disabledBorder: '#D2D7DE',
    disabledSurface: '#E3E7EC',
    disabledText: '#6D747E',
    down: '#05A66B',
    launch: '#9CE56D',
    link: '#2563EB',
    line: '#DEE1E6',
    lineSoft: '#EEF0F3',
    panel: '#FFFFFF',
    panelHigh: '#FFFFFF',
    panelSoft: '#EEF0F3',
    text: '#0A0B0D',
    textDim: '#7C828A',
    textMuted: '#5B616E',
    up: '#CF202F',
    white: '#FFFFFF',
  },
  midnightBlue: {
    amber: '#F4B000',
    bg: '#080808',
    brand: '#2EB5C4',
    blue: '#2EB5C4',
    cyan: '#2EB5C4',
    danger: '#FF7391',
    disabledBorder: '#565656',
    disabledSurface: '#333333',
    disabledText: '#BCBCBC',
    down: '#24C985',
    launch: '#9CE56D',
    link: '#7AB8FF',
    line: '#464646',
    lineSoft: '#323232',
    panel: '#1A1A1A',
    panelHigh: '#242424',
    panelSoft: '#303030',
    text: '#F8FAFC',
    textDim: '#BDBDBD',
    textMuted: '#E3E3E3',
    up: '#FF6478',
    white: '#FFFFFF',
  },
};

export const palette = themePalettes.lightBroker;

export const shadows = {
  dialog: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.18,
    shadowRadius: 32,
    elevation: 16,
  },
  panel: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  toast: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    elevation: 12,
  },
};
