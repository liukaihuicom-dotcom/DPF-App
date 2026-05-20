import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';

import { initialAccount, initialUpgradeRequest, instruments as initialInstruments, partnerClients as initialPartnerClients } from '@/src/domain/mockData';
import {
  applyQuote,
  createOrder,
  createPosition,
  moveQuote,
  recalculateAccount,
  refreshPositions,
} from '@/src/domain/trading';
import type { Account, Direction, Instrument, Order, OrderType, PartnerClient, Position, Role, UpgradeRequest } from '@/src/domain/types';
import { useProductSettings } from '@/src/settings/ProductSettings';

const UPGRADE_STORAGE_KEY = 'broker-fx-upgrade-state';
const QUOTE_WS_URL = 'wss://ws.dupoin.co.id/api/webtrade/v2/ws?login=0&sid=0';
const QUOTE_SYMBOLS = ['EURUSD', 'GBPUSD', 'AUDUSD', 'NZDUSD', 'USDJPY', 'USDCAD', 'USDCHF'];

type PlaceOrderInput = {
  instrumentId: string;
  direction: Direction;
  type: OrderType;
  lots: number;
  limitPrice?: number;
};

type BrokerStore = {
  role: Role;
  setRole: (role: Role) => void;
  instruments: Instrument[];
  account: Account;
  partnerClients: PartnerClient[];
  upgradeRequest: UpgradeRequest;
  positions: Position[];
  orders: Order[];
  submitUpgradeRequest: (reason: string) => void;
  approveUpgradeRequest: (clientId: string) => void;
  rejectUpgradeRequest: (clientId: string) => void;
  getPartnerClientProfile: (clientId: string) => PartnerClient | undefined;
  placeOrder: (input: PlaceOrderInput) => Order | null;
  modifyOrder: (orderId: string) => void;
  deleteOrder: (orderId: string) => void;
  closePosition: (positionId: string) => void;
  findInstrument: (id: string) => Instrument | undefined;
};

const BrokerContext = createContext<BrokerStore | null>(null);

type DupoinQuoteMessage = {
  t?: number;
  d?: {
    m?: string;
    s?: string;
    b?: { p?: number }[];
    a?: { p?: number }[];
  };
};

function normalizeQuoteSymbol(symbol: string) {
  return symbol.replace('/', '').toUpperCase();
}

function isSubscribedQuoteSymbol(instrument: Instrument) {
  return QUOTE_SYMBOLS.includes(normalizeQuoteSymbol(instrument.symbol));
}

function readStoredUpgradeState() {
  if (Platform.OS !== 'web' || typeof window === 'undefined' || !window.localStorage) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(UPGRADE_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as { partnerClients?: PartnerClient[]; upgradeRequest?: UpgradeRequest }) : null;
  } catch {
    return null;
  }
}

