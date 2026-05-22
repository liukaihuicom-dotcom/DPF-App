import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { AppText } from '@/src/components/Typography';
import { useThemePalette } from '@/src/settings/ProductSettings';
import { typography } from '@/src/theme/tokens';

type CurrencyFlagProps = {
  currency: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
};

const stripeCount = 5;

export function CurrencyFlag({ currency, size = 18, style }: CurrencyFlagProps) {
  const palette = useThemePalette();
  const code = currency.trim().toUpperCase();
  const isUsd = code === 'USD';
  const stripeHeight = size / stripeCount;

  return (
    <View
      accessibilityLabel={`${code} currency flag`}
      style={StyleSheet.flatten([
        styles.flag,
        {
          backgroundColor: isUsd ? palette.white : palette.panelSoft,
          borderColor: palette.lineSoft,
          borderRadius: size / 2,
          height: size,
          width: size,
        },
        style,
      ])}>
      {isUsd ? (
        <>
          {Array.from({ length: stripeCount }).map((_, index) => (
            <View
              key={index}
              style={StyleSheet.flatten([
                styles.usdStripe,
                {
                  backgroundColor: index % 2 === 0 ? palette.up : palette.white,
                  height: stripeHeight,
                  top: index * stripeHeight,
                },
              ])}
            />
          ))}
          <View
            style={StyleSheet.flatten([
              styles.usdCanton,
              {
                backgroundColor: palette.blue,
                height: size * 0.55,
                width: size * 0.55,
              },
            ])}
          />
        </>
      ) : (
        <AppText adjustsFontSizeToFit numberOfLines={1} style={StyleSheet.flatten([styles.code, { color: palette.text }])}>
          {code.slice(0, 2)}
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  code: {
    ...typography.microLabel,
  },
  flag: {
    alignItems: 'center',
    borderWidth: 1,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  usdCanton: {
    left: 0,
    position: 'absolute',
    top: 0,
  },
  usdStripe: {
    left: 0,
    position: 'absolute',
    right: 0,
  },
});
