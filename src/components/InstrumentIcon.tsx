import { useId } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, ClipPath, Defs, Ellipse, G, Line, Path, Polygon, Rect } from 'react-native-svg';

import type { Instrument, InstrumentAssetClass } from '@/src/domain/types';
import { useProductSettings } from '@/src/settings/ProductSettings';

type InstrumentIconProps = {
  instrument?: Instrument;
  size?: number;
  style?: StyleProp<ViewStyle>;
  symbol?: string;
};

type InstrumentIconKind = InstrumentAssetClass | 'unknown';

export function InstrumentIcon({ instrument, size = 36, style, symbol }: InstrumentIconProps) {
  const { palette } = useProductSettings();
  const normalizedSymbol = normalizeSymbol(instrument?.symbol ?? symbol);
  const kind = resolveIconKind(instrument, normalizedSymbol);

  if (kind === 'forex') {
    const base = instrument?.baseCurrency ?? normalizedSymbol.slice(0, 3);
    const quote = instrument?.quoteCurrency ?? normalizedSymbol.slice(3, 6);
    const flagSize = Math.round(size * 0.72);

    return (
      <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={StyleSheet.flatten([styles.root, { height: size, width: size }, style])}>
        <CurrencyMedallion currency={base} size={flagSize} style={[styles.baseFlag, { borderColor: palette.panel }]} />
        <CurrencyMedallion currency={quote} size={flagSize} style={[styles.quoteFlag, { borderColor: palette.panel }]} />
      </View>
    );
  }

  return (
    <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={StyleSheet.flatten([styles.root, { height: size, width: size }, style])}>
      <Svg height={size} viewBox="0 0 48 48" width={size}>
        <Circle cx={24} cy={24} fill={palette.panelSoft} r={23} stroke={palette.lineSoft} strokeWidth={1.4} />
        {renderAssetGlyph(kind, normalizedSymbol, palette)}
      </Svg>
    </View>
  );
}

function CurrencyMedallion({ currency, size, style }: { currency: string; size: number; style?: StyleProp<ViewStyle> }) {
  const id = useId().replace(/:/g, '');
  const clipId = `flag-${currency}-${id}`;

  return (
    <View style={StyleSheet.flatten([styles.medallion, { borderRadius: size / 2, height: size, width: size }, style])}>
      <Svg height={size} viewBox="0 0 40 40" width={size}>
        <Defs>
          <ClipPath id={clipId}>
            <Circle cx={20} cy={20} r={19} />
          </ClipPath>
        </Defs>
        <G clipPath={`url(#${clipId})`}>{renderFlag(currency)}</G>
        <Circle cx={20} cy={20} fill="none" r={19} stroke="rgba(255,255,255,0.72)" strokeWidth={1.2} />
      </Svg>
    </View>
  );
}

