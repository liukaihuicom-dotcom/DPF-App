import { StyleProp, ViewStyle } from 'react-native';

import { FlagIcon } from '@/src/components/FlagIcon';
import type { FlagShape } from '@/src/assets/flags';

type CurrencyFlagProps = {
  currency: string;
  shape?: FlagShape;
  size?: number;
  style?: StyleProp<ViewStyle>;
};

const currencyCountryMap: Record<string, string> = {
  AUD: 'au',
  CAD: 'ca',
  CHF: 'ch',
  CNH: 'cn',
  CNY: 'cn',
  EUR: 'eu',
  GBP: 'gb',
  HKD: 'hk',
  IDR: 'id',
  JPY: 'jp',
  NZD: 'nz',
  SGD: 'sg',
  USD: 'us',
  XAG: 'xx',
  XAU: 'xx',
};

export function CurrencyFlag({ currency, shape = 'circle', size = 18, style }: CurrencyFlagProps) {
  const code = currency.trim().toUpperCase();
  const flagCode = currencyCountryMap[code] ?? code.slice(0, 2).toLowerCase();

  return <FlagIcon accessibilityLabel={`${code} currency flag`} code={flagCode} shape={shape} size={size} style={style} />;
}
