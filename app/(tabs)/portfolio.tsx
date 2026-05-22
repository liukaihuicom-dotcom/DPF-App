import { Alert, Platform, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { useState } from "react";

import { ActionButton } from "@/src/components/ActionButton";
import { useBottomSheet } from "@/src/components/BottomSheet";
import { Card } from "@/src/components/Card";
import { FundActionGrid } from "@/src/components/FundActionGrid";
import { GlobalMenuList } from "@/src/components/GlobalMenuList";
import {
  KeyValueList,
  type KeyValueListItem,
} from "@/src/components/KeyValueList";
import { Metric } from "@/src/components/Metric";
import { NativePressable } from "@/src/components/NativePressable";
import { AppIcon } from "@/src/components/AppIcon";
import { Screen } from "@/src/components/Screen";
import { StatusPill, type StatusPillTone } from "@/src/components/StatusPill";
import { TradeDirectionIcon } from "@/src/components/TradeDirectionIcon";
import { TradingAccountSwitchSheet } from "@/src/components/TradingAccountSwitchSheet";
import { AppText } from "@/src/components/Typography";
import {
  buildTradingAccountProfiles,
  getAccountStatusLabel,
  tradingAccountStatusGroups,
  type TradingAccountProfile,
} from "@/src/domain/accountProfiles";
import {
  directionLabel,
  formatMoney,
  formatNumber,
  formatPrice,
  formatVolumeMillions,
  localizeText,
  statusLabel,
} from "@/src/domain/format";
import { buildSharedTradingAccountProfiles } from "@/src/domain/tradingAccountView";
import type { Instrument, OrderType } from "@/src/domain/types";
import { useToast } from "@/src/feedback/Toast";
import { notifySuccess, notifyWarning } from "@/src/feedback/haptics";
import { useProductSettings } from "@/src/settings/ProductSettings";
import { useBroker } from "@/src/state/BrokerStore";

export default function PortfolioScreen() {
  const { role } = useBroker();

  return role === "partner" ? (
    <PartnerClientsScreen />
  ) : (
    <TraderPortfolioScreen />
  );
}

export function TraderPortfolioScreen() {
  const {
    account,
    closePosition,
    deleteOrder,
    findInstrument,
    instruments,
    modifyOrder,
    orders,
    positions,
  } = useBroker();
  const {
    locale,
    palette,
    selectedTradingAccountId,
    setSelectedTradingAccountId,
    t,
    tradingAccountCountPreset,
    tradingAccountDataPreset,
    tradingAccountScenario,
    tradingAccountStatusPreset,
  } = useProductSettings();
  const toast = useToast();
  const bottomSheet = useBottomSheet();
  const [orderView, setOrderView] = useState<
    "history" | "pending" | "positions"
  >("positions");
  const pnl = positions.reduce(
    (total, position) => total + position.unrealizedPnl,
    0,
  );
  const accountProfiles = buildSharedTradingAccountProfiles(
    account,
    positions,
    tradingAccountScenario,
    {
      countPreset: tradingAccountCountPreset,
      dataPreset: tradingAccountDataPreset,
      statusPreset: tradingAccountStatusPreset,
    },
  );
  const selectedAccount =
    accountProfiles.find(
      (profile) => profile.id === selectedTradingAccountId,
    ) ?? accountProfiles[0];
  const accountSuffix = selectedAccount.accountNo.slice(-4);
  const selectedMarginLevel =
    selectedAccount.marginLevel > 0
      ? formatNumber(selectedAccount.marginLevel, 2, locale)
      : "0.00";
  const anchorInstrument =
    instruments.find((instrument) => instrument.symbol === "EUR/USD") ??
    instruments[0];
  const positionRows = positions.map((position) => {
    const instrument = findInstrument(position.instrumentId);
    return {
      closable: true,
      currentPrice: instrument
        ? formatPrice(instrument, position.currentPrice)
        : formatNumber(position.currentPrice, 2, locale),
      direction: position.direction,
      id: position.id,
      instrument,
      lots: formatNumber(position.lots, 2, locale),
      openPrice: instrument
        ? formatPrice(instrument, position.openPrice)
        : formatNumber(position.openPrice, 2, locale),
      pnl: position.unrealizedPnl,
      symbol: position.symbol,
    };
  });
  const orderRows: PendingOrderRow[] = orders.map((order) => {
    const instrument = findInstrument(order.instrumentId);
    const price = instrument
      ? formatPrice(instrument, order.filledPrice || order.requestedPrice)
      : formatNumber(order.filledPrice || order.requestedPrice, 2, locale);
    const statusTone: PendingOrderRow["statusTone"] =
      order.status === "pending"
        ? "amber"
        : order.status === "closed"
          ? "muted"
          : order.direction === "buy"
            ? "down"
            : "up";
    return {
      canEdit: order.status === "pending",
      direction: order.direction,
      id: order.id,
      instrument,
      lots: formatNumber(order.lots, 2, locale),
      priceRange: `${price} - ${price}`,
      status: statusLabel(order.status, locale),
      statusTone,
      symbol: order.symbol,
      type: order.type,
    };
  });
  const historyRows = getHistoryOrderRows(locale);
  const pendingOrderRows = orderRows.filter((order) => order.canEdit);
  const accountMetricItems: KeyValueListItem[] = [
    {
      id: "balance",
      label: t("account.balance"),
      value: formatMoney(
        selectedAccount.balance,
        selectedAccount.currency,
        2,
        locale,
      ),
    },
    {
      id: "equity",
      label: t("account.equity"),
      value: formatMoney(
        selectedAccount.equity,
        selectedAccount.currency,
        2,
        locale,
      ),
    },
    {
      id: "margin",
      label: t("account.margin"),
      tone: "amber",
      value: formatMoney(
        selectedAccount.usedMargin,
        selectedAccount.currency,
        2,
        locale,
      ),
    },
    {
      id: "free-margin",
      label: t("account.freeMargin"),
      value: formatMoney(
        selectedAccount.freeMargin,
        selectedAccount.currency,
        2,
        locale,
      ),
    },
    {
      id: "margin-level",
      label: `${t("account.marginRate")} (%)`,
      value: selectedMarginLevel,
    },
  ];
  const confirmClose = (positionId: string, symbol: string) => {
    const close = () => {
      closePosition(positionId);
      void notifySuccess();
      toast.show({
        message: t("portfolio.closeSuccessMessage", { symbol }),
        title: t("portfolio.closeSuccessTitle"),
        tone: "success",
      });
    };

    void notifyWarning();

    if (Platform.OS === "web") {
      if (window.confirm(t("portfolio.closeConfirmMessage", { symbol }))) {
        close();
      }
      return;
    }

    Alert.alert(
      t("portfolio.closeConfirmTitle"),
      t("portfolio.closeConfirmMessage", { symbol }),
      [
        { style: "cancel", text: t("common.cancel") },
        { onPress: close, style: "destructive", text: t("common.confirm") },
      ],
    );
  };
  const openAccountSwitcher = () => {
    bottomSheet.show({
      header: {
        rightAction: {
          accessibilityLabel:
            locale === "en-US" ? "Add account" : "添加账户",
          icon: "addUser",
          onPress: () => {
            toast.show({
              message:
                locale === "en-US"
                  ? "Demo action only. No account was created."
                  : "当前为演示操作，未创建新账户。",
              title: locale === "en-US" ? "Add account" : "添加账户",
            });
          },
        },
        title: locale === "en-US" ? "Switch trading account" : "切换交易账号",
      },
      content: (
        <TradingAccountSwitchSheet
          accounts={accountProfiles}
          mode="detailed"
          onSelect={(nextId) => {
            setSelectedTradingAccountId(nextId);
            bottomSheet.hide();
          }}
          selectedId={selectedAccount.id}
        />
      ),
    });
  };
  const openAccountMenu = () => {
    bottomSheet.show({
      header: false,
      content: (
        <AccountMenuSheet
          account={selectedAccount}
          onViewBalance={() => {
            bottomSheet.hide();
            router.push(`/account-balance/${selectedAccount.id}` as never);
          }}
          onViewDetails={() => {
            bottomSheet.hide();
            router.push(`/account-details/${selectedAccount.id}`);
          }}
          onViewBasicInfo={() => {
            bottomSheet.hide();
            router.push(`/account-basic/${selectedAccount.id}` as never);
          }}
        />
      ),
    });
  };
  const openPositionOptions = () => {
    bottomSheet.show({
      header: {
        leftIcon: "settingsSliders",
        title: t("portfolio.positionOptionsTitle"),
      },
      content: (
        <PositionOptionsSheet
          onAction={(title) => {
            toast.show({
              message:
                locale === "en-US"
                  ? "Demo action only. No live position was changed."
                  : "当前为演示操作，未改变真实持仓。",
              title,
              tone: "default",
            });
            bottomSheet.hide();
          }}
        />
      ),
    });
  };
  const openPositionDetail = (position: (typeof positionRows)[number]) => {
    bottomSheet.show({
      snapPoints: ["82%"],
      header: false,
      content: <PositionDetailSheet position={position} />,
      footer: [
        {
          icon: "settingsSliders",
          label: locale === "en-US" ? "Modify Position" : "修改持仓",
          onPress: () => {
            toast.show({
              message:
                locale === "en-US"
                  ? "Modify position is a demo action in this MVP."
                  : "当前为演示修改入口，暂不修改持仓。",
              title: locale === "en-US" ? "Modify Position" : "修改持仓",
              tone: "default",
            });
          },
          tone: "neutral",
        },
        {
          icon: "closeX",
          label: locale === "en-US" ? "Close Position" : "平仓",
          onPress: () => {
            if (position.closable) {
              confirmClose(position.id, position.symbol);
            } else {
              toast.show({
                message:
                  locale === "en-US"
                    ? "Demo rows cannot be closed."
                    : "演示持仓暂不支持平仓。",
                title: locale === "en-US" ? "Demo position" : "演示持仓",
                tone: "warning",
              });
            }
          },
          tone: "danger",
        },
      ],
    });
  };
  const openClosedOrderDetail = (order: HistoryOrderRow) => {
    bottomSheet.show({
      header: {
        leftIcon: "historyClock",
        title: locale === "en-US" ? "History order detail" : "历史订单详情",
      },
      content: <ClosedOrderDetailSheet order={order} />,
    });
  };
  const openPendingOrderDetail = (order: (typeof orderRows)[number]) => {
    bottomSheet.show({
      header: false,
      content: <PendingOrderDetailSheet order={order} />,
      footer: [
        {
          icon: "settingsSliders",
          label: locale === "en-US" ? "Modify Order" : "修改订单",
          onPress: () => {
            if (!order.canEdit) {
              toast.show({
                message:
                  locale === "en-US"
                    ? "Demo pending rows cannot be modified."
                    : "演示挂单暂不支持修改。",
                title: locale === "en-US" ? "Demo order" : "演示订单",
                tone: "warning",
              });
              return;
            }

            modifyOrder(order.id);
            toast.show({
              message:
                locale === "en-US"
                  ? `${order.symbol} lots were adjusted in this local demo.`
                  : `${order.symbol} 手数已在本地演示中调整。`,
              title: locale === "en-US" ? "Order modified" : "订单已修改",
              tone: "success",
            });
          },
          tone: "neutral",
        },
        {
          icon: "closeX",
          label: locale === "en-US" ? "Delete Order" : "删除订单",
          onPress: () => {
            if (!order.canEdit) {
              toast.show({
                message:
                  locale === "en-US"
                    ? "Demo pending rows cannot be deleted."
                    : "演示挂单暂不支持删除。",
                title: locale === "en-US" ? "Demo order" : "演示订单",
                tone: "warning",
              });
              return;
            }

            deleteOrder(order.id);
            toast.show({
              message:
                locale === "en-US"
                  ? `${order.symbol} pending order was deleted in this local demo.`
                  : `${order.symbol} 挂单已在本地演示中删除。`,
              title: locale === "en-US" ? "Order deleted" : "订单已删除",
              tone: "success",
            });
          },
          tone: "up",
        },
      ],
    });
  };

  return (
    <Screen contentPadding="flush">
      <Card compact style={styles.accountPanel}>
        <View style={styles.accountPanelHeader}>
          <View style={styles.accountHeaderSide} />
          <View style={styles.accountTitleBlock}>
            <AppText
              adjustsFontSizeToFit
              numberOfLines={1}
              tone={pnl >= 0 ? "down" : "up"}
              variant="largeNumber"
            >
              {formatMoney(pnl, selectedAccount.currency, 2, locale)}
            </AppText>
            <NativePressable
              accessibilityLabel={
                locale === "en-US" ? "Switch trading account" : "切换交易账号"
              }
              minTouch={32}
              onPress={openAccountSwitcher}
              style={styles.accountSelector}
            >
              <AppText numberOfLines={1} variant="body">
                {locale === "en-US"
                  ? `Margin Account (${accountSuffix})`
                  : `保证金账户 (${accountSuffix})`}
              </AppText>
              <AppIcon color={palette.text} name="expandDown" size={14} />
            </NativePressable>
          </View>
          <NativePressable
            accessibilityLabel={
              locale === "en-US" ? "Account menu" : "账户菜单"
            }
            minTouch={44}
            onPress={openAccountMenu}
            style={StyleSheet.flatten([
              styles.accountMenuButton,
              { backgroundColor: palette.panelSoft },
            ])}
          >
            <AppIcon color={palette.text} name="quoteList" size={20} />
          </NativePressable>
        </View>

        <KeyValueList items={accountMetricItems} />
      </Card>

      <View style={styles.orderPageBody}>
        <OrderViewTabs
          counts={{
            history: historyRows.length,
            pending: pendingOrderRows.length,
            positions: positionRows.length,
          }}
          current={orderView}
          onChange={setOrderView}
        />

        <View style={styles.orderContent}>
        {orderView === "positions" ? (
          <>
            <OrderSectionHeader
              accessibilityLabel={
                locale === "en-US"
                  ? "Position display and bulk actions"
                  : "持仓显示与批量操作"
              }
              onPress={openPositionOptions}
              title={t("portfolio.current")}
            />
            {positionRows.length > 0 ? (
              <Card compact>
                {positionRows.map((position, index) => (
                  <NativePressable
                    accessibilityLabel={`${position.symbol} ${directionLabel(position.direction, locale)}`}
                    key={position.id}
                    minTouch={64}
                    onPress={() => openPositionDetail(position)}
                    style={StyleSheet.flatten([
                      styles.tradeRow,
                      index < positionRows.length - 1 && {
                        borderBottomColor: palette.lineSoft,
                        borderBottomWidth: 1,
                      },
                    ])}
                  >
                    <TradeDirectionIcon direction={position.direction} size={42} />
                    <View style={styles.tradeRowMain}>
                      <View style={styles.inlineTitle}>
                        <AppText numberOfLines={1} variant="subtitle">
                          {position.symbol}
                        </AppText>
                        <AppText
                          numberOfLines={1}
                          tone={position.direction === "buy" ? "down" : "up"}
                          variant="subtitle"
                        >
                          {directionLabel(
                            position.direction,
                            locale,
                          ).toLowerCase()}{" "}
                          {position.lots}
                        </AppText>
                      </View>
                      <AppText numberOfLines={1} tone="muted" variant="caption">
                        {position.openPrice} - {position.currentPrice}
                      </AppText>
                    </View>
                    <AppText
                      tone={position.pnl >= 0 ? "down" : "up"}
                      variant="number"
                    >
                      {formatNumber(position.pnl, 2, locale)}
                    </AppText>
                  </NativePressable>
                ))}
              </Card>
            ) : (
              <EmptyOrderState
                actionLabel={t("portfolio.emptyPositionsAction")}
                body={t("portfolio.emptyPositionsGuide")}
                icon="marketTrend"
                onAction={
                  anchorInstrument
                    ? () =>
                        router.push(
                          `/order/${anchorInstrument.id}?direction=buy&type=market` as never,
                        )
                    : undefined
                }
                onSecondaryAction={
                  anchorInstrument
                    ? () =>
                        router.push(
                          `/instrument/${anchorInstrument.id}` as never,
                        )
                    : undefined
                }
                secondaryLabel={t("portfolio.emptyViewMarketAction")}
                title={t("portfolio.noCurrentPositions")}
              />
            )}
          </>
        ) : null}

        {orderView === "pending" ? (
          <>
            <OrderSectionHeader title={t("portfolio.orderRecords")} />
            {pendingOrderRows.length > 0 ? (
              <Card compact>
                {pendingOrderRows.map((order, index) => (
                  <NativePressable
                    accessibilityLabel={`${order.symbol} ${directionLabel(order.direction, locale)} ${order.type}`}
                    key={order.id}
                    minTouch={64}
                    onPress={() => openPendingOrderDetail(order)}
                    style={StyleSheet.flatten([
                      styles.tradeRow,
                      index < pendingOrderRows.length - 1 && {
                        borderBottomColor: palette.lineSoft,
                        borderBottomWidth: 1,
                      },
                    ])}
                  >
                    <TradeDirectionIcon direction={order.direction} size={42} />
                    <View style={styles.tradeRowMain}>
                      <View style={styles.inlineTitle}>
                        <AppText numberOfLines={1} variant="subtitle">
                          {order.symbol}
                        </AppText>
                        <AppText
                          numberOfLines={1}
                          tone={order.direction === "buy" ? "down" : "up"}
                          variant="subtitle"
                        >
                          {directionLabel(
                            order.direction,
                            locale,
                          ).toLowerCase()}{" "}
                          {order.type === "limit" ? "limit " : ""}
                          {order.lots}
                        </AppText>
                      </View>
                      <AppText numberOfLines={1} tone="muted" variant="caption">
                        {order.priceRange}
                      </AppText>
                    </View>
                    <AppText
                      tone={
                        order.statusTone === "amber"
                          ? "amber"
                          : order.statusTone === "up"
                            ? "up"
                            : order.statusTone === "down"
                              ? "down"
                              : "dim"
                      }
                      variant="subtitle"
                    >
                      {order.status}
                    </AppText>
                    <AppIcon
                      color={palette.textDim}
                      name="navigateNext"
                      size={14}
                    />
                  </NativePressable>
                ))}
              </Card>
            ) : (
              <EmptyOrderState
                actionLabel={t("portfolio.emptyPendingAction")}
                body={t("portfolio.emptyPendingGuide")}
                icon="promoTicket"
                onAction={
                  anchorInstrument
                    ? () =>
                        router.push(
                          `/order/${anchorInstrument.id}?direction=buy&type=limit` as never,
                        )
                    : undefined
                }
                onSecondaryAction={
                  anchorInstrument
                    ? () =>
                        router.push(
                          `/instrument/${anchorInstrument.id}` as never,
                        )
                    : undefined
                }
                secondaryLabel={t("portfolio.emptyViewMarketAction")}
                title={t("portfolio.noPendingOrders")}
              />
            )}
          </>
        ) : null}

        {orderView === "history" ? (
          <HistoryOrdersView
            orders={historyRows}
            onOpenOrder={openClosedOrderDetail}
          />
        ) : null}
        </View>
      </View>
    </Screen>
  );
}

function OrderViewTabs({
  counts,
  current,
  onChange,
}: {
  counts: Record<"history" | "pending" | "positions", number>;
  current: "history" | "pending" | "positions";
  onChange: (view: "history" | "pending" | "positions") => void;
}) {
  const { locale, palette } = useProductSettings();
  const items: { id: "history" | "pending" | "positions"; label: string }[] = [
    { id: "positions", label: locale === "en-US" ? "Position" : "持仓" },
    { id: "pending", label: locale === "en-US" ? "Pending" : "挂单" },
    { id: "history", label: locale === "en-US" ? "History" : "历史" },
  ];

  return (
    <View
      style={StyleSheet.flatten([
        styles.orderTabs,
        { borderBottomColor: palette.lineSoft },
      ])}
    >
      {items.map((item) => {
        const selected = current === item.id;
        return (
          <NativePressable
            accessibilityLabel={item.label}
            key={item.id}
            minTouch={44}
            onPress={() => onChange(item.id)}
            style={styles.orderTabButton}
          >
            <AppText
              style={{ color: selected ? palette.text : palette.textMuted }}
              variant="subtitle"
            >
              {item.label} {counts[item.id]}
            </AppText>
            <View
              style={StyleSheet.flatten([
                styles.orderTabIndicator,
                { backgroundColor: selected ? palette.text : "transparent" },
              ])}
            />
          </NativePressable>
        );
      })}
    </View>
  );
}

function AccountMenuSheet({
  account,
  onViewBasicInfo,
  onViewBalance,
  onViewDetails,
}: {
  account: TradingAccountProfile;
  onViewBasicInfo: () => void;
  onViewBalance: () => void;
  onViewDetails: () => void;
}) {
  const { locale, palette, t } = useProductSettings();
  const status = getAccountStatusLabel(account.group, locale);
  const statusTone: StatusPillTone =
    account.group === "demo"
      ? "brand"
      : account.group === "readOnly"
        ? "warning"
        : "success";
  const statusIcon =
    account.group === "readOnly"
      ? "secureLock"
      : account.group === "demo"
        ? "userAvatar"
        : "statusVerified";
  const menuItems = [
    {
      icon: "identityCard" as const,
      label: t("accountDetails.menuBasicInfo"),
      onPress: onViewBasicInfo,
    },
    { icon: "historyClock" as const, label: "Order History" },
    { icon: "accountBank" as const, label: "Balance", onPress: onViewBalance },
    { icon: "transferSwitch" as const, label: "Swap" },
  ];

  return (
    <View style={styles.accountMenuSheet}>
      <View style={styles.menuAccountHeader}>
        <AppText style={styles.menuAccountNo} variant="largeNumber">
          {account.accountNo}
        </AppText>
        <AppText tone="muted" variant="subtitle">
          Margin Account · {account.currency}
        </AppText>
        <StatusPill icon={statusIcon} label={status} tone={statusTone} />
      </View>

      <FundActionGrid />

      <GlobalMenuList contained items={menuItems} />

      <NativePressable
        accessibilityLabel={t("accountDetails.open")}
        minTouch={58}
        onPress={onViewDetails}
        style={StyleSheet.flatten([
          styles.viewDetailsButton,
          { backgroundColor: palette.panel, borderColor: palette.lineSoft },
        ])}
      >
        <AppText style={{ color: palette.blue }} variant="subtitle">
          {t("accountDetails.open")}
        </AppText>
      </NativePressable>
    </View>
  );
}

function PositionOptionsSheet({
  onAction,
}: {
  onAction: (title: string) => void;
}) {
  const { palette, t } = useProductSettings();
  const viewModes = [
    {
      description: t("portfolio.optionByOrderDesc"),
      icon: "taskChecklist" as const,
      label: t("portfolio.optionByOrder"),
    },
    {
      description: t("portfolio.optionBySymbolDesc"),
      icon: "qrCode" as const,
      label: t("portfolio.optionBySymbol"),
    },
  ];
  const bulkActions = [
    {
      description: t("portfolio.optionCloseAllDesc"),
      icon: "closeX" as const,
      label: t("portfolio.optionCloseAll"),
    },
    {
      description: t("portfolio.optionCloseLosingDesc"),
      icon: "statusVerified" as const,
      label: t("portfolio.optionCloseLosing"),
    },
  ];

  return (
    <View style={styles.positionOptionsSheet}>
      <SheetGroupTitle title={t("portfolio.optionGroupViewMode")} />
      <View
        style={StyleSheet.flatten([
          styles.optionGroupCard,
          { backgroundColor: palette.panel, borderColor: palette.lineSoft },
        ])}
      >
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

      <SheetGroupTitle title={t("portfolio.optionGroupBulkActions")} />
      <View
        style={StyleSheet.flatten([
          styles.optionGroupCard,
          { backgroundColor: palette.panel, borderColor: palette.lineSoft },
        ])}
      >
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
    </View>
  );
}

type PositionDetailRow = {
  closable: boolean;
  currentPrice: string;
  direction: "buy" | "sell";
  id: string;
  instrument?: Instrument;
  lots: string;
  openPrice: string;
  pnl: number;
  symbol: string;
};

type PendingOrderRow = {
  canEdit: boolean;
  direction: "buy" | "sell";
  id: string;
  instrument?: Instrument;
  lots: string;
  priceRange: string;
  status: string;
  statusTone: "amber" | "muted" | "down" | "up";
  symbol: string;
  type: OrderType;
};

function PendingOrderDetailSheet({ order }: { order: PendingOrderRow }) {
  const { locale, palette } = useProductSettings();
  const direction = directionLabel(order.direction, locale).toLowerCase();
  const details = [
    { label: locale === "en-US" ? "Symbol" : "品种", value: order.symbol },
    {
      label: locale === "en-US" ? "Direction" : "交易方向",
      value: `${direction} ${order.lots}`,
    },
    {
      label: locale === "en-US" ? "Order type" : "订单类型",
      value: order.type,
    },
    { label: locale === "en-US" ? "Price" : "价格", value: order.priceRange },
    { label: locale === "en-US" ? "Status" : "状态", value: order.status },
  ];

  return (
    <View style={styles.positionDetailSheet}>
      <View style={styles.positionDetailHero}>
        <TradeDirectionIcon direction={order.direction} size={48} />
        <AppText variant="title">
          {locale === "en-US" ? "Pending Order" : "挂单详情"}
        </AppText>
        <View style={styles.inlineTitle}>
          <AppText variant="subtitle">{order.symbol}</AppText>
          <AppText
            tone={order.direction === "buy" ? "down" : "up"}
            variant="subtitle"
          >
            {direction} {order.lots}
          </AppText>
        </View>
        <AppText tone="muted" variant="caption">
          {order.priceRange}
        </AppText>
      </View>

      <View
        style={StyleSheet.flatten([
          styles.positionDetailCard,
          { backgroundColor: palette.panel, borderColor: palette.lineSoft },
        ])}
      >
        {details.map((item, index) => (
          <View
            key={item.label}
            style={StyleSheet.flatten([
              styles.positionDetailRow,
              index < details.length - 1 && {
                borderBottomColor: palette.lineSoft,
                borderBottomWidth: 1,
              },
            ])}
          >
            <AppText variant="subtitle">{item.label}</AppText>
            <AppText numberOfLines={1} variant="subtitle">
              {item.value}
            </AppText>
          </View>
        ))}
      </View>
    </View>
  );
}

function PositionDetailSheet({ position }: { position: PositionDetailRow }) {
  const { locale, palette } = useProductSettings();
  const direction = directionLabel(position.direction, locale).toLowerCase();
  const details = [
    { label: locale === "en-US" ? "Symbol" : "品种", value: position.symbol },
    {
      label: locale === "en-US" ? "Direction" : "交易方向",
      value: `${direction} ${position.lots}`,
    },
    { label: "Ticket", value: `${"#"}3339900` },
    { label: "Commission", value: "-10.00" },
    { label: "Swap", value: "-7.00" },
    { label: "Open Time", value: "05/01/2026 14:22:39" },
    { label: "Stop Loss", value: "--" },
    { label: "Take Profit", value: "--" },
  ];

  return (
    <View style={styles.positionDetailSheet}>
      <View style={styles.positionDetailHero}>
        <TradeDirectionIcon direction={position.direction} size={48} />
        <AppText
          style={{ color: position.pnl >= 0 ? palette.down : palette.up }}
          variant="largeNumber"
        >
          {formatMoney(position.pnl, "USD", 2, locale)}
        </AppText>
        <AppText variant="title">Unrealized PnL</AppText>
        <AppText variant="subtitle">
          {position.openPrice} - {position.currentPrice}
        </AppText>
      </View>

      <View
        style={StyleSheet.flatten([
          styles.positionDetailCard,
          { backgroundColor: palette.panel, borderColor: palette.lineSoft },
        ])}
      >
        {details.map((item, index) => (
          <View
            key={item.label}
            style={StyleSheet.flatten([
              styles.positionDetailRow,
              index < details.length - 1 && {
                borderBottomColor: palette.lineSoft,
                borderBottomWidth: 1,
              },
            ])}
          >
            <AppText variant="subtitle">{item.label}</AppText>
            <AppText numberOfLines={1} variant="subtitle">
              {item.value}
            </AppText>
          </View>
        ))}
      </View>
    </View>
  );
}

type HistoryOrderRow = {
  closeTime: string;
  commission: number;
  dealId: string;
  delta: string;
  direction: "buy" | "sell";
  id: string;
  lots: string;
  openTime: string;
  priceRange: string;
  pnl: number;
  symbol: string;
  swap: number;
};

function HistoryOrdersView({
  onOpenOrder,
  orders,
}: {
  onOpenOrder: (order: HistoryOrderRow) => void;
  orders: HistoryOrderRow[];
}) {
  const { locale, palette } = useProductSettings();
  const realized = orders.reduce((total, order) => total + order.pnl, 0);
  const volume = orders.reduce((total, order) => total + Number(order.lots), 0);
  const profitableOrders = orders.filter((order) => order.pnl >= 0).length;
  const losingOrders = Math.max(0, orders.length - profitableOrders);
  const summaryItems = [
    {
      label: locale === "en-US" ? "Realized P/L" : "已实现盈亏",
      tone: realized >= 0 ? ("down" as const) : ("up" as const),
      value: formatMoney(realized, "USD", 2, locale),
    },
    {
      label: locale === "en-US" ? "Total volume" : "总手数",
      value: `${formatNumber(volume, 2, locale)} ${locale === "en-US" ? "lot" : "手"}`,
    },
    {
      label: locale === "en-US" ? "Closed orders" : "历史订单",
      value: `${orders.length}`,
    },
  ];

  return (
    <>
      <Card compact style={styles.historySummaryCard}>
        <View style={styles.historySummaryTop}>
          <View style={styles.historySummaryTitle}>
            <AppText variant="subtitle">
              {locale === "en-US" ? "History summary" : "历史概览"}
            </AppText>
            <AppText tone="muted" variant="caption">
              {locale === "en-US"
                ? "Closed orders in the selected period"
                : "当前周期内的已平仓订单"}
            </AppText>
          </View>
          <StatusPill
            compact
            icon="historyClock"
            label={locale === "en-US" ? "Last 30 days" : "近 30 天"}
            tone="neutral"
          />
        </View>
        <View style={styles.historySummaryGrid}>
          {summaryItems.map((item, index) => (
            <View
              key={item.label}
              style={StyleSheet.flatten([
                styles.historySummaryItem,
                index > 0 && {
                  borderLeftColor: palette.lineSoft,
                  borderLeftWidth: 1,
                },
              ])}
            >
              <AppText
                adjustsFontSizeToFit
                numberOfLines={1}
                tone={item.tone}
                variant="number"
              >
                {item.value}
              </AppText>
              <AppText numberOfLines={1} tone="muted" variant="caption">
                {item.label}
              </AppText>
            </View>
          ))}
        </View>
        <View style={styles.historyOutcomeRow}>
          <View style={styles.historyOutcomeItem}>
            <View
              style={StyleSheet.flatten([
                styles.legendDot,
                { backgroundColor: palette.down },
              ])}
            />
            <AppText tone="muted" variant="caption">
              {locale === "en-US"
                ? `Profit ${profitableOrders}`
                : `盈利 ${profitableOrders}`}
            </AppText>
          </View>
          <View style={styles.historyOutcomeItem}>
            <View
              style={StyleSheet.flatten([
                styles.legendDot,
                { backgroundColor: palette.up },
              ])}
            />
            <AppText tone="muted" variant="caption">
              {locale === "en-US"
                ? `Loss ${losingOrders}`
                : `亏损 ${losingOrders}`}
            </AppText>
          </View>
        </View>
      </Card>

      <Card compact style={styles.historyChartCard}>
        <View style={styles.historySummaryTop}>
          <View style={styles.historySummaryTitle}>
            <AppText variant="subtitle">
              {locale === "en-US" ? "Realized P/L" : "已实现盈亏"}
            </AppText>
            <AppText tone="muted" variant="caption">
              {locale === "en-US"
                ? "Closed order profit and loss"
                : "已平仓订单盈亏走势"}
            </AppText>
          </View>
          <FilterPill
            icon="historyClock"
            label={locale === "en-US" ? "Last 30 days" : "近 30 天"}
          />
        </View>
        <MiniBarChart
          color={palette.down}
          values={[190, 420, 70, 1600, 180, 7600, 180, 1200]}
        />
        <View style={styles.chartLegend}>
          <View
            style={StyleSheet.flatten([
              styles.legendDot,
              { backgroundColor: palette.down },
            ])}
          />
          <AppText tone="muted" variant="caption">
            {locale === "en-US" ? "Profit" : "盈利"}
          </AppText>
          <View
            style={StyleSheet.flatten([
              styles.legendDot,
              { backgroundColor: palette.up, marginLeft: 14 },
            ])}
          />
          <AppText tone="muted" variant="caption">
            {locale === "en-US" ? "Loss" : "亏损"}
          </AppText>
        </View>
      </Card>

      <Card compact style={styles.historyChartCard}>
        <View style={styles.historySummaryTop}>
          <View style={styles.historySummaryTitle}>
            <AppText variant="subtitle">
              {locale === "en-US" ? "Volume" : "成交手数"}
            </AppText>
            <AppText tone="muted" variant="caption">
              {locale === "en-US"
                ? "Standard lots by day"
                : "按日期统计标准手数"}
            </AppText>
          </View>
          <View style={styles.historyFilterRow}>
            <FilterPill
              icon="accountBank"
              label={locale === "en-US" ? "Symbols" : "品种"}
            />
            <FilterPill
              icon="historyClock"
              label={locale === "en-US" ? "Last 30 days" : "近 30 天"}
            />
          </View>
        </View>
        <MiniBarChart
          color={palette.amber}
          maxValue={100}
          values={[10, 42, 3, 16, 9, 28, 9, 26]}
        />
        <View style={styles.chartLegend}>
          <View
            style={StyleSheet.flatten([
              styles.legendDot,
              { backgroundColor: palette.amber },
            ])}
          />
          <AppText tone="muted" variant="caption">
            {locale === "en-US" ? "Standard lots" : "标准手数"}
          </AppText>
        </View>
      </Card>

      <View style={styles.historyToolbar}>
        <AppText variant="subtitle">
          {locale === "en-US" ? "Orders History" : "历史订单"}
        </AppText>
        <View style={styles.historyFilterRow}>
          <FilterPill
            icon="historyClock"
            label={locale === "en-US" ? "Last 7 days" : "近 7 天"}
          />
          <FilterPill
            icon="settingsSliders"
            label={locale === "en-US" ? "Sort" : "排序"}
          />
        </View>
      </View>
      <Card compact>
        {orders.map((order, index) => (
          <NativePressable
            accessibilityLabel={`${order.symbol} ${order.direction} ${order.lots}`}
            key={order.id}
            minTouch={62}
            onPress={() => onOpenOrder(order)}
            style={StyleSheet.flatten([
              styles.tradeRow,
              index < orders.length - 1 && {
                borderBottomColor: palette.lineSoft,
                borderBottomWidth: 1,
              },
            ])}
          >
            <TradeDirectionIcon direction={order.direction} size={42} />
            <View style={styles.tradeRowMain}>
              <View style={styles.inlineTitle}>
                <AppText numberOfLines={1} variant="subtitle">
                  {order.symbol}
                </AppText>
                <AppText
                  tone={order.direction === "buy" ? "down" : "up"}
                  variant="subtitle"
                >
                  {directionLabel(order.direction, locale).toLowerCase()}{" "}
                  {order.lots}
                </AppText>
              </View>
              <AppText tone="muted" variant="caption">
                {order.priceRange}
              </AppText>
            </View>
            <View style={styles.historyRowSide}>
              <AppText tone={order.pnl >= 0 ? "down" : "up"} variant="number">
                {formatNumber(order.pnl, 2, locale)}
              </AppText>
            </View>
          </NativePressable>
        ))}
      </Card>
    </>
  );
}

function FilterPill({
  icon,
  label,
}: {
  icon: "accountBank" | "historyClock" | "settingsSliders";
  label: string;
}) {
  return <StatusPill icon={icon} label={label} tone="neutral" />;
}

function MiniBarChart({
  color,
  maxValue,
  values,
}: {
  color: string;
  maxValue?: number;
  values: number[];
}) {
  const { palette } = useProductSettings();
  const max = maxValue ?? Math.max(...values);
  return (
    <View style={styles.barChartWrap}>
      {[10000, 2000, 1000, 200, 0].map((tick) => (
        <View key={tick} style={styles.chartGridRow}>
          <AppText tone="dim" variant="caption">
            {tick >= 1000 ? `${tick / 1000}k` : `${tick}`}
          </AppText>
          <View
            style={StyleSheet.flatten([
              styles.chartGridLine,
              { backgroundColor: palette.lineSoft },
            ])}
          />
        </View>
      ))}
      <View style={styles.barRow}>
        {values.map((value, index) => (
          <View key={`${value}-${index}`} style={styles.barSlot}>
            <View
              style={StyleSheet.flatten([
                styles.barFill,
                {
                  backgroundColor: color,
                  height: `${Math.max(6, Math.min(100, (value / max) * 100))}%`,
                },
              ])}
            />
          </View>
        ))}
      </View>
      <View style={styles.chartDateRow}>
        <AppText tone="dim" variant="caption">
          02 Jul
        </AppText>
        <AppText tone="dim" variant="caption">
          12 Jul
        </AppText>
        <AppText tone="dim" variant="caption">
          22 Jul
        </AppText>
        <AppText tone="dim" variant="caption">
          28 Jul
        </AppText>
      </View>
    </View>
  );
}

function ClosedOrderDetailSheet({ order }: { order: HistoryOrderRow }) {
  const { palette } = useProductSettings();
  const details = [
    ["Open time", order.openTime],
    ["Close time", order.closeTime],
    [
      "Commission / Swap",
      `${formatNumber(order.commission, 2, "en-US")} / ${formatNumber(order.swap, 2, "en-US")}`,
    ],
    ["SL / TP", "-/-"],
  ];
  const deals = [0, 1, 2, 3];

  return (
    <View style={styles.closedOrderSheet}>
      <AppText variant="title">Ticket {"#"}14808934</AppText>
      <View
        style={StyleSheet.flatten([
          styles.closedOrderCard,
          { backgroundColor: palette.panel, borderColor: palette.lineSoft },
        ])}
      >
        <View style={styles.closedOrderTop}>
          <View style={styles.closedOrderIdentity}>
            <TradeDirectionIcon direction={order.direction} size={48} />
            <View style={styles.tradeRowMain}>
              <View style={styles.inlineTitle}>
                <AppText variant="title">{order.symbol}</AppText>
                <AppText
                  tone={order.direction === "buy" ? "down" : "up"}
                  variant="title"
                >
                  {order.direction} {order.lots}
                </AppText>
              </View>
              <AppText tone="muted" variant="subtitle">
                {order.priceRange}
              </AppText>
            </View>
          </View>
          <View style={styles.closedOrderPnl}>
            <AppText tone={order.pnl >= 0 ? "down" : "up"} variant="title">
              {formatNumber(order.pnl, 2, "en-US")}
            </AppText>
            <AppText tone={order.pnl >= 0 ? "down" : "up"} variant="body">
              {order.delta}
            </AppText>
          </View>
        </View>
        {details.map(([label, value]) => (
          <View key={label} style={styles.closedDetailRow}>
            <AppText tone="muted" variant="body">
              {label}
            </AppText>
            <AppText variant="body">{value}</AppText>
          </View>
        ))}
      </View>

      <View
        style={StyleSheet.flatten([
          styles.closedOrderCard,
          { backgroundColor: palette.panel, borderColor: palette.lineSoft },
        ])}
      >
        <AppText style={styles.dealsTitle} variant="subtitle">
          Deals (3)
        </AppText>
        {deals.map((deal, index) => (
          <View
            key={deal}
            style={StyleSheet.flatten([
              styles.dealRow,
              index < deals.length - 1 && {
                borderBottomColor: palette.lineSoft,
                borderBottomWidth: 1,
              },
            ])}
          >
            <TradeDirectionIcon direction={order.direction} size={36} />
            <View style={styles.tradeRowMain}>
              <AppText variant="subtitle">
                {order.symbol} {order.lots}
              </AppText>
              <AppText tone="muted" variant="body">
                {order.priceRange}
              </AppText>
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
              <AppText tone="down" variant="subtitle">
                {formatNumber(order.pnl, 2, "en-US")}
              </AppText>
              <AppText tone="down" variant="body">
                {order.delta}
              </AppText>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

function DetailInline({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailInline}>
      <AppText tone="muted" variant="body">
        {label}
      </AppText>
      <AppText variant="body">{value}</AppText>
    </View>
  );
}

function SheetGroupTitle({ title }: { title: string }) {
  return (
    <AppText style={styles.sheetGroupTitle} tone="muted" variant="caption">
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
  icon: "statusVerified" | "taskChecklist" | "qrCode" | "closeX";
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
      style={StyleSheet.flatten([
        styles.positionOptionRow,
        showDivider && {
          borderBottomColor: palette.lineSoft,
          borderBottomWidth: 1,
        },
      ])}
    >
      <View
        style={StyleSheet.flatten([
          styles.optionIconWrap,
          { backgroundColor: palette.panelSoft, borderColor: palette.lineSoft },
        ])}
      >
        <AppIcon color={palette.textDim} name={icon} size={18} />
      </View>
      <View style={styles.optionTextBlock}>
        <AppText numberOfLines={1} variant="subtitle">
          {label}
        </AppText>
        <AppText numberOfLines={2} tone="muted" variant="caption">
          {description}
        </AppText>
      </View>
      <AppIcon color={palette.textDim} name="navigateNext" size={16} />
    </NativePressable>
  );
}

function EmptyOrderState({
  actionLabel,
  body,
  icon,
  onAction,
  onSecondaryAction,
  secondaryLabel,
  title,
}: {
  actionLabel?: string;
  body: string;
  icon: "marketTrend" | "promoTicket";
  onAction?: () => void;
  onSecondaryAction?: () => void;
  secondaryLabel?: string;
  title: string;
}) {
  const { palette } = useProductSettings();

  return (
    <Card compact style={styles.emptyStateCard}>
      <View style={styles.emptyStateRow}>
        <View
          style={StyleSheet.flatten([
            styles.emptyStateIcon,
            { backgroundColor: palette.panelSoft },
          ])}
        >
          <AppIcon color={palette.textDim} name={icon} size={24} />
        </View>
        <View style={styles.emptyStateText}>
          <AppText variant="subtitle">{title}</AppText>
          <AppText tone="muted" variant="caption">
            {body}
          </AppText>
        </View>
      </View>
      <View style={styles.emptyActionRow}>
        {secondaryLabel && onSecondaryAction ? (
          <ActionButton
            label={secondaryLabel}
            onPress={onSecondaryAction}
            style={styles.emptyAction}
            tone="neutral"
          />
        ) : (
          <View style={styles.emptyAction} />
        )}
        {actionLabel && onAction ? (
          <ActionButton
            label={actionLabel}
            onPress={onAction}
            style={styles.emptyAction}
            tone="brand"
          />
        ) : (
          <View style={styles.emptyAction} />
        )}
      </View>
    </Card>
  );
}

function OrderSectionHeader({
  accessibilityLabel,
  onPress,
  title,
}: {
  accessibilityLabel?: string;
  onPress?: () => void;
  title: string;
}) {
  const { palette } = useProductSettings();
  return (
    <View style={styles.sectionTitle}>
      <AppText variant="subtitle">{title}</AppText>
      {onPress ? (
        <NativePressable
          accessibilityLabel={accessibilityLabel ?? title}
          minTouch={36}
          onPress={onPress}
          style={styles.sectionAction}
        >
          <AppIcon color={palette.text} name="moreDots" size={22} />
        </NativePressable>
      ) : (
        <AppIcon color={palette.text} name="moreDots" size={22} />
      )}
    </View>
  );
}

function getHistoryOrderRows(_locale: "en-US" | "zh-CN"): HistoryOrderRow[] {
  return [
    {
      closeTime: "15/04/2023 12:27:28",
      commission: 0,
      dealId: "90002333",
      delta: "△=10",
      direction: "buy",
      id: "hist-1",
      lots: "5.00",
      openTime: "15/04/2023 12:00:00",
      pnl: 500,
      priceRange: "1887.87 - 1888.87",
      symbol: "XAUUSD",
      swap: -0.9,
    },
    {
      closeTime: "16/04/2023 15:18:10",
      commission: 0,
      dealId: "90002334",
      delta: "△=10",
      direction: "buy",
      id: "hist-2",
      lots: "5.00",
      openTime: "16/04/2023 14:42:00",
      pnl: 500,
      priceRange: "1887.87 - 1888.87",
      symbol: "XAUUSD",
      swap: -0.9,
    },
    {
      closeTime: "18/04/2023 09:52:30",
      commission: 0,
      dealId: "90002335",
      delta: "△=10",
      direction: "buy",
      id: "hist-3",
      lots: "5.00",
      openTime: "18/04/2023 09:12:09",
      pnl: 500,
      priceRange: "1887.87 - 1888.87",
      symbol: "XAUUSD",
      swap: -0.9,
    },
    {
      closeTime: "19/04/2023 18:22:42",
      commission: 0,
      dealId: "90002336",
      delta: "△=10",
      direction: "sell",
      id: "hist-4",
      lots: "5.00",
      openTime: "19/04/2023 17:11:00",
      pnl: -500,
      priceRange: "1887.87 - 1888.87",
      symbol: "XAUUSD",
      swap: -0.9,
    },
    {
      closeTime: "22/04/2023 11:27:28",
      commission: 0,
      dealId: "90002337",
      delta: "△=10",
      direction: "buy",
      id: "hist-5",
      lots: "5.00",
      openTime: "22/04/2023 10:00:00",
      pnl: 500,
      priceRange: "1887.87 - 1888.87",
      symbol: "XAUUSD",
      swap: -0.9,
    },
  ];
}

function PartnerClientsScreen() {
  const { partnerClients, upgradeRequest } = useBroker();
  const { locale, t } = useProductSettings();
  const active = partnerClients.filter(
    (client) => client.status === "active",
  ).length;
  const volume = partnerClients.reduce(
    (total, client) => total + client.monthlyVolume,
    0,
  );
  const pending = partnerClients.filter(
    (client) => client.upgradeStatus === "pending",
  ).length;

  return (
    <Screen title={t("portfolio.partnerTitle")}>
      <Card highlight>
        <View style={styles.metricRow}>
          <Metric
            label={t("partner.activeClients")}
            tone="down"
            value={`${active}`}
          />
          <Metric
            label={t("partner.clientVolume")}
            value={formatVolumeMillions(volume, locale)}
          />
          <Metric
            label={t("upgrade.pendingCount")}
            tone="amber"
            value={`${pending}`}
          />
        </View>
      </Card>

      {upgradeRequest.status === "pending" ? (
        <View style={styles.sectionTitle}>
          <AppText variant="subtitle">{t("upgrade.pendingList")}</AppText>
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
                {client.country} · {client.joinedAt} ·{" "}
                {localizeText(client.lastActive, locale)} ·{" "}
                {client.role === "partner"
                  ? t("role.partner")
                  : t("role.trader")}
              </AppText>
            </View>
            <View style={styles.badgeStack}>
              <StatusPill
                compact
                label={statusLabel(client.status, locale)}
                tone={
                  client.status === "active"
                    ? "success"
                    : client.status === "funded"
                      ? "infoCircle"
                      : "neutral"
                }
              />
              {client.upgradeStatus !== "none" ? (
                <StatusPill
                  compact
                  label={t(`upgrade.status.${client.upgradeStatus}`)}
                  tone={
                    client.upgradeStatus === "approved"
                      ? "success"
                      : client.upgradeStatus === "pending"
                        ? "warning"
                        : "neutral"
                  }
                />
              ) : null}
            </View>
          </View>
          <View style={styles.grid}>
            <Metric
              label={t("partner.netDeposit")}
              value={formatMoney(client.netDeposit, "USD", 2, locale)}
            />
            <Metric
              label={t("partner.monthVolume")}
              value={formatVolumeMillions(client.monthlyVolume, locale)}
            />
            <Metric
              label={t("partner.openPositions")}
              value={`${client.openPositions}`}
            />
          </View>
          <ActionButton
            label={t("upgrade.viewProfile")}
            onPress={() => router.push(`/client/${client.id}`)}
            tone={client.upgradeStatus === "pending" ? "amber" : "neutral"}
          />
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  accountHeaderSide: {
    height: 44,
    width: 44,
  },
  accountMenuButton: {
    alignItems: "center",
    borderRadius: 999,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  accountPanel: {
    borderLeftWidth: 0,
    borderRadius: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    gap: 14,
    paddingBottom: 20,
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  accountPanelHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    minHeight: 52,
  },
  accountSelector: {
    alignItems: "center",
    alignSelf: "center",
    flexDirection: "row",
    gap: 6,
    minHeight: 20,
  },
  accountTitleBlock: {
    alignItems: "center",
    flex: 1,
    gap: 0,
    minWidth: 0,
  },
  badgeStack: {
    alignItems: "flex-end",
    gap: 5,
  },
  barChartWrap: {
    height: 210,
    justifyContent: "flex-end",
    marginTop: 4,
    position: "relative",
  },
  barFill: {
    borderRadius: 3,
    width: 16,
  },
  barRow: {
    alignItems: "flex-end",
    bottom: 26,
    flexDirection: "row",
    gap: 20,
    height: 156,
    left: 42,
    position: "absolute",
    right: 4,
  },
  barSlot: {
    alignItems: "center",
    flex: 1,
    height: "100%",
    justifyContent: "flex-end",
  },
  chartDateRow: {
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    left: 48,
    position: "absolute",
    right: 2,
  },
  chartGridLine: {
    flex: 1,
    height: 1,
  },
  chartGridRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    height: 32,
  },
  chartLegend: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  closedDetailRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 28,
  },
  closedOrderCard: {
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
    padding: 14,
  },
  closedOrderIdentity: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: 10,
    minWidth: 0,
  },
  closedOrderPnl: {
    alignItems: "flex-end",
  },
  closedOrderSheet: {
    gap: 12,
  },
  closedOrderTop: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
  },
  dealMeta: {
    gap: 6,
    marginTop: 12,
  },
  dealRow: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 12,
  },
  dealsTitle: {
    paddingBottom: 4,
  },
  detailInline: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  grid: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
    marginTop: 12,
  },
  metricRow: {
    flexDirection: "row",
    gap: 12,
  },
  accountMenuSheet: {
    gap: 16,
  },
  menuAccountHeader: {
    alignItems: "center",
    gap: 5,
    paddingBottom: 4,
    paddingTop: 8,
  },
  menuAccountNo: {
    textAlign: "center",
  },
  inlineTitle: {
    alignItems: "baseline",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
  },
  listCard: {
    paddingVertical: 0,
  },
  emptyStateCard: {
    gap: 12,
    justifyContent: "center",
    minHeight: 170,
  },
  emptyAction: {
    flex: 1,
    minHeight: 42,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  emptyActionRow: {
    flexDirection: "row",
    gap: 8,
    minHeight: 42,
  },
  emptyStateRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  emptyStateIcon: {
    alignItems: "center",
    borderRadius: 999,
    height: 48,
    justifyContent: "center",
    width: 48,
  },
  emptyStateText: {
    flex: 1,
    gap: 3,
    minWidth: 0,
  },
  historyDivider: {
    height: 6,
    marginHorizontal: -16,
  },
  historyFilterRow: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "flex-end",
  },
  historyOutcomeItem: {
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
  },
  historyOutcomeRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 14,
    paddingHorizontal: 2,
  },
  historyRowSide: {
    alignItems: "flex-end",
    justifyContent: "center",
    minWidth: 86,
  },
  historyChartCard: {
    gap: 10,
    padding: 14,
  },
  historySummaryCard: {
    gap: 12,
    padding: 14,
  },
  historySummaryGrid: {
    flexDirection: "row",
    marginHorizontal: -8,
  },
  historySummaryItem: {
    flex: 1,
    gap: 2,
    minWidth: 0,
    paddingHorizontal: 8,
  },
  historySummaryTitle: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  historySummaryTop: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
  },
  historyToolbar: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
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
    alignItems: "center",
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: 12,
    minHeight: 58,
    paddingVertical: 10,
  },
  orderSide: {
    alignItems: "flex-end",
    minWidth: 92,
  },
  orderContent: {
    gap: 10,
    minHeight: 242,
  },
  orderPageBody: {
    gap: 12,
    paddingHorizontal: 16,
  },
  orderTabButton: {
    alignItems: "center",
    flex: 1,
    gap: 7,
    height: 58,
    justifyContent: "center",
  },
  orderTabIndicator: {
    borderRadius: 999,
    height: 3,
    width: 64,
  },
  orderTabs: {
    borderBottomWidth: 1,
    flexDirection: "row",
    height: 58,
  },
  positionTop: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
  },
  positionOptionsSheet: {
    gap: 10,
    paddingTop: 2,
  },
  optionGroupCard: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
  },
  optionIconWrap: {
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  optionTextBlock: {
    flex: 1,
    gap: 3,
    minWidth: 0,
  },
  positionOptionRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  sheetGroupTitle: {
    paddingHorizontal: 2,
  },
  positionDetailSheet: {
    gap: 14,
  },
  positionDetailHero: {
    alignItems: "center",
    gap: 8,
    paddingBottom: 10,
  },
  positionDetailCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  positionDetailRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 14,
    justifyContent: "space-between",
    minHeight: 54,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    alignItems: "center",
    flexDirection: "row",
    height: 48,
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
  sectionAction: {
    alignItems: "center",
    justifyContent: "center",
  },
  tradeRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  tradeRowMain: {
    flex: 1,
    gap: 3,
    justifyContent: "center",
    minWidth: 0,
  },
  viewDetailsButton: {
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    minHeight: 58,
  },
});
