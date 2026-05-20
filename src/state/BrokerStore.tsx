import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';

import { initialAccount, initialUpgradeRequest, instruments as initialInstruments, partnerClients as initialPartnerClients } from '@/src/domain/mockData';
import {
  createOrder,
  createPosition,
  moveQuote,
  recalculateAccount,
  refreshPositions,
} from '@/src/domain/trading';
import type { Account, Direction, Instrument, Order, OrderType, PartnerClient, Position, Role, UpgradeRequest } from '@/src/domain/types';
import { useProductSettings } from '@/src/settings/ProductSettings';

const UPGRADE_STORAGE_KEY = 'broker-fx-upgrade-state';

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
  closePosition: (positionId: string) => void;
  findInstrument: (id: string) => Instrument | undefined;
};

const BrokerContext = createContext<BrokerStore | null>(null);

function readStoredUpgradeState() {
  if (typeof window === 'undefined') {
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

  useEffect(() => {
    const timer = setInterval(() => {
      setTick((value) => value + 1);
      setInstruments((current) => current.map((instrument) => moveQuote(instrument, tick + 1)));
    }, 2400);

    return () => clearInterval(timer);
  }, [tick]);

  useEffect(() => {
    setPositions((current) => refreshPositions(current, instruments));
  }, [instruments]);

  useEffect(() => {
    if (typeof window === 'undefined') {
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
    const position = createPosition(order);

    setOrders((current) => [order, ...current]);
    setPositions((current) => [position, ...current]);
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