export function BrokerProvider({ children }: PropsWithChildren) {
  const { role, setRole } = useProductSettings();
  const storedUpgradeState = readStoredUpgradeState();
  const [tick, setTick] = useState(0);
  const [instruments, setInstruments] = useState(initialInstruments);
  const [baseAccount, setBaseAccount] = useState(initialAccount);
  const [partnerClients, setPartnerClients] = useState<PartnerClient[]>(storedUpgradeState?.partnerClients ?? initialPartnerClients);
  const [upgradeRequest, setUpgradeRequest] = useState<UpgradeRequest>(storedUpgradeState?.upgradeRequest ?? initialUpgradeRequest);
  const [positions, setPositions] = useState<Position[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [liveQuoteConnected, setLiveQuoteConnected] = useState(false);
  const [lastLiveQuoteAt, setLastLiveQuoteAt] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTick((value) => value + 1);
      const liveQuoteFresh = liveQuoteConnected && Date.now() - lastLiveQuoteAt < 8000;
      setInstruments((current) =>
        current.map((instrument) => (liveQuoteFresh && isSubscribedQuoteSymbol(instrument) ? instrument : moveQuote(instrument, tick + 1))),
      );
    }, 2400);

    return () => clearInterval(timer);
  }, [lastLiveQuoteAt, liveQuoteConnected, tick]);

  useEffect(() => {
    if (typeof WebSocket === 'undefined') {
      return;
    }

    const socket = new WebSocket(QUOTE_WS_URL);

    socket.onopen = () => {
      setLiveQuoteConnected(true);
      socket.send(JSON.stringify({ action: 3, data: { symbols: QUOTE_SYMBOLS }, type: 2 }));
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(String(event.data)) as DupoinQuoteMessage;
        const symbol = message.d?.s ?? message.d?.m;
        const bid = message.d?.b?.[0]?.p;
        const ask = message.d?.a?.[0]?.p;

        if (message.t !== 2 || !symbol || typeof bid !== 'number' || typeof ask !== 'number') {
          return;
        }

        setLastLiveQuoteAt(Date.now());
        setInstruments((current) =>
          current.map((instrument) => (normalizeQuoteSymbol(instrument.symbol) === normalizeQuoteSymbol(symbol) ? applyQuote(instrument, bid, ask) : instrument)),
        );
      } catch {
        // Ignore malformed quote payloads and keep the last known quote.
      }
    };

    socket.onerror = () => {
      setLiveQuoteConnected(false);
    };

    socket.onclose = () => {
      setLiveQuoteConnected(false);
    };

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    setPositions((current) => refreshPositions(current, instruments));
  }, [instruments]);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined' || !window.localStorage) {
      return;
    }

    window.localStorage.setItem(UPGRADE_STORAGE_KEY, JSON.stringify({ partnerClients, upgradeRequest }));
  }, [partnerClients, upgradeRequest]);

  const account = useMemo(() => recalculateAccount(baseAccount, positions), [baseAccount, positions]);

  const placeOrder = (input: PlaceOrderInput) => {
    const instrument = instruments.find((item) => item.id === input.instrumentId);

    if (!instrument) {
      return null;
    }

    const order = createOrder({ ...input, instrument });

    setOrders((current) => [order, ...current]);
    if (order.status === 'filled') {
      const position = createPosition(order);
      setPositions((current) => [position, ...current]);
    }
    return order;
  };

  const closePosition = (positionId: string) => {
    setPositions((current) => {
      const position = current.find((item) => item.id === positionId);

      if (!position) {
        return current;
      }

      setBaseAccount((accountValue) => ({
        ...accountValue,
        balance: accountValue.balance + position.unrealizedPnl,
      }));

      setOrders((existingOrders) => [
        {
          id: `cls-${Date.now()}`,
          instrumentId: position.instrumentId,
          symbol: position.symbol,
          direction: position.direction === 'buy' ? 'sell' : 'buy',
          type: 'market',
          lots: position.lots,
          requestedPrice: position.currentPrice,
          filledPrice: position.currentPrice,
          marginRequired: 0,
          status: 'closed',
          createdAt: new Date().toLocaleString('zh-CN', {
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
        ...existingOrders,
      ]);

      return current.filter((item) => item.id !== positionId);
    });
  };

  const modifyOrder = (orderId: string) => {
    setOrders((current) =>
      current.map((order) =>
        order.id === orderId
          ? {
              ...order,
              lots: Number((order.lots + 0.01).toFixed(2)),
              marginRequired: Number((order.marginRequired * 1.002).toFixed(2)),
            }
          : order,
      ),
    );
  };

  const deleteOrder = (orderId: string) => {
    setOrders((current) => current.filter((order) => order.id !== orderId));
  };

  const submitUpgradeRequest = (reason: string) => {
    if (upgradeRequest.status === 'pending') {
      return;
    }

    const submittedAt = new Date().toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

    setUpgradeRequest({
      applicantClientId: 'client-001',
      applicantName: '陈思远',
      id: `upgrade-${Date.now()}`,
      messages: [
        {
          author: 'trader',
          body: {
            'en-US': reason,
            'zh-CN': reason,
          },
          createdAt: submittedAt,
          id: `msg-${Date.now()}`,
        },
        {
          author: 'superior',
          body: {
            'en-US': 'Application received. I will review your client activation plan from the Partner desk.',
            'zh-CN': '申请已收到，我会在 Partner 工作台审核你的客户激活计划。',
          },
          createdAt: submittedAt,
          id: `msg-reply-${Date.now()}`,
        },
      ],
      reason,
      status: 'pending',
      submittedAt,
      superiorName: 'Dupoin IB Desk',
    });
    setPartnerClients((current) =>
      current.map((client) =>
        client.id === 'client-001' ? { ...client, role: 'trader', upgradeStatus: 'pending', superiorName: 'Dupoin IB Desk' } : client,
      ),
    );
  };

  const approveUpgradeRequest = (clientId: string) => {
    setPartnerClients((current) =>
      current.map((client) => (client.id === clientId ? { ...client, role: 'partner', upgradeStatus: 'approved' } : client)),
    );
    if (clientId === upgradeRequest.applicantClientId) {
      setUpgradeRequest((current) => ({
        ...current,
        status: 'approved',
        messages: [
          ...current.messages,
          {
            author: 'superior',
            body: {
              'en-US': 'Approved. Your Partner workspace is now enabled in this local demo.',
              'zh-CN': '已批准。你的 Partner 工作台已在本地演示中启用。',
            },
            createdAt: new Date().toLocaleString('zh-CN', {
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            }),
            id: `msg-approved-${Date.now()}`,
          },
        ],
      }));
      setRole('partner');
    }
  };

  const rejectUpgradeRequest = (clientId: string) => {
    setPartnerClients((current) =>
      current.map((client) => (client.id === clientId ? { ...client, role: 'trader', upgradeStatus: 'rejected' } : client)),
    );
    if (clientId === upgradeRequest.applicantClientId) {
      setUpgradeRequest((current) => ({ ...current, status: 'rejected' }));
    }
  };

  const value = useMemo(
    () => ({
      role,
      setRole,
      instruments,
      account,
      partnerClients,
      upgradeRequest,
      positions,
      orders,
      submitUpgradeRequest,
      approveUpgradeRequest,
      rejectUpgradeRequest,
      getPartnerClientProfile: (clientId: string) => partnerClients.find((client) => client.id === clientId),
      placeOrder,
      modifyOrder,
      deleteOrder,
      closePosition,
      findInstrument: (id: string) => instruments.find((instrument) => instrument.id === id),
    }),
    [account, instruments, orders, partnerClients, positions, role, upgradeRequest],
  );

  return <BrokerContext.Provider value={value}>{children}</BrokerContext.Provider>;
}

export function useBroker() {
  const context = useContext(BrokerContext);

  if (!context) {
    throw new Error('useBroker must be used inside BrokerProvider');
  }

  return context;
}
