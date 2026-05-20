import { Alert, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';

import { ActionButton } from '@/src/components/ActionButton';
import { useBottomSheet } from '@/src/components/BottomSheet';
import { Card } from '@/src/components/Card';
import { Metric } from '@/src/components/Metric';
import { NativePressable } from '@/src/components/NativePressable';
import { PhosphorIcon } from '@/src/components/PhosphorIcon';
import { Screen } from '@/src/components/Screen';
import { AppText } from '@/src/components/Typography';
import { buildTradingAccountProfiles, getAccountStatusLabel, type TradingAccountProfile, type TradingAccountStatus } from '@/src/domain/accountProfiles';
import {
  directionLabel,
  formatMoney,
  formatNumber,
  formatPrice,
  formatVolumeMillions,
  localizeText,
  statusLabel,
} from '@/src/domain/format';
import { useToast } from '@/src/feedback/Toast';
import { notifySuccess, notifyWarning } from '@/src/feedback/haptics';
import { useProductSettings } from '@/src/settings/ProductSettings';
import { useBroker } from '@/src/state/BrokerStore';

export default function PortfolioScreen() {
  const { role } = useBroker();

  return role === 'partner' ? <PartnerClientsScreen /> : <TraderPortfolioScreen />;
}

export function TraderPortfolioScreen() {
  const { account, closePosition, deleteOrder, findInstrument, modifyOrder, orders, positions } = useBroker();
  const { locale, palette, t } = useProductSettings();
  const toast = useToast();
  const bottomSheet = useBottomSheet();
  const [selectedAccountId, setSelectedAccountId] = useState('active-main');
  const [orderView, setOrderView] = useState<'history' | 'pending' | 'positions'>('positions');
  const pnl = positions.reduce((total, position) => total + position.unrealizedPnl, 0);
  const accountProfiles = buildTradingAccountProfiles(account, positions);
  const selectedAccount = accountProfiles.find((profile) => profile.id === selectedAccountId) ?? accountProfiles[0];
  const accountSuffix = selectedAccount.accountNo.slice(-4);
  const marginLevel = account.marginLevel > 0 ? formatNumber(account.marginLevel, 2, locale) : '0.00';
  const positionRows =
    positions.length > 0
      ? positions.map((position) => {
          const instrument = findInstrument(position.instrumentId);
          return {
            closable: true,
            currentPrice: instrument ? formatPrice(instrument, position.currentPrice) : formatNumber(position.currentPrice, 2, locale),
            direction: position.direction,
            id: position.id,
            lots: formatNumber(position.lots, 2, locale),
            openPrice: instrument ? formatPrice(instrument, position.openPrice) : formatNumber(position.openPrice, 2, locale),
            pnl: position.unrealizedPnl,
            symbol: position.symbol,
          };
        })
      : getDemoPositionRows(locale);
  const orderRows: PendingOrderRow[] =
    orders.length > 0
      ? orders.map((order) => {
          const instrument = findInstrument(order.instrumentId);
          const price = instrument ? formatPrice(instrument, order.filledPrice || order.requestedPrice) : formatNumber(order.filledPrice || order.requestedPrice, 2, locale);
          const statusTone: PendingOrderRow['statusTone'] =
            order.status === 'pending' ? 'amber' : order.status === 'closed' ? 'muted' : order.direction === 'buy' ? 'down' : 'up';
          return {
            canEdit: true,
            direction: order.direction,
            id: order.id,
            lots: formatNumber(order.lots, 2, locale),
            priceRange: `${price} - ${price}`,
            status: statusLabel(order.status, locale),
            statusTone,
            symbol: order.symbol,
            type: order.type,
          };
        })
      : getDemoOrderRows(locale);
  const historyRows = getHistoryOrderRows(locale);
  const confirmClose = (positionId: string, symbol: string) => {
    const close = () => {
      closePosition(positionId);
      void notifySuccess();
      toast.show({
        message: t('portfolio.closeSuccessMessage', { symbol }),
        title: t('portfolio.closeSuccessTitle'),
        tone: 'success',
      });
    };

    void notifyWarning();

    if (Platform.OS === 'web') {
      if (window.confirm(t('portfolio.closeConfirmMessage', { symbol }))) {
        close();
      }
      return;
    }

    Alert.alert(t('portfolio.closeConfirmTitle'), t('portfolio.closeConfirmMessage', { symbol }), [
      { style: 'cancel', text: t('common.cancel') },
      { onPress: close, style: 'destructive', text: t('common.confirm') },
    ]);
  };
  const openAccountSwitcher = () => {
    bottomSheet.show(
      <AccountSwitchSheet
        accounts={accountProfiles}
        onSelect={(nextId) => {
          setSelectedAccountId(nextId);
          bottomSheet.hide();
        }}
        selectedId={selectedAccount.id}
      />,
    );
  };
  const openAccountMenu = () => {
    bottomSheet.show(
      <AccountMenuSheet
        account={selectedAccount}
        onViewDetails={() => {
          bottomSheet.hide();
          router.push(`/account-details/${selectedAccount.id}`);
        }}
      />,
    );
  };
  const openPositionOptions = () => {
    bottomSheet.show(
      <PositionOptionsSheet
        onAction={(title) => {
          toast.show({
            message: locale === 'en-US' ? 'Demo action only. No live position was changed.' : '当前为演示操作，未改变真实持仓。',
            title,
            tone: 'default',
          });
        }}
      />,
    );
  };
  const openPositionDetail = (position: (typeof positionRows)[number]) => {
    bottomSheet.show(
      <PositionDetailSheet
        onClose={() => {
          bottomSheet.hide();
          if (position.closable) {
            confirmClose(position.id, position.symbol);
          } else {
            toast.show({
              message: locale === 'en-US' ? 'Demo rows cannot be closed.' : '演示持仓暂不支持平仓。',
              title: locale === 'en-US' ? 'Demo position' : '演示持仓',
              tone: 'warning',
            });
          }
        }}
        onModify={() => {
          toast.show({
            message: locale === 'en-US' ? 'Modify position is a demo action in this MVP.' : '当前为演示修改入口，暂不修改持仓。',
            title: locale === 'en-US' ? 'Modify Position' : '修改持仓',
            tone: 'default',
          });
        }}
        position={position}
      />,
    );
  };
  const openClosedOrderDetail = (order: HistoryOrderRow) => {
    bottomSheet.show(<ClosedOrderDetailSheet order={order} />);
  };
  const openPendingOrderDetail = (order: (typeof orderRows)[number]) => {
    bottomSheet.show(
      <PendingOrderDetailSheet
        onDelete={() => {
          bottomSheet.hide();
          if (!order.canEdit) {
            toast.show({
              message: locale === 'en-US' ? 'Demo pending rows cannot be deleted.' : '演示挂单暂不支持删除。',
              title: locale === 'en-US' ? 'Demo order' : '演示订单',
              tone: 'warning',
            });
            return;
          }

          deleteOrder(order.id);
          toast.show({
            message: locale === 'en-US' ? `${order.symbol} pending order was deleted in this local demo.` : `${order.symbol} 挂单已在本地演示中删除。`,
            title: locale === 'en-US' ? 'Order deleted' : '订单已删除',
            tone: 'success',
          });
        }}
        onModify={() => {
          bottomSheet.hide();
          if (!order.canEdit) {
            toast.show({
              message: locale === 'en-US' ? 'Demo pending rows cannot be modified.' : '演示挂单暂不支持修改。',
              title: locale === 'en-US' ? 'Demo order' : '演示订单',
              tone: 'warning',
            });
            return;
          }

          modifyOrder(order.id);
          toast.show({
            message: locale === 'en-US' ? `${order.symbol} lots were adjusted in this local demo.` : `${order.symbol} 手数已在本地演示中调整。`,
            title: locale === 'en-US' ? 'Order modified' : '订单已修改',
            tone: 'success',
          });
        }}
        order={order}
      />,
    );
  };

  return (
    <Screen title={t('portfolio.title')}>
      <Card compact style={styles.accountPanel}>
        <View style={styles.accountPanelTop}>
          <View style={styles.accountPanelSpacer} />
          <View style={styles.accountCenter}>
            <AppText tone={account.equity >= 0 ? 'down' : 'up'} variant="largeNumber">
              {formatMoney(account.equity, account.currency, 2, locale)}
            </AppText>
            <NativePressable
              accessibilityLabel={locale === 'en-US' ? 'Switch trading account' : '切换交易账号'}
              minTouch={36}
              onPress={openAccountSwitcher}
              style={styles.accountSelector}>
              <AppText numberOfLines={1} variant="subtitle">
                {locale === 'en-US' ? `Margin Account (${accountSuffix})` : `保证金账户 (${accountSuffix})`}
              </AppText>
              <PhosphorIcon color={palette.text} name="caret-down" size={18} />
            </NativePressable>
          </View>
          <NativePressable
            accessibilityLabel={locale === 'en-US' ? 'Account menu' : '账户菜单'}
            minTouch={44}
            onPress={openAccountMenu}
            style={StyleSheet.flatten([styles.accountMenuButton, { backgroundColor: palette.panelSoft }])}>
            <PhosphorIcon color={palette.text} name="sliders-horizontal" size={22} />
          </NativePressable>
        </View>

        <View style={styles.accountStats}>
          <AccountStat label={t('account.balance')} value={formatNumber(account.balance, 2, locale)} />
          <AccountStat label={t('account.equity')} value={formatNumber(account.equity, 2, locale)} />
          <AccountStat label={t('account.usedMargin')} value={formatNumber(account.usedMargin, 2, locale)} />
          <AccountStat label={t('account.availableMargin')} value={formatNumber(account.freeMargin, 2, locale)} />
          <AccountStat label={`${t('account.marginRate')} (%)`} value={marginLevel} />
        </View>
      </Card>

      <OrderViewTabs current={orderView} onChange={setOrderView} />

      {orderView === 'positions' ? (
        <>
          <OrderSectionHeader
            accessibilityLabel={locale === 'en-US' ? 'Position display and bulk actions' : '持仓显示与批量操作'}
            onPress={openPositionOptions}
            title={t('portfolio.current')}
          />
          <Card compact style={styles.listCard}>
            {positionRows.map((position, index) => (
              <NativePressable
                accessibilityLabel={`${position.symbol} ${directionLabel(position.direction, locale)}`}
                key={position.id}
                minTouch={64}
                onPress={() => openPositionDetail(position)}
                style={StyleSheet.flatten([styles.tradeRow, index < positionRows.length - 1 && { borderBottomColor: palette.lineSoft, borderBottomWidth: 1 }])}>
                <TradeDirectionIcon direction={position.direction} />
                <View style={styles.tradeRowMain}>
                  <View style={styles.inlineTitle}>
                    <AppText numberOfLines={1} variant="subtitle">
                      {position.symbol}
                    </AppText>
                    <AppText numberOfLines={1} tone={position.direction === 'buy' ? 'down' : 'up'} variant="subtitle">
                      {directionLabel(position.direction, locale).toLowerCase()} {position.lots}
                    </AppText>
                  </View>
                  <AppText numberOfLines={1} tone="muted" variant="caption">
                    {position.openPrice} - {position.currentPrice}
                  </AppText>
                </View>
                <AppText tone={position.pnl >= 0 ? 'down' : 'up'} variant="number">
                  {formatNumber(position.pnl, 2, locale)}
                </AppText>
              </NativePressable>
            ))}
          </Card>
        </>
      ) : null}

      {orderView === 'pending' ? (
        <>
          <OrderSectionHeader title={t('portfolio.orderRecords')} />
          <Card compact>
            {orderRows.map((order, index) => (
              <NativePressable
                accessibilityLabel={`${order.symbol} ${directionLabel(order.direction, locale)} ${order.type}`}
                key={order.id}
                minTouch={64}
                onPress={() => openPendingOrderDetail(order)}
                style={StyleSheet.flatten([styles.tradeRow, index < orderRows.length - 1 && { borderBottomColor: palette.lineSoft, borderBottomWidth: 1 }])}>
                <TradeDirectionIcon direction={order.direction} />
                <View style={styles.tradeRowMain}>
                  <View style={styles.inlineTitle}>
                    <AppText numberOfLines={1} variant="subtitle">
                      {order.symbol}
                    </AppText>
                    <AppText numberOfLines={1} tone={order.direction === 'buy' ? 'down' : 'up'} variant="subtitle">
                      {directionLabel(order.direction, locale).toLowerCase()} {order.type === 'limit' ? 'limit ' : ''}{order.lots}
                    </AppText>
                  </View>
                  <AppText numberOfLines={1} tone="muted" variant="caption">
                    {order.priceRange}
                  </AppText>
                </View>
                <AppText tone={order.statusTone === 'amber' ? 'amber' : order.statusTone === 'up' ? 'up' : order.statusTone === 'down' ? 'down' : 'dim'} variant="subtitle">
                  {order.status}
                </AppText>
                <PhosphorIcon color={palette.textDim} name="caret-right" size={14} />
              </NativePressable>
            ))}
          </Card>
        </>
      ) : null}

      {orderView === 'history' ? <HistoryOrdersView orders={historyRows} onOpenOrder={openClosedOrderDetail} /> : null}
    </Screen>
  );
}

function OrderViewTabs({
  current,
  onChange,
}: {
  current: 'history' | 'pending' | 'positions';
  onChange: (view: 'history' | 'pending' | 'positions') => void;
}) {
  const { locale, palette } = useProductSettings();
  const items: { id: 'history' | 'pending' | 'positions'; label: string }[] = [
    { id: 'positions', label: locale === 'en-US' ? 'Position' : '持仓' },
    { id: 'pending', label: locale === 'en-US' ? 'Pending' : '挂单' },
    { id: 'history', label: locale === 'en-US' ? 'History' : '历史' },
  ];

  return (
    <View style={StyleSheet.flatten([styles.orderTabs, { borderBottomColor: palette.lineSoft }])}>
      {items.map((item) => {
        const selected = current === item.id;
        return (
          <NativePressable
            accessibilityLabel={item.label}
            key={item.id}
            minTouch={44}
            onPress={() => onChange(item.id)}
            style={styles.orderTabButton}>
            <AppText style={{ color: selected ? palette.text : palette.textMuted }} variant="subtitle">
              {item.label}
            </AppText>
            <View style={StyleSheet.flatten([styles.orderTabIndicator, { backgroundColor: selected ? palette.text : 'transparent' }])} />
          </NativePressable>
        );
      })}
    </View>
  );
}

function AccountMenuSheet({ account, onViewDetails }: { account: TradingAccountProfile; onViewDetails: () => void }) {
  const { locale, palette } = useProductSettings();
  const status = getAccountStatusLabel(account.group, locale);
  const readOnly = account.group === 'readOnly';
  const actionItems = [
    { color: palette.down, icon: 'bank' as const, label: 'Deposit' },
    { color: palette.amber, icon: 'arrow-clockwise' as const, label: 'Withdraw' },
    { color: palette.blue, icon: 'arrows-left-right' as const, label: 'Transfer' },
  ];
  const menuItems = [
    { icon: 'identification-card' as const, label: 'Profile' },
    { icon: 'clock' as const, label: 'Order History' },
    { icon: 'bank' as const, label: 'Balance' },
    { icon: 'arrows-left-right' as const, label: 'Swap' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.accountMenuSheet} showsVerticalScrollIndicator={false} style={styles.accountMenuScroll}>
      <View style={styles.menuAccountHeader}>
        <AppText style={styles.menuAccountNo} variant="largeNumber">
          {account.accountNo}
        </AppText>
        <AppText tone="muted" variant="subtitle">
          Margin Account · {account.currency}
        </AppText>
        <View style={StyleSheet.flatten([styles.menuStatusBadge, { backgroundColor: readOnly ? `${palette.amber}18` : `${palette.down}14` }])}>
          <PhosphorIcon color={readOnly ? palette.amber : palette.down} name={readOnly ? 'lock' : 'check-circle'} size={16} />
          <AppText style={{ color: readOnly ? palette.amber : palette.down }} variant="body">
            {status}
          </AppText>
        </View>
      </View>

      <View style={styles.menuActionGrid}>
        {actionItems.map((item) => (
          <NativePressable
            accessibilityLabel={item.label}
            key={item.label}
            minTouch={86}
            style={StyleSheet.flatten([styles.menuActionTile, { backgroundColor: palette.panel, borderColor: palette.lineSoft }])}>
            <PhosphorIcon color={item.color} name={item.icon} size={30} />
            <AppText variant="subtitle">{item.label}</AppText>
          </NativePressable>
        ))}
      </View>

      <View style={StyleSheet.flatten([styles.menuList, { backgroundColor: palette.panel, borderColor: palette.lineSoft }])}>
        {menuItems.map((item, index) => (
          <NativePressable
            accessibilityLabel={item.label}
            key={item.label}
            minTouch={58}
            style={StyleSheet.flatten([styles.menuListRow, index < menuItems.length - 1 && { borderBottomColor: palette.lineSoft, borderBottomWidth: 1 }])}>
            <View style={styles.menuRowLeft}>
              <PhosphorIcon color={palette.text} name={item.icon} size={24} />
              <AppText variant="subtitle">{item.label}</AppText>
            </View>
            <PhosphorIcon color={palette.textDim} name="caret-right" size={20} />
          </NativePressable>
        ))}
      </View>

      <NativePressable
        accessibilityLabel="View Account Details"
        minTouch={58}
        onPress={onViewDetails}
        style={StyleSheet.flatten([styles.viewDetailsButton, { backgroundColor: palette.panel, borderColor: palette.lineSoft }])}>
        <AppText style={{ color: palette.blue }} variant="subtitle">
          View Account Details
        </AppText>
      </NativePressable>
    </ScrollView>
  );
}

function PositionOptionsSheet({ onAction }: { onAction: (title: string) => void }) {
  const { palette } = useProductSettings();
  const viewModes = [
    {
      description: 'Display positions by single order',
      icon: 'list-checks' as const,
      label: 'By Order',
    },
    {
      description: 'Group positions by symbol',
      icon: 'qr-code' as const,
      label: 'By Symbol',
    },
  ];
  const bulkActions = [
    {
      description: 'Close every open position',
      icon: 'x' as const,
      label: 'Close All Positions',
    },
    {
      description: 'Close positions in loss',
      icon: 'check-circle' as const,
      label: 'Close Losing Positions',
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.positionOptionsSheet} showsVerticalScrollIndicator={false} style={styles.positionOptionsScroll}>
      <SheetGroupTitle title="View Mode" />
      <View style={StyleSheet.flatten([styles.optionGroupCard, { backgroundColor: palette.panel, borderColor: palette.lineSoft }])}>
        {viewModes.map((item, index) => (
          <PositionOptionRow
            description={item.description}
            icon={item.icon}
            key={item.label}
            label={item.label}
            onPress={() => onAction(item.label)}
            showDivider={index < viewModes.length - 1}
          />
        ))}
      </View>

      <SheetGroupTitle title="Bulk Actions" />
      <View style={StyleSheet.flatten([styles.optionGroupCard, { backgroundColor: palette.panel, borderColor: palette.lineSoft }])}>
        {bulkActions.map((item, index) => (
          <PositionOptionRow
            description={item.description}
            icon={item.icon}
            key={item.label}
            label={item.label}
            onPress={() => onAction(item.label)}
            showDivider={index < bulkActions.length - 1}
          />
        ))}
      </View>
    </ScrollView>
  );
}

type PositionDetailRow = {
  closable: boolean;
  currentPrice: string;
  direction: 'buy' | 'sell';
  id: string;
  lots: string;
  openPrice: string;
  pnl: number;
  symbol: string;
};

type PendingOrderRow = {
  canEdit: boolean;
  direction: 'buy' | 'sell';
  id: string;
  lots: string;
  priceRange: string;
  status: string;
  statusTone: 'amber' | 'muted' | 'down' | 'up';
  symbol: string;
  type: 'market' | 'limit';
};

function PendingOrderDetailSheet({
  onDelete,
  onModify,
  order,
}: {
  onDelete: () => void;
  onModify: () => void;
  order: PendingOrderRow;
}) {
  const { locale, palette } = useProductSettings();
  const direction = directionLabel(order.direction, locale).toLowerCase();
  const details = [
    { label: locale === 'en-US' ? 'Symbol' : '品种', value: order.symbol },
    { label: locale === 'en-US' ? 'Direction' : '交易方向', value: `${direction} ${order.lots}` },
    { label: locale === 'en-US' ? 'Order type' : '订单类型', value: order.type },
    { label: locale === 'en-US' ? 'Price' : '价格', value: order.priceRange },
    { label: locale === 'en-US' ? 'Status' : '状态', value: order.status },
  ];

  return (
    <ScrollView contentContainerStyle={styles.positionDetailSheet} showsVerticalScrollIndicator={false} style={styles.positionDetailScroll}>
      <View style={styles.positionDetailHero}>
        <AppText variant="title">{locale === 'en-US' ? 'Pending Order' : '挂单详情'}</AppText>
        <View style={styles.inlineTitle}>
          <AppText variant="subtitle">{order.symbol}</AppText>
          <AppText tone={order.direction === 'buy' ? 'down' : 'up'} variant="subtitle">
            {direction} {order.lots}
          </AppText>
        </View>
        <AppText tone="muted" variant="caption">{order.priceRange}</AppText>
      </View>

      <View style={StyleSheet.flatten([styles.positionDetailCard, { backgroundColor: palette.panel, borderColor: palette.lineSoft }])}>
        {details.map((item, index) => (
          <View
            key={item.label}
            style={StyleSheet.flatten([styles.positionDetailRow, index < details.length - 1 && { borderBottomColor: palette.lineSoft, borderBottomWidth: 1 }])}>
            <AppText variant="subtitle">{item.label}</AppText>
            <AppText numberOfLines={1} variant="subtitle">
              {item.value}
            </AppText>
          </View>
        ))}
      </View>

      <View style={StyleSheet.flatten([styles.positionActionCard, { backgroundColor: palette.panel, borderColor: palette.lineSoft }])}>
        <NativePressable accessibilityLabel={locale === 'en-US' ? 'Modify order' : '修改订单'} minTouch={62} onPress={onModify} style={styles.positionActionButton}>
          <AppText variant="title">{locale === 'en-US' ? 'Modify Order' : '修改订单'}</AppText>
          <PhosphorIcon color={palette.text} name="sliders-horizontal" size={28} />
        </NativePressable>
        <View style={StyleSheet.flatten([styles.positionActionDivider, { backgroundColor: palette.lineSoft }])} />
        <NativePressable accessibilityLabel={locale === 'en-US' ? 'Delete order' : '删除订单'} minTouch={62} onPress={onDelete} style={styles.positionActionButton}>
          <AppText style={{ color: palette.up }} variant="title">
            {locale === 'en-US' ? 'Delete Order' : '删除订单'}
          </AppText>
          <PhosphorIcon color={palette.up} name="x" size={28} />
        </NativePressable>
      </View>
    </ScrollView>
  );
}

function PositionDetailSheet({
  onClose,
  onModify,
  position,
}: {
  onClose: () => void;
  onModify: () => void;
  position: PositionDetailRow;
}) {
  const { locale, palette } = useProductSettings();
  const direction = directionLabel(position.direction, locale).toLowerCase();
  const details = [
    { label: locale === 'en-US' ? 'Symbol' : '品种', value: position.symbol },
    { label: locale === 'en-US' ? 'Direction' : '交易方向', value: `${direction} ${position.lots}` },
    { label: 'Ticket', value: '#3339900' },
    { label: 'Commission', value: '-10.00' },
    { label: 'Swap', value: '-7.00' },
    { label: 'Open Time', value: '05/01/2026 14:22:39' },
    { label: 'Stop Loss', value: '--' },
    { label: 'Take Profit', value: '--' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.positionDetailSheet} showsVerticalScrollIndicator={false} style={styles.positionDetailScroll}>
      <View style={styles.positionDetailHero}>
        <AppText style={{ color: position.pnl >= 0 ? palette.down : palette.up }} variant="largeNumber">
          {formatMoney(position.pnl, 'USD', 2, locale)}
        </AppText>
        <AppText variant="title">Unrealized PnL</AppText>
        <AppText variant="subtitle">
          {position.openPrice} - {position.currentPrice}
        </AppText>
      </View>

      <View style={StyleSheet.flatten([styles.positionDetailCard, { backgroundColor: palette.panel, borderColor: palette.lineSoft }])}>
        {details.map((item, index) => (
          <View
            key={item.label}
            style={StyleSheet.flatten([styles.positionDetailRow, index < details.length - 1 && { borderBottomColor: palette.lineSoft, borderBottomWidth: 1 }])}>
            <AppText variant="subtitle">{item.label}</AppText>
            <AppText numberOfLines={1} variant="subtitle">
              {item.value}
            </AppText>
          </View>
        ))}
      </View>

      <View style={StyleSheet.flatten([styles.positionActionCard, { backgroundColor: palette.panel, borderColor: palette.lineSoft }])}>
        <NativePressable accessibilityLabel="Modify Position" minTouch={62} onPress={onModify} style={styles.positionActionButton}>
          <AppText variant="title">Modify Position</AppText>
          <PhosphorIcon color={palette.text} name="sliders-horizontal" size={28} />
        </NativePressable>
        <View style={StyleSheet.flatten([styles.positionActionDivider, { backgroundColor: palette.lineSoft }])} />
        <NativePressable accessibilityLabel="Close Position" minTouch={62} onPress={onClose} style={styles.positionActionButton}>
          <AppText style={{ color: palette.up }} variant="title">
            Close Position
          </AppText>
          <PhosphorIcon color={palette.up} name="x" size={28} />
        </NativePressable>
      </View>
    </ScrollView>
  );
}

type HistoryOrderRow = {
  closeTime: string;
  commission: number;
  dealId: string;
  delta: string;
  direction: 'buy' | 'sell';
  id: string;
  lots: string;
  openTime: string;
  priceRange: string;
  pnl: number;
  symbol: string;
  swap: number;
};

function HistoryOrdersView({ onOpenOrder, orders }: { onOpenOrder: (order: HistoryOrderRow) => void; orders: HistoryOrderRow[] }) {
  const { locale, palette } = useProductSettings();
  const realized = orders.reduce((total, order) => total + order.pnl, 0);
  const volume = orders.reduce((total, order) => total + Number(order.lots), 0);

  return (
    <>
      <View style={styles.historyMetricHeader}>
        <View>
          <AppText variant="largeNumber">{formatMoney(realized, 'USD', 2, locale)}</AppText>
          <AppText tone="muted" variant="body">Realized P/L</AppText>
        </View>
        <FilterPill icon="clock" label="Last 30 days" />
      </View>
      <MiniBarChart color={palette.down} values={[190, 420, 70, 1600, 180, 7600, 180, 1200]} />
      <View style={styles.chartLegend}>
        <View style={StyleSheet.flatten([styles.legendDot, { backgroundColor: palette.down }])} />
        <AppText tone="muted" variant="body">Profit</AppText>
        <View style={StyleSheet.flatten([styles.legendDot, { backgroundColor: palette.up, marginLeft: 14 }])} />
        <AppText tone="muted" variant="body">Loss</AppText>
      </View>

      <View style={StyleSheet.flatten([styles.historyDivider, { backgroundColor: palette.lineSoft }])} />

      <View style={styles.historyMetricHeader}>
        <View>
          <AppText variant="largeNumber">{formatNumber(volume, 2, locale)}</AppText>
          <AppText tone="muted" variant="body">Volume</AppText>
        </View>
        <View style={styles.historyFilterRow}>
          <FilterPill icon="bank" label="Symbols" />
          <FilterPill icon="clock" label="Last 30 days" />
        </View>
      </View>
      <MiniBarChart color="#FF7A1A" maxValue={100} values={[10, 42, 3, 16, 9, 28, 9, 26]} />
      <View style={styles.chartLegend}>
        <View style={StyleSheet.flatten([styles.legendDot, { backgroundColor: '#FF7A1A' }])} />
        <AppText tone="muted" variant="body">Standard lots</AppText>
      </View>

      <View style={StyleSheet.flatten([styles.historyDivider, { backgroundColor: palette.lineSoft }])} />

      <View style={styles.historyTitleRow}>
        <AppText variant="title">Orders History</AppText>
      </View>
      <View style={styles.historyToolbar}>
        <FilterPill icon="clock" label="Last 7 days" />
        <FilterPill icon="sliders-horizontal" label="Sort" />
      </View>
      <AppText tone="muted" variant="body">
        Total Volume {formatNumber(volume, 2, locale)} lot  Realized P/L {formatMoney(realized, 'USD', 2, locale)}
      </AppText>
      <Card compact style={styles.historyListCard}>
        {orders.map((order, index) => (
          <NativePressable
            accessibilityLabel={`${order.symbol} ${order.direction} ${order.lots}`}
            key={order.id}
            minTouch={62}
            onPress={() => onOpenOrder(order)}
            style={StyleSheet.flatten([styles.tradeRow, index < orders.length - 1 && { borderBottomColor: palette.lineSoft, borderBottomWidth: 1 }])}>
            <TradeDirectionIcon direction={order.direction} />
            <View style={styles.tradeRowMain}>
              <View style={styles.inlineTitle}>
                {order.direction === 'sell' ? (
                  <View style={StyleSheet.flatten([styles.sellBadge, { backgroundColor: `${palette.down}14` }])}>
                    <PhosphorIcon color={palette.down} name="chart-line-up" size={14} />
                    <AppText tone="down" variant="caption">Sell</AppText>
                  </View>
                ) : null}
                <AppText variant="subtitle">{order.symbol}</AppText>
                <AppText tone={order.direction === 'buy' ? 'down' : 'up'} variant="subtitle">
                  {order.direction} {order.lots}
                </AppText>
              </View>
              <AppText tone="muted" variant="caption">{order.priceRange}</AppText>
            </View>
            <AppText tone={order.pnl >= 0 ? 'down' : 'up'} variant="number">
              {formatNumber(order.pnl, 2, locale)}
            </AppText>
          </NativePressable>
        ))}
      </Card>
    </>
  );
}

function FilterPill({ icon, label }: { icon: 'bank' | 'clock' | 'sliders-horizontal'; label: string }) {
  const { palette } = useProductSettings();
  return (
    <View style={StyleSheet.flatten([styles.filterPill, { backgroundColor: palette.panel, borderColor: palette.line }])}>
      <PhosphorIcon color={palette.text} name={icon} size={15} />
      <AppText variant="body">{label}</AppText>
    </View>
  );
}

function MiniBarChart({ color, maxValue, values }: { color: string; maxValue?: number; values: number[] }) {
  const { palette } = useProductSettings();
  const max = maxValue ?? Math.max(...values);
  return (
    <View style={styles.barChartWrap}>
      {[10000, 2000, 1000, 200, 0].map((tick) => (
        <View key={tick} style={styles.chartGridRow}>
          <AppText tone="dim" variant="caption">{tick >= 1000 ? `${tick / 1000}k` : `${tick}`}</AppText>
          <View style={StyleSheet.flatten([styles.chartGridLine, { backgroundColor: palette.lineSoft }])} />
        </View>
      ))}
      <View style={styles.barRow}>
        {values.map((value, index) => (
          <View key={`${value}-${index}`} style={styles.barSlot}>
            <View style={StyleSheet.flatten([styles.barFill, { backgroundColor: color, height: `${Math.max(6, Math.min(100, (value / max) * 100))}%` }])} />
          </View>
        ))}
      </View>
      <View style={styles.chartDateRow}>
        <AppText tone="dim" variant="caption">02 Jul</AppText>
        <AppText tone="dim" variant="caption">12 Jul</AppText>
        <AppText tone="dim" variant="caption">22 Jul</AppText>
        <AppText tone="dim" variant="caption">28 Jul</AppText>
      </View>
    </View>
  );
}

function ClosedOrderDetailSheet({ order }: { order: HistoryOrderRow }) {
  const { palette } = useProductSettings();
  const details = [
    ['Open time', order.openTime],
    ['Close time', order.closeTime],
    ['Commission / Swap', `${formatNumber(order.commission, 2, 'en-US')} / ${formatNumber(order.swap, 2, 'en-US')}`],
    ['SL / TP', '-/-'],
  ];
  const deals = [0, 1, 2, 3];

  return (
    <ScrollView contentContainerStyle={styles.closedOrderSheet} showsVerticalScrollIndicator={false} style={styles.closedOrderScroll}>
      <AppText variant="title">Ticket #14808934</AppText>
      <View style={StyleSheet.flatten([styles.closedOrderCard, { backgroundColor: palette.panel, borderColor: palette.lineSoft }])}>
        <View style={styles.closedOrderTop}>
          <View>
            <View style={styles.inlineTitle}>
              <AppText variant="title">{order.symbol}</AppText>
              <AppText tone={order.direction === 'buy' ? 'down' : 'up'} variant="title">
                {order.direction} {order.lots}
              </AppText>
            </View>
            <AppText tone="muted" variant="subtitle">{order.priceRange}</AppText>
          </View>
          <View style={styles.closedOrderPnl}>
            <AppText tone={order.pnl >= 0 ? 'down' : 'up'} variant="title">{formatNumber(order.pnl, 2, 'en-US')}</AppText>
            <AppText tone={order.pnl >= 0 ? 'down' : 'up'} variant="body">{order.delta}</AppText>
          </View>
        </View>
        {details.map(([label, value]) => (
          <View key={label} style={styles.closedDetailRow}>
            <AppText tone="muted" variant="body">{label}</AppText>
            <AppText variant="body">{value}</AppText>
          </View>
        ))}
      </View>

      <View style={StyleSheet.flatten([styles.closedOrderCard, { backgroundColor: palette.panel, borderColor: palette.lineSoft }])}>
        <AppText style={styles.dealsTitle} variant="subtitle">Deals (3)</AppText>
        {deals.map((deal, index) => (
          <View key={deal} style={StyleSheet.flatten([styles.dealRow, index < deals.length - 1 && { borderBottomColor: palette.lineSoft, borderBottomWidth: 1 }])}>
            <View style={styles.tradeRowMain}>
              <AppText variant="subtitle">{order.symbol} {order.lots}</AppText>
              <AppText tone="muted" variant="body">{order.priceRange}</AppText>
              {index === 1 ? (
                <View style={styles.dealMeta}>
                  <DetailInline label="Deal" value={order.dealId} />
                  <DetailInline label="Swap" value="0.90" />
                  <DetailInline label="Open time" value={order.openTime} />
                  <DetailInline label="Close time" value={order.closeTime} />
                </View>
              ) : null}
            </View>
            <View style={styles.closedOrderPnl}>
              <AppText tone="down" variant="subtitle">{formatNumber(order.pnl, 2, 'en-US')}</AppText>
              <AppText tone="down" variant="body">{order.delta}</AppText>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

function DetailInline({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailInline}>
      <AppText tone="muted" variant="body">{label}</AppText>
      <AppText variant="body">{value}</AppText>
    </View>
  );
}

function SheetGroupTitle({ title }: { title: string }) {
  return (
    <AppText tone="muted" variant="title">
      {title}
    </AppText>
  );
}

function PositionOptionRow({
  description,
  icon,
  label,
  onPress,
  showDivider,
}: {
  description: string;
  icon: 'check-circle' | 'list-checks' | 'qr-code' | 'x';
  label: string;
  onPress: () => void;
  showDivider?: boolean;
}) {
  const { palette } = useProductSettings();

  return (
    <NativePressable
      accessibilityLabel={label}
      minTouch={76}
      onPress={onPress}
      style={StyleSheet.flatten([styles.positionOptionRow, showDivider && { borderBottomColor: palette.lineSoft, borderBottomWidth: 1 }])}>
      <View style={styles.optionIconWrap}>
        <PhosphorIcon color={palette.text} name={icon} size={28} />
      </View>
      <View style={styles.optionTextBlock}>
        <AppText variant="title">{label}</AppText>
        <AppText tone="muted" variant="subtitle">
          {description}
        </AppText>
      </View>
    </NativePressable>
  );
}

function AccountSwitchSheet({
  accounts,
  onSelect,
  selectedId,
}: {
  accounts: TradingAccountProfile[];
  onSelect: (id: string) => void;
  selectedId: string;
}) {
  const { locale, palette } = useProductSettings();
  const groups: { id: TradingAccountStatus; title: string }[] = [
    { id: 'active', title: 'Active' },
    { id: 'readOnly', title: 'Read Only' },
    { id: 'disabled', title: 'Disabled' },
    { id: 'demo', title: 'Demo' },
    { id: 'archived', title: 'Archived' },
  ];

  return (
    <View style={styles.sheetBody}>
      <View style={styles.sheetHeader}>
        <View style={styles.sheetHeaderSide} />
        <AppText variant="title">Accounts</AppText>
        <NativePressable minTouch={44} style={StyleSheet.flatten([styles.sheetAddButton, { backgroundColor: palette.panel }])}>
          <PhosphorIcon color={palette.text} name="user-plus" size={22} />
        </NativePressable>
      </View>

      <ScrollView contentContainerStyle={styles.sheetContent} showsVerticalScrollIndicator={false}>
        {groups.map((group) => {
          const groupedAccounts = accounts.filter((profile) => profile.group === group.id);
          if (groupedAccounts.length === 0) {
            return null;
          }

          return (
            <View key={group.id} style={styles.sheetGroup}>
              <AppText tone="muted" variant="subtitle">
                {group.title} ({groupedAccounts.length})
              </AppText>
              {groupedAccounts.map((profile) => (
                <SwitchAccountCard
                  key={profile.id}
                  onPress={() => onSelect(profile.id)}
                  profile={profile}
                  selected={profile.id === selectedId}
                />
              ))}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

function SwitchAccountCard({ onPress, profile, selected }: { onPress: () => void; profile: TradingAccountProfile; selected: boolean }) {
  const { locale, palette } = useProductSettings();
  const status = profile.group !== 'active' && profile.group !== 'demo' ? getAccountStatusLabel(profile.group, locale) : '';
  const statusTone = profile.group === 'disabled' || profile.group === 'archived' ? palette.up : palette.amber;

  return (
    <NativePressable
      accessibilityLabel={`${profile.accountNo} ${selected ? 'selected' : ''}`}
      minTouch={96}
      onPress={onPress}
      style={StyleSheet.flatten([
        styles.switchAccountCard,
        { backgroundColor: palette.panel, borderColor: selected ? palette.text : palette.lineSoft },
      ])}>
      <View style={StyleSheet.flatten([styles.switchWalletIcon, { backgroundColor: palette.panelSoft }])}>
        <PhosphorIcon color={palette.text} name="bank" size={18} />
      </View>
      <View style={styles.switchAccountBody}>
        <View style={styles.switchTop}>
          <View style={styles.switchTitleBlock}>
            <View style={styles.switchTitleRow}>
              <AppText variant="subtitle">{profile.accountNo}</AppText>
              {status ? (
                <View style={StyleSheet.flatten([styles.switchStatusBadge, { backgroundColor: `${statusTone}14` }])}>
                  <AppText style={{ color: statusTone }} variant="caption">
                    {status}
                  </AppText>
                </View>
              ) : null}
            </View>
            <AppText tone="muted" variant="caption">
              🇺🇸 {profile.currency} · {profile.platform} · {profile.type}
            </AppText>
          </View>
          <View style={StyleSheet.flatten([styles.radio, { borderColor: palette.text }])}>
            {selected ? <View style={StyleSheet.flatten([styles.radioDot, { backgroundColor: palette.text }])} /> : null}
          </View>
        </View>
        <View style={StyleSheet.flatten([styles.switchDivider, { backgroundColor: palette.lineSoft }])} />
        <View style={styles.switchValues}>
          <View style={styles.switchValueCell}>
            <AppText variant="title">{formatMoney(profile.equity, profile.currency, 2, locale)}</AppText>
            <AppText variant="body">Account Equity</AppText>
          </View>
          <View style={styles.switchValueCell}>
            <AppText tone={profile.unrealizedPnl >= 0 ? 'down' : 'up'} variant="title">
              {formatMoney(profile.unrealizedPnl, profile.currency, 2, locale)}
            </AppText>
            <AppText variant="body">Unrealized PnL</AppText>
          </View>
        </View>
        <View style={StyleSheet.flatten([styles.switchDivider, { backgroundColor: palette.lineSoft }])} />
        <AppText tone="muted" variant="caption">
          Last trade {profile.lastTrade}
        </AppText>
      </View>
    </NativePressable>
  );
}

function AccountStat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.accountStatRow}>
      <AppText variant="body">{label}</AppText>
      <AppText variant="body">{value}</AppText>
    </View>
  );
}

function OrderSectionHeader({ accessibilityLabel, onPress, title }: { accessibilityLabel?: string; onPress?: () => void; title: string }) {
  const { palette } = useProductSettings();
  return (
    <View style={styles.sectionTitle}>
      <AppText variant="subtitle">{title}</AppText>
      {onPress ? (
        <NativePressable accessibilityLabel={accessibilityLabel ?? title} minTouch={36} onPress={onPress} style={styles.sectionAction}>
          <PhosphorIcon color={palette.text} name="dots-three" size={22} />
        </NativePressable>
      ) : (
        <PhosphorIcon color={palette.text} name="dots-three" size={22} />
      )}
    </View>
  );
}

function TradeDirectionIcon({ direction }: { direction: 'buy' | 'sell' }) {
  const { palette } = useProductSettings();
  const color = direction === 'buy' ? palette.down : palette.up;
  return (
    <View style={StyleSheet.flatten([styles.tradeIcon, { backgroundColor: palette.panelSoft }])}>
      <PhosphorIcon color={color} name="chart-line-up" size={20} />
    </View>
  );
}

function getDemoPositionRows(locale: 'en-US' | 'zh-CN') {
  return [
    { closable: false, currentPrice: '1888.87', direction: 'buy' as const, id: 'demo-pos-1', lots: '5.01', openPrice: '1887.87', pnl: 500, symbol: 'XAUUSD' },
    { closable: false, currentPrice: '1888.87', direction: 'buy' as const, id: 'demo-pos-2', lots: formatNumber(5, 0, locale), openPrice: '1887.87', pnl: -450, symbol: 'XAUUSD' },
    { closable: false, currentPrice: '1888.87', direction: 'sell' as const, id: 'demo-pos-3', lots: formatNumber(5, 0, locale), openPrice: '1887.87', pnl: -450, symbol: 'XAUUSD' },
    { closable: false, currentPrice: '1888.87', direction: 'sell' as const, id: 'demo-pos-4', lots: '2.54', openPrice: '1887.87', pnl: -450, symbol: 'XAUUSD' },
  ];
}

function getDemoOrderRows(locale: 'en-US' | 'zh-CN'): PendingOrderRow[] {
  const pending = locale === 'en-US' ? 'Pending' : 'Pending';
  return [
    { canEdit: false, direction: 'buy' as const, id: 'demo-order-1', lots: '5.01', priceRange: '1887.87 - 1888.87', status: pending, statusTone: 'amber', symbol: 'XAUUSD', type: 'limit' as const },
    { canEdit: false, direction: 'buy' as const, id: 'demo-order-2', lots: '5.01', priceRange: '1887.87 - 1888.87', status: pending, statusTone: 'amber', symbol: 'XAUUSD', type: 'limit' as const },
  ];
}

function getHistoryOrderRows(_locale: 'en-US' | 'zh-CN'): HistoryOrderRow[] {
  return [
    { closeTime: '15/04/2023 12:27:28', commission: 0, dealId: '90002333', delta: '△=10', direction: 'buy', id: 'hist-1', lots: '5.00', openTime: '15/04/2023 12:00:00', pnl: 500, priceRange: '1887.87 - 1888.87', symbol: 'XAUUSD', swap: -0.9 },
    { closeTime: '16/04/2023 15:18:10', commission: 0, dealId: '90002334', delta: '△=10', direction: 'buy', id: 'hist-2', lots: '5.00', openTime: '16/04/2023 14:42:00', pnl: 500, priceRange: '1887.87 - 1888.87', symbol: 'XAUUSD', swap: -0.9 },
    { closeTime: '18/04/2023 09:52:30', commission: 0, dealId: '90002335', delta: '△=10', direction: 'buy', id: 'hist-3', lots: '5.00', openTime: '18/04/2023 09:12:09', pnl: 500, priceRange: '1887.87 - 1888.87', symbol: 'XAUUSD', swap: -0.9 },
    { closeTime: '19/04/2023 18:22:42', commission: 0, dealId: '90002336', delta: '△=10', direction: 'sell', id: 'hist-4', lots: '5.00', openTime: '19/04/2023 17:11:00', pnl: -500, priceRange: '1887.87 - 1888.87', symbol: 'XAUUSD', swap: -0.9 },
    { closeTime: '22/04/2023 11:27:28', commission: 0, dealId: '90002337', delta: '△=10', direction: 'buy', id: 'hist-5', lots: '5.00', openTime: '22/04/2023 10:00:00', pnl: 500, priceRange: '1887.87 - 1888.87', symbol: 'XAUUSD', swap: -0.9 },
  ];
}

function PartnerClientsScreen() {
  const { partnerClients, upgradeRequest } = useBroker();
  const { locale, palette, t } = useProductSettings();
  const active = partnerClients.filter((client) => client.status === 'active').length;
  const volume = partnerClients.reduce((total, client) => total + client.monthlyVolume, 0);
  const pending = partnerClients.filter((client) => client.upgradeStatus === 'pending').length;

  return (
    <Screen title={t('portfolio.partnerTitle')}>
      <Card highlight>
        <View style={styles.metricRow}>
          <Metric label={t('partner.activeClients')} tone="down" value={`${active}`} />
          <Metric label={t('partner.clientVolume')} value={formatVolumeMillions(volume, locale)} />
          <Metric label={t('upgrade.pendingCount')} tone="amber" value={`${pending}`} />
        </View>
      </Card>

      {upgradeRequest.status === 'pending' ? (
        <View style={styles.sectionTitle}>
          <AppText variant="subtitle">{t('upgrade.pendingList')}</AppText>
          <AppText tone="amber" variant="caption">
            {upgradeRequest.applicantName}
          </AppText>
        </View>
      ) : null}

      {partnerClients.map((client) => (
        <Card key={client.id}>
          <View style={styles.positionTop}>
            <View>
              <AppText variant="subtitle">{client.name}</AppText>
              <AppText tone="muted" variant="caption">
                {client.country} · {client.joinedAt} · {localizeText(client.lastActive, locale)} · {client.role === 'partner' ? t('role.partner') : t('role.trader')}
              </AppText>
            </View>
            <View style={styles.badgeStack}>
              <View style={StyleSheet.flatten([styles.statusPill, { backgroundColor: palette.panelSoft, borderColor: palette.line }])}>
                <AppText tone={client.status === 'active' ? 'down' : client.status === 'funded' ? 'blue' : 'muted'} variant="caption">
                  {statusLabel(client.status, locale)}
                </AppText>
              </View>
              {client.upgradeStatus !== 'none' ? (
                <View
                  style={StyleSheet.flatten([
                    styles.statusPill,
                    {
                      backgroundColor: client.upgradeStatus === 'approved' ? `${palette.down}18` : client.upgradeStatus === 'pending' ? `${palette.amber}18` : palette.panelSoft,
                      borderColor: client.upgradeStatus === 'approved' ? palette.down : client.upgradeStatus === 'pending' ? palette.amber : palette.line,
                    },
                  ])}>
                  <AppText tone={client.upgradeStatus === 'approved' ? 'down' : client.upgradeStatus === 'pending' ? 'amber' : 'muted'} variant="caption">
                    {t(`upgrade.status.${client.upgradeStatus}`)}
                  </AppText>
                </View>
              ) : null}
            </View>
          </View>
          <View style={styles.grid}>
            <Metric label={t('partner.netDeposit')} value={formatMoney(client.netDeposit, 'USD', 2, locale)} />
            <Metric label={t('partner.monthVolume')} value={formatVolumeMillions(client.monthlyVolume, locale)} />
            <Metric label={t('partner.openPositions')} value={`${client.openPositions}`} />
          </View>
          <ActionButton label={t('upgrade.viewProfile')} onPress={() => router.push(`/client/${client.id}`)} tone={client.upgradeStatus === 'pending' ? 'amber' : 'neutral'} />
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  accountCenter: {
    alignItems: 'center',
    flex: 1,
    gap: 4,
    minWidth: 0,
  },
  accountMenuButton: {
    alignItems: 'center',
    borderRadius: 999,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  accountPanel: {
    borderRadius: 0,
    borderWidth: 0,
    gap: 18,
    marginHorizontal: -16,
    paddingHorizontal: 24,
    paddingVertical: 18,
  },
  accountPanelSpacer: {
    width: 44,
  },
  accountPanelTop: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  accountSelector: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    maxWidth: 260,
  },
  accountStatRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 25,
  },
  accountStats: {
    gap: 3,
  },
  badgeStack: {
    alignItems: 'flex-end',
    gap: 5,
  },
  barChartWrap: {
    height: 210,
    justifyContent: 'flex-end',
    marginTop: 4,
    position: 'relative',
  },
  barFill: {
    borderRadius: 3,
    width: 16,
  },
  barRow: {
    alignItems: 'flex-end',
    bottom: 26,
    flexDirection: 'row',
    gap: 20,
    height: 156,
    left: 42,
    position: 'absolute',
    right: 4,
  },
  barSlot: {
    alignItems: 'center',
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
  },
  chartDateRow: {
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    left: 48,
    position: 'absolute',
    right: 2,
  },
  chartGridLine: {
    flex: 1,
    height: 1,
  },
  chartGridRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    height: 32,
  },
  chartLegend: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  closedDetailRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 28,
  },
  closedOrderCard: {
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
    padding: 14,
  },
  closedOrderPnl: {
    alignItems: 'flex-end',
  },
  closedOrderScroll: {
    flexShrink: 1,
  },
  closedOrderSheet: {
    gap: 12,
    paddingBottom: 18,
    paddingHorizontal: 14,
    paddingTop: 18,
  },
  closedOrderTop: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  dealMeta: {
    gap: 6,
    marginTop: 12,
  },
  dealRow: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 12,
  },
  dealsTitle: {
    paddingBottom: 4,
  },
  detailInline: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterPill: {
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    minHeight: 34,
    paddingHorizontal: 9,
  },
  grid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
    marginTop: 12,
  },
  metricRow: {
    flexDirection: 'row',
    gap: 12,
  },
  accountMenuSheet: {
    gap: 16,
    paddingBottom: 18,
    paddingHorizontal: 14,
  },
  accountMenuScroll: {
    flexShrink: 1,
  },
  menuAccountHeader: {
    alignItems: 'center',
    gap: 5,
    paddingBottom: 4,
    paddingTop: 8,
  },
  menuAccountNo: {
    letterSpacing: 0,
  },
  menuActionGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  menuActionTile: {
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    flex: 1,
    gap: 8,
    minHeight: 104,
    paddingHorizontal: 8,
  },
  menuList: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  menuListRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  menuRowLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
  },
  menuStatusBadge: {
    alignItems: 'center',
    borderRadius: 8,
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  inlineTitle: {
    alignItems: 'baseline',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  listCard: {
    paddingVertical: 0,
  },
  historyDivider: {
    height: 6,
    marginHorizontal: -16,
  },
  historyFilterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  historyListCard: {
    marginHorizontal: -16,
    paddingVertical: 0,
  },
  historyMetricHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  historyTitleRow: {
    paddingTop: 4,
  },
  historyToolbar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  legendDot: {
    borderRadius: 4,
    height: 10,
    marginRight: 6,
    width: 10,
  },
  orderMain: {
    flex: 1,
    minWidth: 0,
  },
  orderRow: {
    alignItems: 'center',
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 12,
    minHeight: 58,
    paddingVertical: 10,
  },
  orderSide: {
    alignItems: 'flex-end',
    minWidth: 92,
  },
  orderTabButton: {
    alignItems: 'center',
    flex: 1,
    gap: 8,
    justifyContent: 'center',
  },
  orderTabIndicator: {
    borderRadius: 999,
    height: 2,
    width: 64,
  },
  orderTabs: {
    borderBottomWidth: 1,
    flexDirection: 'row',
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  positionTop: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
  positionOptionsScroll: {
    flexShrink: 1,
  },
  positionOptionsSheet: {
    gap: 14,
    paddingBottom: 18,
    paddingHorizontal: 14,
    paddingTop: 16,
  },
  optionGroupCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  optionIconWrap: {
    alignItems: 'center',
    width: 44,
  },
  optionTextBlock: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  positionOptionRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  positionDetailScroll: {
    flexShrink: 1,
  },
  positionDetailSheet: {
    gap: 14,
    paddingBottom: 18,
    paddingHorizontal: 14,
    paddingTop: 20,
  },
  positionDetailHero: {
    alignItems: 'center',
    gap: 8,
    paddingBottom: 10,
  },
  positionDetailCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  positionDetailRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
    justifyContent: 'space-between',
    minHeight: 54,
    paddingHorizontal: 16,
  },
  positionActionCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  positionActionButton: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  positionActionDivider: {
    height: 1,
    marginHorizontal: 16,
  },
  sectionTitle: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
    paddingHorizontal: 8,
  },
  sectionAction: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sellBadge: {
    alignItems: 'center',
    borderRadius: 5,
    flexDirection: 'row',
    gap: 3,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  sheetAddButton: {
    alignItems: 'center',
    borderRadius: 999,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  sheetBody: {
    flexShrink: 1,
  },
  sheetContent: {
    gap: 18,
    paddingBottom: 36,
    paddingHorizontal: 16,
  },
  sheetGroup: {
    gap: 10,
  },
  sheetHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  sheetHeaderSide: {
    width: 44,
  },
  statusPill: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  switchAccountBody: {
    flex: 1,
    gap: 10,
    minWidth: 0,
  },
  switchAccountCard: {
    alignItems: 'flex-start',
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 16,
  },
  switchDivider: {
    height: 1,
  },
  switchStatusBadge: {
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  switchTitleBlock: {
    flex: 1,
    minWidth: 0,
  },
  switchTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  switchTop: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
  switchValueCell: {
    flex: 1,
    gap: 2,
  },
  switchValues: {
    flexDirection: 'row',
    gap: 14,
  },
  switchWalletIcon: {
    alignItems: 'center',
    borderRadius: 999,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  radio: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 2,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  radioDot: {
    borderRadius: 999,
    height: 12,
    width: 12,
  },
  tradeIcon: {
    alignItems: 'center',
    borderRadius: 999,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  tradeRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    minHeight: 78,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  tradeRowMain: {
    flex: 1,
    gap: 3,
    minWidth: 0,
  },
  viewDetailsButton: {
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    minHeight: 58,
  },
});
