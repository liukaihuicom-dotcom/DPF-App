import { StyleSheet, View } from 'react-native';

import type { TranslationKey } from '@/src/i18n/translations';
import { useProductSettings } from '@/src/settings/ProductSettings';
import { layout, spacing } from '@/src/theme/tokens';

import { AppIcon, type AppIconName } from './AppIcon';
import { NativePressable } from './NativePressable';
import { AppText } from './Typography';

type FundActionTone = 'deposit' | 'withdraw' | 'transfer' | 'blue' | 'up' | 'brand';

export type FundActionGridItem = {
  accessibilityLabel?: string;
  icon: AppIconName;
  label: string;
  onPress?: () => void;
  tone: FundActionTone;
};

type FundActionGridProps = {
  items?: FundActionGridItem[];
};

export function FundActionGrid({ items }: FundActionGridProps) {
  const { locale, palette, t } = useProductSettings();
  const actionItems = items ?? getDefaultFundActions(locale, t);
  const colorByTone = {
    blue: palette.blue,
    brand: palette.brand,
    deposit: palette.down,
    transfer: palette.blue,
    up: palette.up,
    withdraw: palette.amber,
  };

  return (
    <View style={styles.grid}>
      {actionItems.map((item) => {
        const color = colorByTone[item.tone];

        return (
          <NativePressable
            accessibilityLabel={item.accessibilityLabel ?? item.label}
            key={item.label}
            minTouch={72}
            onPress={item.onPress}
            style={StyleSheet.flatten([styles.tile, { backgroundColor: palette.panel, borderColor: palette.lineSoft }])}>
            <View style={styles.icon}>
              <AppIcon color={color} name={item.icon} size={layout.fundActionIconSize} />
            </View>
            <AppText adjustsFontSizeToFit numberOfLines={1} variant="caption">
              {item.label}
            </AppText>
          </NativePressable>
        );
      })}
    </View>
  );
}

export function getDefaultFundActions(locale: 'en-US' | 'zh-CN', t: (key: TranslationKey) => string): FundActionGridItem[] {
  return [
    { icon: 'accountBank', label: t('accountDetails.deposit'), tone: 'deposit' },
    { icon: 'actionRefresh', label: locale === 'en-US' ? 'Withdraw' : t('accountDetails.withdrawal'), tone: 'withdraw' },
    { icon: 'transferSwitch', label: locale === 'en-US' ? 'Transfer' : '转账', tone: 'transfer' },
  ];
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  icon: {
    alignItems: 'center',
    height: layout.fundActionIconBoxSize,
    justifyContent: 'center',
    width: layout.fundActionIconBoxSize,
  },
  tile: {
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    flexBasis: '30%',
    flexGrow: 1,
    gap: 7,
    justifyContent: 'center',
    minHeight: 74,
    minWidth: 96,
    padding: spacing.sm,
  },
});