function renderFlag(currency: string) {
  switch (currency.toUpperCase()) {
    case 'EUR':
      return (
        <>
          <Rect fill="#244AA5" height={40} width={40} x={0} y={0} />
          {[0, 1, 2, 3, 4, 5, 6, 7].map((point) => {
            const angle = (point / 8) * Math.PI * 2;
            return <Circle cx={20 + Math.cos(angle) * 9} cy={20 + Math.sin(angle) * 9} fill="#FFCC33" key={point} r={1.45} />;
          })}
        </>
      );
    case 'GBP':
      return (
        <>
          <Rect fill="#1F3F91" height={40} width={40} x={0} y={0} />
          <Path d="M-6 1 L3 -6 L46 39 L37 46 Z M37 -6 L46 1 L3 46 L-6 39 Z" fill="#FFFFFF" />
          <Path d="M-3 0 L1 -3 L43 40 L39 43 Z M39 -3 L43 0 L1 43 L-3 40 Z" fill="#C8102E" />
          <Rect fill="#FFFFFF" height={40} width={9} x={15.5} y={0} />
          <Rect fill="#FFFFFF" height={9} width={40} x={0} y={15.5} />
          <Rect fill="#C8102E" height={40} width={5} x={17.5} y={0} />
          <Rect fill="#C8102E" height={5} width={40} x={0} y={17.5} />
        </>
      );
    case 'JPY':
      return (
        <>
          <Rect fill="#FFFFFF" height={40} width={40} x={0} y={0} />
          <Circle cx={20} cy={20} fill="#BC002D" r={8.5} />
        </>
      );
    case 'AUD':
      return (
        <>
          <Rect fill="#123B7A" height={40} width={40} x={0} y={0} />
          <Rect fill="#1F3F91" height={19} width={21} x={0} y={0} />
          <Path d="M0 0 L21 19 M21 0 L0 19" stroke="#FFFFFF" strokeWidth={4} />
          <Path d="M0 0 L21 19 M21 0 L0 19" stroke="#C8102E" strokeWidth={2} />
          <Rect fill="#FFFFFF" height={19} width={4} x={8.5} y={0} />
          <Rect fill="#FFFFFF" height={4} width={21} x={0} y={7.5} />
          <Rect fill="#C8102E" height={19} width={2} x={9.5} y={0} />
          <Rect fill="#C8102E" height={2} width={21} x={0} y={8.5} />
          <Star cx={27} cy={27} fill="#FFFFFF" r={6.2} />
          <Star cx={33} cy={13} fill="#FFFFFF" r={2.6} />
        </>
      );
    case 'USD':
    default:
      return (
        <>
          <Rect fill="#FFFFFF" height={40} width={40} x={0} y={0} />
          {[0, 1, 2, 3, 4, 5, 6].map((stripe) => (
            <Rect fill="#B22234" height={3.08} key={stripe} width={40} x={0} y={stripe * 6.16} />
          ))}
          <Rect fill="#3C3B6E" height={21.5} width={21.5} x={0} y={0} />
          {[0, 1, 2].map((row) =>
            [0, 1, 2].map((col) => <Circle cx={4.4 + col * 6} cy={4.6 + row * 6} fill="#FFFFFF" key={`${row}-${col}`} r={1} />),
          )}
        </>
      );
  }
}

