export type ThemeMode = 'darkTerminal' | 'lightBroker' | 'midnightBlue';

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
  white: string;
};

export const themePalettes: Record<ThemeMode, ThemePalette> = {
  darkTerminal: {
    amber: '#F4B000',
    bg: '#0A0B0D',
    brand: '#2EB5C4',
    blue: '#2EB5C4',
    cyan: '#2EB5C4',
    danger: '#FF667A',
    down: '#05B169',
    line: '#2A2E35',
    lineSoft: '#1E2228',
    panel: '#111318',
    panelHigh: '#16181C',
    panelSoft: '#20242A',
    text: '#FFFFFF',
    textDim: '#A8ACB3',
    textMuted: '#C4C8D0',
    up: '#CF202F',
    white: '#FFFFFF',
  },
  lightBroker: {
    amber: '#A86D00',
    bg: '#F7F7F7',
    brand: '#2EB5C4',
    blue: '#2EB5C4',
    cyan: '#2EB5C4',
    danger: '#CF202F',
    down: '#05A66B',
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
    bg: '#070B16',
    brand: '#2EB5C4',
    blue: '#2EB5C4',
    cyan: '#2EB5C4',
    danger: '#FF6C8A',
    down: '#05B169',
    line: '#24304A',
    lineSoft: '#19243A',
    panel: '#0E1626',
    panelHigh: '#151E31',
    panelSoft: '#1B263A',
    text: '#F8FAFC',
    textDim: '#8F9AAF',
    textMuted: '#BAC2D0',
    up: '#FF667A',
    white: '#FFFFFF',
  },
};

export const palette = themePalettes.lightBroker;

export const shadows = {
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
