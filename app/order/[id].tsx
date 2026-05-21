import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ActionButton } from '@/src/components/ActionButton';
import { Card } from '@/src/components/Card';
import { Metric } from '@/src/components/Metric';
import { Screen } from '@/src/components/Screen';
import { TextField } from '@/src/components/TextField';
import { AppText } from '@/src/components/Typography';
import { NativePressable } from '@/src/components/NativePressable';
import { directionLabel, formatMoney, formatPrice, localizeText, orderTypeLabel } from '@/src/domain/format';
import { calculateMargin, calculateNotional, getTradePrice } from '@/src/domain/trading';
import type { Direction, OrderType } from '@/src/domain/types';
import { useToast } from '@/src/feedback/Toast';
import { impactLight, notifySuccess, notifyWarning } from '@/src/feedback/haptics';
import { useProductSettings } from '@/src/settings/ProductSettings';
import { useBroker } from '@/src/state/BrokerStore';

export default function OrderTicketScreen() {
  const { direction = 'buy', id } = useLocalSearchParams<{ direction?: Direction; id: string }>();
  const { account, findInstrument, placeOrder } = useBroker();
  const { locale, palette, t } = useProductSettings();
  const toast = useToast();
  const [side, setSide] = useState<Direction>(direction === 'sell' ? 'sell' : 'buy');
  const [orderType, setOrderType] = useState<OrderType>('market');
  const [lotsText, setLotsText] = useState('0.10');
  const instrument = findInstrument(id);

  const lots = Number(lotsText) > 0 ? Number(lotsText) : 0;
  const price = instrument ? getTradePrice(instrument, side) : 0;
  const margin = instrument ? calculateMargin(instrument, lots, price) : 0;
  const notional = instrument ? calculateNotional(instrument, lots, price) : 0;
  const canSubmit = Boolean(instrument && lots > 0 && margin < account.freeMargin);
  const errorText = lots <= 0 ? t('order.errorLots') : margin >= account.freeMargin ? t('order.errorMargin') : '';

  const presetLots = useMemo(() => ['0.01', '0.05', '0.10', instrument?.symbol === 'XAU/USD' ? '0.20' : '0.50'], [instrument]);

  if (!instrument) {
    return (
      <Screen back title={t('common.invalidInstrument')}>
        <AppText variant="title">{t('common.invalidInstrument')}</AppText>
      </Screen>
    );
  }

  const submitOrder = () => {
    if (!canSubmit) {
      void notifyWarning();
      toast.show({
        message: errorText || t('order.invalid'),
        title: t('order.submitBlocked'),
        tone: 'warning',
      });
      return;
    }

    const order = placeOrder({
      direction: side,
      instrumentId: instrument.id,
      lots,
      type: orderType,
    });

    if (order) {
      void notifySuccess();
      toast.show({
        message: t('order.submittedMessage', { symbol: instrument.symbol }),
        title: t('order.submittedTitle'),
        tone: 'success',
      });
      setTimeout(() => router.replace('/trade'), 450);
    }
  };

  return (
    <Screen
      back
      contentInsetBottom={16}
      dismissKeyboardOnTap
      keyboardAware
      stickyFooter={
        <View style={styles.footerStack}>
          {errorText ? (
            <AppText numberOfLines={2} tone="danger" variant="caption">
              {errorText}
            </AppText>
          ) : null}
          <ActionButton
            label={canSubmit ? t('order.submit', { direction: directionLabel(side, locale) }) : t('order.invalid')}
            onPress={submitOrder}
            tone={canSubmit ? (side === 'buy' ? 'up' : 'down') : 'neutral'}
          />
        </View>
      }
      subtitle={localizeText(instrument.name, locale)}
      title={`${instrument.symbol} ${t('order.titleSuffix')}`}>
      <Stack.Screen options={{ title: `${instrument.symbol} ${t('order.titleSuffix')}` }} />
      <View style={styles.header}>
        <View>
          <AppText tone="dim" variant="eyebrow">
            {t('order.title')}
          </AppText>
          <AppText variant="subtitle">{instrument.symbol}</AppText>
          <AppText tone="muted" variant="caption">
            {localizeText(instrument.name, locale)} · {instrument.leverage}x {t('common.leverage')}
          </AppText>
        </View>
        <AppText tone={side === 'buy' ? 'up' : 'down'} variant="number">
          {formatPrice(instrument, price)}
        </AppText>
      </View>

      <Card>
        <AppText tone="dim" variant="eyebrow">
          {t('common.direction')}
        </AppText>
        <View style={styles.segment}>
          {(['buy', 'sell'] as Direction[]).map((item) => (
            <NativePressable
              accessibilityRole="button"
              key={item}
              onPress={() => {
                void impactLight();
                setSide(item);
              }}
              style={StyleSheet.flatten([
                styles.segmentButton,
                { backgroundColor: palette.panelSoft, borderColor: palette.lineSoft },
                side === item && {
                  backgroundColor: `${item === 'buy' ? palette.up : palette.down}12`,
                  borderColor: item === 'buy' ? palette.up : palette.down,
                },
              ])}>
              <AppText tone={side === item ? 'default' : 'muted'} variant="subtitle">
                {directionLabel(item, locale)}
              </AppText>
            </NativePressable>
          ))}
        </View>

        <AppText tone="dim" variant="eyebrow">
          {t('common.orderType')}
        </AppText>
        <View style={styles.segment}>
          {(['market', 'limit'] as OrderType[]).map((item) => (
            <NativePressable
              accessibilityRole="button"
              key={item}
              onPress={() => {
                void impactLight();
                setOrderType(item);
              }}
              style={StyleSheet.flatten([
                styles.segmentButton,
                { backgroundColor: palette.panelSoft, borderColor: palette.lineSoft },
                orderType === item && { backgroundColor: `${palette.brand}12`, borderColor: palette.brand },
              ])}>
              <AppText tone={orderType === item ? 'default' : 'muted'} variant="body">
                {orderTypeLabel(item, locale)}
              </AppText>
            </NativePressable>
          ))}
        </View>
      </Card>

      <Card>
        <View style={styles.lotHeader}>
          <AppText tone="dim" variant="eyebrow">
            {t('common.lots')}
          </AppText>
          <AppText tone="muted" variant="caption">
            {t('order.lotHint', { baseCurrency: instrument.baseCurrency, contractSize: instrument.contractSize })}
          </AppText>
        </View>
        <TextField
          error={errorText}
          inputStyle={styles.lotInput}
          keyboardType="decimal-pad"
          label={t('common.lots')}
          labelHidden
          onChangeText={setLotsText}
          placeholder="0.10"
          shellStyle={styles.lotInputShell}
          value={lotsText}
        />
        <View style={styles.presetRow}>
          {presetLots.map((preset) => (
            <NativePressable
              accessibilityRole="button"
              key={preset}
              onPress={() => {
                void impactLight();
                setLotsText(preset);
              }}
              style={StyleSheet.flatten([styles.preset, { backgroundColor: palette.panelSoft, borderColor: palette.line }])}>
              <AppText variant="caption">{preset}</AppText>
            </NativePressable>
          ))}
        </View>
      </Card>

      <Card highlight>
        <View style={styles.metricRow}>
          <Metric label={t('order.notional')} value={formatMoney(notional, 'USD', 2, locale)} />
          <Metric label={t('order.estimatedMargin')} tone={margin > account.freeMargin ? 'danger' : 'amber'} value={formatMoney(margin, 'USD', 2, locale)} />
        </View>
        <View style={styles.metricRow}>
          <Metric label={t('order.fillPrice')} value={formatPrice(instrument, price)} />
          <Metric label={t('order.availableMargin')} value={formatMoney(account.freeMargin, account.currency, 2, locale)} />
        </View>
      </Card>

      <Card>
        <AppText tone="amber" variant="caption">
          {t('risk.order')}
        </AppText>
      </Card>

    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  footerStack: {
    gap: 8,
  },
  lotInput: {
    fontSize: 28,
    lineHeight: 34,
  },
  lotInputShell: {
    borderColor: undefined,
    minHeight: 58,
  },
  lotHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  metricRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  preset: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  presetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  segment: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
    marginTop: 8,
  },
  segmentButton: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    minHeight: 46,
  },
});
