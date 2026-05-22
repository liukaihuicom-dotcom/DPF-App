import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActionButton } from '@/src/components/ActionButton';
import { AppIcon } from '@/src/components/AppIcon';
import { Card } from '@/src/components/Card';
import { HeaderIconButton } from '@/src/components/HeaderIconButton';
import { InstrumentIcon } from '@/src/components/InstrumentIcon';
import { NativePressable } from '@/src/components/NativePressable';
import { Screen } from '@/src/components/Screen';
import { TextField } from '@/src/components/TextField';
import { AppText } from '@/src/components/Typography';
import { directionLabel, formatMoney, formatPrice, localizeText, orderTypeLabel } from '@/src/domain/format';
import { calculateMargin, calculateNotional, getTradePrice } from '@/src/domain/trading';
import type { Direction, Instrument, OrderType } from '@/src/domain/types';
import { useToast } from '@/src/feedback/Toast';
import { impactLight, notifySuccess, notifyWarning } from '@/src/feedback/haptics';
import { useProductSettings } from '@/src/settings/ProductSettings';
import { useBroker } from '@/src/state/BrokerStore';
import { layout, radius, spacing, typography } from '@/src/theme/tokens';

const orderTypes: OrderType[] = ['market', 'limit', 'stop'];

export default function OrderTicketScreen() {
  const { direction = 'buy', id, type = 'market' } = useLocalSearchParams<{ direction?: Direction; id: string; type?: OrderType }>();
  const { account, findInstrument, placeOrder } = useBroker();
  const { locale, palette, t } = useProductSettings();
  const toast = useToast();
  const [side, setSide] = useState<Direction>(direction === 'sell' ? 'sell' : 'buy');
  const [orderType, setOrderType] = useState<OrderType>(type === 'limit' || type === 'stop' ? type : 'market');
  const [lotsText, setLotsText] = useState('0.10');
  const [riskEnabled, setRiskEnabled] = useState(true);
  const instrument = findInstrument(id);

  const lots = Number(lotsText) > 0 ? Number(lotsText) : 0;
  const price = instrument ? getTradePrice(instrument, side) : 0;
  const margin = instrument ? calculateMargin(instrument, lots, price) : 0;
  const notional = instrument ? calculateNotional(instrument, lots, price) : 0;
  const canSubmit = Boolean(instrument && lots > 0 && margin < account.freeMargin);
  const errorText = lots <= 0 ? t('order.errorLots') : margin >= account.freeMargin ? t('order.errorMargin') : '';
  const stopLossPrice = instrument ? getRiskPrice(instrument, price, side, 'stopLoss') : 0;
  const takeProfitPrice = instrument ? getRiskPrice(instrument, price, side, 'takeProfit') : 0;
  const stopLossPnl = instrument ? getRiskPnl(instrument, lots, price, stopLossPrice, side) : 0;
  const takeProfitPnl = instrument ? getRiskPnl(instrument, lots, price, takeProfitPrice, side) : 0;
  const tradeTone = side === 'buy' ? 'down' : 'up';
  const tradeColor = side === 'buy' ? palette.down : palette.up;
  const submitLabel = canSubmit
    ? t('order.submitCompact', { direction: directionLabel(side, locale), lots: formatLots(lots, locale) })
    : t('order.invalid');

  const presetLots = useMemo(() => ['0.01', '0.05', '0.10', instrument?.symbol === 'XAU/USD' ? '0.20' : '0.50'], [instrument]);

  if (!instrument) {
    return (
      <Screen back title={t('common.invalidInstrument')}>
        <AppText variant="title">{t('common.invalidInstrument')}</AppText>
      </Screen>
    );
  }

  const setLots = (nextLots: number) => {
    const normalized = Math.max(0.01, Number(nextLots.toFixed(2)));
    setLotsText(normalized.toFixed(2));
  };

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

  const closeTicket = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/trade');
  };

  return (
    <SafeAreaView edges={['top']} style={StyleSheet.flatten([styles.modalRoot, { backgroundColor: `${palette.text}66` }])}>
      <Stack.Screen options={{ title: `${instrument.symbol} ${t('order.titleSuffix')}` }} />
      <Pressable accessibilityLabel={t('common.cancel')} onPress={closeTicket} style={styles.modalBackdrop} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.keyboardPanel}>
        <SafeAreaView edges={['bottom']} style={StyleSheet.flatten([styles.ticketSheet, { backgroundColor: palette.bg, borderColor: palette.lineSoft }])}>
          <View style={styles.handleWrap}>
            <View style={StyleSheet.flatten([styles.handle, { backgroundColor: palette.line }])} />
          </View>
          <View style={styles.sheetHeader}>
            <View style={StyleSheet.flatten([styles.headerIcon, { backgroundColor: `${tradeColor}12`, borderColor: `${tradeColor}44` }])}>
              <AppIcon color={tradeColor} name="taskChecklist" size={20} />
            </View>
            <View style={styles.sheetHeaderCopy}>
              <AppText numberOfLines={1} variant="sheetTitle">
                {t('order.title')}
              </AppText>
              <AppText numberOfLines={1} tone="muted" variant="caption">
                {localizeText(instrument.name, locale)}
              </AppText>
            </View>
            <HeaderIconButton accessibilityLabel={t('common.cancel')} icon="closeX" onPress={closeTicket} variant="ghost" />
          </View>

          <ScrollView
            contentContainerStyle={styles.sheetContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            style={styles.sheetScroller}>
            <Card compact style={styles.summaryCard}>
              <View style={styles.summaryTop}>
                <View style={styles.accountCopy}>
                  <AppText numberOfLines={1} tone="dim" variant="caption">
                    {t('order.accountNumber', { accountId: account.accountId })}
                  </AppText>
                  <AppText numberOfLines={1} variant="subtitle">
                    {t('order.freeMargin')}
                  </AppText>
                  <AppText numberOfLines={1} variant="titleMd">
                    {formatMoney(account.freeMargin, account.currency, 2, locale)}
                  </AppText>
                </View>
                <View style={styles.symbolBlock}>
                  <InstrumentIcon instrument={instrument} size={42} />
                  <AppText numberOfLines={1} variant="subtitle">
                    {instrument.symbol}
                  </AppText>
                  <AppText tone={tradeTone} variant="number">
                    {formatPrice(instrument, price)}
                  </AppText>
                </View>
              </View>
              <View style={StyleSheet.flatten([styles.summaryMeta, { borderTopColor: palette.lineSoft }])}>
                <OrderInlineMetric label={t('common.leverage')} value={`${instrument.leverage}x`} />
                <OrderInlineMetric label={t('common.spread')} value={`${instrument.spread}`} />
                <OrderInlineMetric label={t('order.fillPrice')} value={formatPrice(instrument, price)} />
              </View>
            </Card>

            <View style={StyleSheet.flatten([styles.typeSegment, { backgroundColor: palette.panelSoft, borderColor: palette.lineSoft }])}>
              {orderTypes.map((item) => {
                const selected = orderType === item;

                return (
                  <NativePressable
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    key={item}
                    onPress={() => {
                      void impactLight();
                      setOrderType(item);
                    }}
                    style={StyleSheet.flatten([
                      styles.typeSegmentButton,
                      selected && { backgroundColor: palette.panel, borderColor: palette.line },
                    ])}>
                    <AppText tone={selected ? 'default' : 'muted'} variant="caption">
                      {orderTypeLabel(item, locale)}
                    </AppText>
                  </NativePressable>
                );
              })}
            </View>

            <Card>
              <View style={styles.cardHeaderRow}>
                <View>
                  <AppText variant="subtitle">{t('order.positionSize')}</AppText>
                  <AppText tone="muted" variant="caption">
                    {t('order.lotHint', { baseCurrency: instrument.baseCurrency, contractSize: instrument.contractSize })}
                  </AppText>
                </View>
                <View style={StyleSheet.flatten([styles.sidePill, { backgroundColor: `${tradeColor}12`, borderColor: `${tradeColor}55` }])}>
                  <AppText tone={tradeTone} variant="caption">
                    {directionLabel(side, locale)}
                  </AppText>
                </View>
              </View>

              <View style={StyleSheet.flatten([styles.sideSwitch, { backgroundColor: palette.panelSoft, borderColor: palette.lineSoft }])}>
                {(['buy', 'sell'] as Direction[]).map((item) => {
                  const selected = side === item;
                  const color = item === 'buy' ? palette.down : palette.up;
                  const tone = item === 'buy' ? 'down' : 'up';

                  return (
                    <NativePressable
                      accessibilityRole="button"
                      accessibilityState={{ selected }}
                      key={item}
                      onPress={() => {
                        void impactLight();
                        setSide(item);
                      }}
                      style={StyleSheet.flatten([
                        styles.sideSwitchButton,
                        selected && { backgroundColor: `${color}14`, borderColor: color },
                      ])}>
                      <AppText tone={selected ? tone : 'muted'} variant="subtitle">
                        {directionLabel(item, locale)}
                      </AppText>
                    </NativePressable>
                  );
                })}
              </View>

              <View style={StyleSheet.flatten([styles.stepper, { backgroundColor: palette.panelSoft, borderColor: palette.lineSoft }])}>
                <StepperButton
                  label={t('order.decreaseLots')}
                  onPress={() => {
                    void impactLight();
                    setLots(lots - 0.01);
                  }}
                  symbol="-"
                />
                <TextField
                  containerStyle={styles.stepperInputContainer}
                  error={errorText}
                  inputStyle={styles.stepperInput}
                  keyboardType="decimal-pad"
                  label={t('order.positionSize')}
                  labelHidden
                  onChangeText={setLotsText}
                  placeholder="0.10"
                  shellStyle={styles.stepperInputShell}
                  value={lotsText}
                />
                <StepperButton
                  label={t('order.increaseLots')}
                  onPress={() => {
                    void impactLight();
                    setLots(lots + 0.01);
                  }}
                  symbol="+"
                />
              </View>

              <View style={styles.presetRow}>
                {presetLots.map((preset) => (
                  <NativePressable
                    accessibilityRole="button"
                    key={preset}
                    onPress={() => {
                      void impactLight();
                      setLotsText(preset);
                    }}
                    style={StyleSheet.flatten([
                      styles.preset,
                      { backgroundColor: lotsText === preset ? `${tradeColor}12` : palette.panelSoft, borderColor: lotsText === preset ? tradeColor : palette.lineSoft },
                    ])}>
                    <AppText tone={lotsText === preset ? tradeTone : 'default'} variant="caption">
                      {preset}
                    </AppText>
                  </NativePressable>
                ))}
              </View>

              <View style={StyleSheet.flatten([styles.valueRows, { borderTopColor: palette.lineSoft }])}>
                <OrderInfoRow label={t('order.notionalValue')} value={formatMoney(notional, 'USD', 2, locale)} />
                <OrderInfoRow label={t('order.estimatedMargin')} tone={margin > account.freeMargin ? 'danger' : 'default'} value={formatMoney(margin, 'USD', 2, locale)} />
              </View>
            </Card>

            <Card>
              <View style={styles.cardHeaderRow}>
                <View style={styles.riskTitle}>
                  <AppIcon name="riskShield" size={18} tone="brand" />
                  <View>
                    <AppText variant="subtitle">{t('order.riskManagement')}</AppText>
                    <AppText tone="muted" variant="caption">
                      {t('order.riskManagementHint')}
                    </AppText>
                  </View>
                </View>
                <SwitchControl
                  accessibilityLabel={t('order.riskManagement')}
                  onValueChange={(nextValue) => {
                    void impactLight();
                    setRiskEnabled(nextValue);
                  }}
                  value={riskEnabled}
                />
              </View>

              {riskEnabled ? (
                <View style={styles.riskFields}>
                  <RiskPriceRow
                    caption={side === 'buy' ? t('order.belowMarket') : t('order.aboveMarket')}
                    label={t('order.stopLoss')}
                    pnl={stopLossPnl}
                    price={formatPrice(instrument, stopLossPrice)}
                  />
                  <RiskPriceRow
                    caption={side === 'buy' ? t('order.aboveMarket') : t('order.belowMarket')}
                    label={t('order.takeProfit')}
                    pnl={takeProfitPnl}
                    price={formatPrice(instrument, takeProfitPrice)}
                  />
                </View>
              ) : null}
            </Card>

            <Card compact style={styles.riskNotice}>
              <AppIcon name="infoCircle" size={16} tone="amber" />
              <AppText numberOfLines={3} tone="amber" variant="caption">
                {t('risk.order')}
              </AppText>
            </Card>
          </ScrollView>

          <View style={StyleSheet.flatten([styles.footerStack, { backgroundColor: palette.bg, borderTopColor: palette.lineSoft }])}>
            {errorText ? (
              <AppText numberOfLines={2} tone="danger" variant="caption">
                {errorText}
              </AppText>
            ) : null}
            <ActionButton
              accessibilityLabel={submitLabel}
              emphasis="solid"
              label={submitLabel}
              onPress={submitOrder}
              tone={tradeTone}
            />
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function StepperButton({ label, onPress, symbol }: { label: string; onPress: () => void; symbol: string }) {
  const { palette } = useProductSettings();

  return (
    <NativePressable
      accessibilityLabel={label}
      accessibilityRole="button"
      minTouch={48}
      onPress={onPress}
      style={StyleSheet.flatten([styles.stepperButton, { backgroundColor: palette.panel, borderColor: palette.lineSoft }])}>
      <AppText variant="titleMd">{symbol}</AppText>
    </NativePressable>
  );
}

function SwitchControl({
  accessibilityLabel,
  onValueChange,
  value,
}: {
  accessibilityLabel: string;
  onValueChange: (value: boolean) => void;
  value: boolean;
}) {
  const { palette } = useProductSettings();

  return (
    <NativePressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      minTouch={44}
      onPress={() => onValueChange(!value)}
      style={StyleSheet.flatten([styles.switchTrack, { backgroundColor: value ? palette.brand : palette.panelSoft, borderColor: value ? palette.brand : palette.lineSoft }])}>
      <View style={StyleSheet.flatten([styles.switchThumb, { backgroundColor: value ? palette.white : palette.textDim, transform: [{ translateX: value ? 18 : 0 }] }])} />
    </NativePressable>
  );
}

function RiskPriceRow({ caption, label, pnl, price }: { caption: string; label: string; pnl: number; price: string }) {
  const { locale, palette } = useProductSettings();
  const pnlTone = pnl >= 0 ? 'down' : 'up';
  const pnlColor = pnl >= 0 ? palette.down : palette.up;

  return (
    <View style={StyleSheet.flatten([styles.riskRow, { backgroundColor: palette.panelSoft, borderColor: palette.lineSoft }])}>
      <View style={styles.riskRowCopy}>
        <AppText variant="caption">{label}</AppText>
        <AppText tone="muted" variant="caption">
          {caption}
        </AppText>
      </View>
      <View style={styles.riskValueBlock}>
        <AppText variant="number">{price}</AppText>
        <View style={StyleSheet.flatten([styles.pnlPill, { backgroundColor: `${pnlColor}12`, borderColor: `${pnlColor}55` }])}>
          <AppText tone={pnlTone} variant="caption">
            {formatMoney(pnl, 'USD', 2, locale)}
          </AppText>
        </View>
      </View>
    </View>
  );
}

function OrderInfoRow({ label, tone = 'default', value }: { label: string; tone?: 'default' | 'danger'; value: string }) {
  const { palette } = useProductSettings();

  return (
    <View style={StyleSheet.flatten([styles.infoRow, { borderBottomColor: palette.lineSoft }])}>
      <AppText tone="muted" variant="caption">
        {label}
      </AppText>
      <AppText tone={tone} variant="number">
        {value}
      </AppText>
    </View>
  );
}

function OrderInlineMetric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.inlineMetric}>
      <AppText numberOfLines={1} tone="muted" variant="caption">
        {label}
      </AppText>
      <AppText adjustsFontSizeToFit numberOfLines={1} variant="caption">
        {value}
      </AppText>
    </View>
  );
}