function renderAssetGlyph(kind: InstrumentIconKind, symbol: string, palette: ReturnType<typeof useProductSettings>['palette']) {
  if (kind === 'metals' || symbol.includes('XAU')) {
    return (
      <>
        <Circle cx={29} cy={20} fill="#F6C445" r={9.5} stroke="#9D6700" strokeWidth={1.4} />
        <Circle cx={29} cy={20} fill="none" r={5.7} stroke="#FFE28A" strokeWidth={1.2} />
        <Path d="M10 31 L16 20 H35 L40 31 Z" fill="#D99416" stroke="#8F5C00" strokeLinejoin="round" strokeWidth={1.5} />
        <Path d="M16 20 H35 L31 14 H20 Z" fill="#FFE08A" stroke="#B97807" strokeLinejoin="round" strokeWidth={1.2} />
        <Path d="M16 20 L10 31 H30 L35 20 Z" fill="#F3B536" opacity={0.92} />
      </>
    );
  }

  if (kind === 'futures' || symbol.includes('US30')) {
    return (
      <>
        <Rect fill={palette.blue} height={15} opacity={0.24} rx={2} width={6} x={11} y={22} />
        <Rect fill={palette.blue} height={24} opacity={0.34} rx={2} width={6} x={21} y={13} />
        <Rect fill={palette.blue} height={19} opacity={0.24} rx={2} width={6} x={31} y={18} />
        <Path d="M10 30 L18 25 L25 27 L36 16" fill="none" stroke={palette.blue} strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} />
        <Circle cx={36} cy={16} fill={palette.blue} r={2.6} />
      </>
    );
  }

  if (kind === 'stocks') {
    if (symbol.includes('AAPL')) {
      return (
        <>
          <Path d="M27 12 C29.6 8.9 32.9 8.6 34.4 8.8 C34 11.5 32.1 14 29.3 15.2 C28.1 15.7 27.1 15.6 26.3 15.4 C26.2 14.2 26.3 13.2 27 12 Z" fill="#4C5968" />
          <Path
            d="M23.6 17.1 C26.1 17.1 27.2 15.9 29.7 15.9 C34.8 15.9 38.2 20.5 37.1 26.2 C36.1 31.8 32.2 38.8 28.9 38.8 C27.1 38.8 26 37.7 24.1 37.7 C22.1 37.7 20.9 38.8 19.1 38.8 C15.8 38.8 11.6 31.4 10.9 25.9 C10.2 20.6 13.4 16.1 18.1 16.1 C20.5 16.1 21.4 17.1 23.6 17.1 Z"
            fill="#151A22"
          />
          <Path d="M34 20.6 C32.1 21.8 31.2 23.3 31.2 25.1 C31.2 27.2 32.4 28.9 34.7 29.9" fill="none" stroke="#F8FAFC" strokeLinecap="round" strokeWidth={2.1} />
        </>
      );
    }

    if (symbol.includes('TSLA')) {
      return (
        <>
          <Path d="M11 14 C18.8 10.9 29.2 10.9 37 14" fill="none" stroke="#D71920" strokeLinecap="round" strokeWidth={3.3} />
          <Path d="M17 18 C21.7 16.7 26.3 16.7 31 18" fill="none" stroke="#D71920" strokeLinecap="round" strokeWidth={2.2} />
          <Path d="M24 18 L18 36 H23 L24 28 L25 36 H30 Z" fill="#D71920" stroke="#8D0F16" strokeLinejoin="round" strokeWidth={1.1} />
        </>
      );
    }

    if (symbol.includes('NVDA')) {
      return (
        <>
          <Rect fill="#76B900" height={25} rx={5} width={30} x={9} y={12} />
          <Path d="M15 25 C19 18.6 29 18.6 34 25 C30.3 31 19.8 31.2 15 25 Z" fill="#10230A" opacity={0.92} />
          <Circle cx={24.5} cy={25} fill="#D9FF8E" r={5.6} />
          <Circle cx={24.5} cy={25} fill="#10230A" r={2.6} />
          <Line stroke="#10230A" strokeLinecap="round" strokeWidth={1.5} x1={14} x2={34} y1={16} y2={16} />
          <Line stroke="#10230A" strokeLinecap="round" strokeWidth={1.5} x1={14} x2={34} y1={33} y2={33} />
        </>
      );
    }

    return (
      <>
        <Rect fill={palette.text} height={24} opacity={0.12} rx={5} width={26} x={11} y={12} />
        <Path d="M15 31 L21 24 L26 28 L34 18" fill="none" stroke={palette.text} strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} />
        <Circle cx={34} cy={18} fill={palette.text} r={2.5} />
      </>
    );
  }

  return (
    <>
      <Circle cx={24} cy={24} fill={palette.brand} opacity={0.18} r={12} />
      <Path d="M15 28 L22 20 L27 25 L34 16" fill="none" stroke={palette.brand} strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} />
      <Line stroke={palette.textDim} strokeLinecap="round" strokeWidth={2} x1={15} x2={34} y1={34} y2={34} />
    </>
  );
}

function Star({ cx, cy, fill, r }: { cx: number; cy: number; fill: string; r: number }) {
  const points = Array.from({ length: 10 }, (_, index) => {
    const angle = -Math.PI / 2 + (index * Math.PI) / 5;
    const radius = index % 2 === 0 ? r : r * 0.42;
    return `${cx + Math.cos(angle) * radius},${cy + Math.sin(angle) * radius}`;
  }).join(' ');

  return <Polygon fill={fill} points={points} />;
}

function normalizeSymbol(value?: string) {
  return (value ?? '').replace(/[^A-Za-z0-9]/g, '').toUpperCase();
}

function resolveIconKind(instrument?: Instrument, symbol = ''): InstrumentIconKind {
  if (instrument) {
    return instrument.assetClass;
  }

  if (/^[A-Z]{6}$/.test(symbol)) {
    return 'forex';
  }

  if (symbol.includes('XAU') || symbol.includes('XAG')) {
    return 'metals';
  }

  if (/^(US30|NAS100|SPX500|GER40|UK100|JP225)$/.test(symbol)) {
    return 'futures';
  }

  if (/^[A-Z]{1,5}$/.test(symbol)) {
    return 'stocks';
  }

  return 'unknown';
}

const styles = StyleSheet.create({
  baseFlag: {
    left: 0,
    top: 0,
  },
  medallion: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    overflow: 'hidden',
    position: 'absolute',
  },
  quoteFlag: {
    bottom: 0,
    right: 0,
  },
  root: {
    flexShrink: 0,
    position: 'relative',
  },
});
