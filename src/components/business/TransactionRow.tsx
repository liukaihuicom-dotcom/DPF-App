import { StyleSheet, View } from 'react-native';

import { formatMoney, localizeText } from '@/src/domain/format';
import type { Locale } from '@/src/i18n/translations';
import { useProductSettings } from '@/src/settings/ProductSettings';
import { lineWidth, radius, size, spacing } from '@/src/theme/tokens';

import { AppIcon, type AppIconName, type IconTone } from '../AppIcon';
import { NativePressable } from '../NativePressable';
import { StatusPill, type StatusPillTone } from '../StatusPill';
import { AppText } from '../Typography';

export type TransactionListRow = {
  amount: number;
  createdAt: string;
  id: string;
  note: Partial<Record<Locale, string>> & Record<'en-US' | 'zh-CN', string>;
  status: 'completed' | 'rejected' | 'reviewing';
  type: 'adjustment' | 'deposit' | 'withdrawal';
};

type TransactionRowProps<T extends TransactionListRow> = {
  currency: string;
  formatTime: (createdAt: string, locale: Locale) => string;
  getIcon: (transaction: T) => AppIconName;
  getStatusLabel: (transaction: T) => string;
  getTone: (transaction: T) => StatusPillTone;
  onPress: () => void;
  resolveColor: (transaction: T, palette: ReturnType<typeof useProductSettings>['palette']) => string;
  resolveIconTone: (transaction: T) => IconTone;
  showDivider?: boolean;
  transaction: T;
};

export function TransactionRow<T extends TransactionListRow>({
  currency,
  formatTime,
  getIcon,
  getStatusLabel,
  getTone,
  onPress,
  resolveColor,
  resolveIconTone,
  showDivider,
  transaction,
}: TransactionRowProps<T>) {
  const { locale, palette, t } = useProductSettings();
  const icon = getIcon(transaction);
  const color = resolveColor(transaction, palette);

  return (
    <NativePressable
      accessibilityLabel={t('balance.detail.open', { title: localizeText(transaction.note, locale) })}
      accessibilityRole="button"
      minTouch={58}
      onPress={onPress}
      style={StyleSheet.flatten([styles.row, showDivider && { borderBottomColor: palette.lineSoft, borderBottomWidth: lineWidth.hairline }])}>
      <View style={StyleSheet.flatten([styles.icon, { backgroundColor: `${color}14` }])}>
        <AppIcon name={icon} size={18} tone={resolveIconTone(transaction)} />
      </View>
      <View style={styles.main}>
        <AppText numberOfLines={1} variant="subtitle">
          {localizeText(transaction.note, locale)}
        </AppText>
        <AppText numberOfLines={1} tone="muted" variant="caption">
          {formatTime(transaction.createdAt, locale)}
        </AppText>
      </View>
      <View style={styles.side}>
        <AppText adjustsFontSizeToFit numberOfLines={1} tone={transaction.amount >= 0 ? 'down' : 'up'} variant="subtitle">
          {formatSignedMoney(transaction.amount, currency, locale)}
        </AppText>
        <StatusPill compact label={getStatusLabel(transaction)} tone={getTone(transaction)} />
      </View>
      <AppIcon tone="textDim" name="icon.system.chevron_right" size={14} />
    </NativePressable>
  );
}

function formatSignedMoney(value: number, currency: string, locale: Locale, digits = 2) {
  const sign = value >= 0 ? '+' : '-';
  return `${sign}${formatMoney(Math.abs(value), currency, digits, locale)}`;
}

const styles = StyleSheet.create({
  icon: {
    alignItems: 'center',
    borderRadius: radius.full,
    height: size.control.sm - spacing.xxs,
    justifyContent: 'center',
    width: size.control.sm - spacing.xxs,
  },
  main: {
    flex: 1,
    gap: spacing.xs,
    minWidth: 0,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  side: {
    alignItems: 'flex-end',
    gap: spacing.xs,
    maxWidth: size.viewport.detailSideMaxWidth,
    minWidth: size.viewport.detailSideMinWidth,
  },
});