function formatLots(value: number, locale: 'en-US' | 'zh-CN') {
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(value);
}

function getRiskPrice(instrument: Instrument, price: number, direction: Direction, kind: 'stopLoss' | 'takeProfit') {
  const distance = Math.max(instrument.pipSize * 20, price * 0.012);
  const multiplier = kind === 'takeProfit' ? 1 : -1;
  const sideMultiplier = direction === 'buy' ? 1 : -1;

  return price + distance * multiplier * sideMultiplier;
}

function getRiskPnl(
  instrument: Instrument,
  lots: number,
  entryPrice: number,
  riskPrice: number,
  direction: Direction,
) {
  const multiplier = direction === 'buy' ? 1 : -1;

  return (riskPrice - entryPrice) * multiplier * lots * instrument.contractSize;
}

const styles = StyleSheet.create({
  accountCopy: {
    flex: 1,
    gap: spacing.xs,
    minWidth: 0,
  },
  cardHeaderRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  footerStack: {
    borderTopWidth: 1,
    gap: spacing.sm,
    paddingBottom: spacing.md,
    paddingHorizontal: layout.screenPaddingX,
    paddingTop: spacing.md,
  },
  handle: {
    borderRadius: radius.full,
    height: 4,
    width: 42,
  },
  handleWrap: {
    alignItems: 'center',
    paddingBottom: spacing.sm,
    paddingTop: spacing.sm,
  },
  headerIcon: {
    alignItems: 'center',
    borderRadius: radius.full,
    borderWidth: 1,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  infoRow: {
    alignItems: 'center',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 34,
  },
  inlineMetric: {
    flex: 1,
    gap: spacing.xs,
    minWidth: 0,
  },
  keyboardPanel: {
    height: '94%',
    justifyContent: 'flex-end',
    position: 'relative',
    width: '100%',
    zIndex: 1,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  pnlPill: {
    borderRadius: radius.full,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  preset: {
    borderRadius: radius.full,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  presetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  riskFields: {
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  riskNotice: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  riskRow: {
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
    minHeight: 68,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  riskRowCopy: {
    flex: 1,
    gap: spacing.xs,
    minWidth: 0,
  },
  riskTitle: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    minWidth: 0,
  },
  riskValueBlock: {
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  sheetContent: {
    gap: spacing.md,
    paddingBottom: spacing.lg,
    paddingHorizontal: layout.screenPaddingX,
    paddingTop: spacing.sm,
  },
  sheetHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    minHeight: layout.sheetHeaderHeight,
    paddingBottom: spacing.sm,
    paddingHorizontal: layout.screenPaddingX,
  },
  sheetHeaderCopy: {
    flex: 1,
    gap: spacing.xs,
    minWidth: 0,
  },
  sheetScroller: {
    flex: 1,
  },
  sidePill: {
    borderRadius: radius.full,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  sideSwitch: {
    borderRadius: radius.full,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.lg,
    padding: spacing.xs,
  },
  sideSwitchButton: {
    alignItems: 'center',
    borderColor: 'transparent',
    borderRadius: radius.full,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    minHeight: 42,
  },
  stepper: {
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
    padding: spacing.sm,
  },
  stepperButton: {
    alignItems: 'center',
    borderRadius: radius.full,
    borderWidth: 1,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  stepperInput: {
    ...typography.displayXl,
    textAlign: 'center',
  },
  stepperInputContainer: {
    flex: 1,
    minWidth: 0,
  },
  stepperInputShell: {
    borderColor: 'transparent',
    minHeight: 50,
    paddingHorizontal: spacing.sm,
  },
  summaryCard: {
    gap: spacing.md,
  },
  summaryMeta: {
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    paddingTop: spacing.md,
  },
  summaryTop: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  switchThumb: {
    borderRadius: radius.full,
    height: 22,
    width: 22,
  },
  switchTrack: {
    borderRadius: radius.full,
    borderWidth: 1,
    justifyContent: 'center',
    padding: 2,
    width: 48,
  },
  symbolBlock: {
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  ticketSheet: {
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    borderTopWidth: 1,
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
    zIndex: 1,
  },
  typeSegment: {
    borderRadius: radius.full,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.xs,
    padding: spacing.xs,
  },
  typeSegmentButton: {
    alignItems: 'center',
    borderColor: 'transparent',
    borderRadius: radius.full,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    minHeight: 42,
  },
  valueRows: {
    borderTopWidth: 1,
    marginTop: spacing.md,
    paddingTop: spacing.sm,
  },
});
