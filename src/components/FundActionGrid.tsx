import { router, type Href } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { getFundingOperationActions, type FundingOperation, type FundingOperationTone } from '@/src/domain/funding';
import type { TranslationKey } from '@/src/i18n/translations';
import { useProductSettings } from '@/src/settings/ProductSettings';
import type { ThemeColors } from '@/src/theme/colors';
import { lineWidth, layout, spacing } from '@/src/theme/tokens';

import { AppIcon, type AppIconName, type IconTone } from './AppIcon';
import { NativePressable } from './NativePressable';
import { AppText } from './Typography';

export type FundActionTone = FundingOperationTone | 'blue' | 'up' | 'brand';

export type FundActionGridItem = {
  accessibilityLabel?: string;
  href?: Href;
  icon: AppIconName;
  label: string;
  onPress?: () => void;
  operation?: FundingOperation;
  tone: FundActionTone;
};

type FundActionGridProps = {
  accountId?: string;
  items?: FundActionGridItem[];
};

export function FundActionGrid({ accountId, items }: FundActionGridProps) {
  const { colors, t } = useProductSettings();
  const actionItems = items ?? getDefaultFundActions(t, accountId);
  const businessToneMap = getFundActionToneMap(colors);
  const iconToneByTone: Record<FundActionTone, IconTone | string> = {
    blue: 'blue',
    brand: 'brand',
    deposit: businessToneMap.deposit,
    transfer: businessToneMap.transfer,
    up: 'up',
    withdraw: businessToneMap.withdraw,
  };

  return (
    <View style={styles.grid}>
      {actionItems.map((item) => {
        const onPress = item.onPress ?? (item.href ? () => router.push(item.href as never) : undefined);

        return (
          <NativePressable
            accessibilityLabel={item.accessibilityLabel ?? item.label}
            key={item.label}
            minTouch={72}
            onPress={onPress}
            style={StyleSheet.flatten([styles.tile, { backgroundColor: colors.surface.panel, borderColor: colors.border.subtle }])}>
            <View style={styles.icon}>
              <AppIcon name={item.icon} size={layout.fundActionIconSize} tone={iconToneByTone[item.tone]} />
            </View>
            <AppText adjustsFontSizeToFit numberOfLines={1} variant="buttonMd">
              {item.label}
            </AppText>
          </NativePressable>
        );
      })}
    </View>
  );
}

export function getDefaultFundActions(t: (key: TranslationKey) => string, accountId?: string): FundActionGridItem[] {
  return getFundingOperationActions(t, accountId);
}

function getFundActionToneMap(colors: ThemeColors): Record<FundingOperationTone, string> {
  return {
    deposit: colors.market.down.fg,
    transfer: colors.status.info.fg,
    withdraw: colors.status.warning.fg,
  };
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
    borderWidth: lineWidth.none,
    flexBasis: '30%',
    flexGrow: 1,
    gap: spacing.xs,
    justifyContent: 'center',
    minHeight: 74,
    minWidth: 96,
    padding: spacing.sm,
  },
});
