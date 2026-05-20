import type { Account, Position } from './types';

export type TradingAccountStatus = 'active' | 'readOnly' | 'disabled' | 'demo' | 'archived';

export type TradingAccountProfile = {
  id: string;
  accountNo: string;
  balance: number;
  currency: string;
  equity: number;
  freeMargin: number;
  group: TradingAccountStatus;
  lastTrade: string;
  leverage: string;
  marginLevel: number;
  platform: string;
  realizedPnl: number;
  server: string;
  type: string;
  unrealizedPnl: number;
  usedMargin: number;
};

export function buildTradingAccountProfiles(account: Account, positions: Position[]): TradingAccountProfile[] {
  const unrealizedPnl = positions.reduce((total, position) => total + position.unrealizedPnl, 0);
  const base = {
    accountNo: '900054',
    currency: account.currency,
    platform: 'MT5',
    server: 'DupoinMarkets-Live01',
    type: 'Standard',
  };

  return [
    {
      ...base,
      balance: account.balance + 8189,
      equity: account.equity + 6189,
      freeMargin: account.freeMargin + 6189,
      group: 'active',
      id: 'active-main',
      lastTrade: '2h ago',
      leverage: '1:100',
      marginLevel: 100189,
      realizedPnl: 89,
      unrealizedPnl: unrealizedPnl || -100,
      usedMargin: account.usedMargin + 6189,
    },
    {
      ...base,
      balance: 58189,
      equity: 58189,
      freeMargin: 41020,
      group: 'active',
      id: 'active-secondary',
      lastTrade: '2h ago',
      leverage: '1:100',
      marginLevel: 81240,
      realizedPnl: 42,
      unrealizedPnl: -100,
      usedMargin: 17169,
    },
    {
      ...base,
      balance: 58189,
      equity: 58189,
      freeMargin: 58189,
      group: 'readOnly',
      id: 'readonly-main',
      lastTrade: '2h ago',
      leverage: '1:100',
      marginLevel: 100189,
      realizedPnl: 0,
      unrealizedPnl: -100,
      usedMargin: 0,
    },
    {
      ...base,
      balance: 58189,
      equity: 58189,
      freeMargin: 58189,
      group: 'readOnly',
      id: 'readonly-copy',
      lastTrade: '2h ago',
      leverage: '1:100',
      marginLevel: 100189,
      realizedPnl: 0,
      unrealizedPnl: -100,
      usedMargin: 0,
    },
    {
      ...base,
      balance: 58189,
      equity: 58189,
      freeMargin: 0,
      group: 'disabled',
      id: 'disabled-main',
      lastTrade: '2h ago',
      leverage: '1:100',
      marginLevel: 0,
      realizedPnl: 0,
      unrealizedPnl: -100,
      usedMargin: 58189,
    },
    {
      ...base,
      balance: 58189,
      equity: 58189,
      freeMargin: 58189,
      group: 'demo',
      id: 'demo-main',
      lastTrade: '2h ago',
      leverage: '1:100',
      marginLevel: 100189,
      realizedPnl: 0,
      unrealizedPnl: -100,
      usedMargin: 0,
    },
    {
      ...base,
      balance: 58189,
      equity: 58189,
      freeMargin: 58189,
      group: 'archived',
      id: 'archived-main',
      lastTrade: '2h ago',
      leverage: '1:100',
      marginLevel: 100189,
      realizedPnl: 0,
      unrealizedPnl: -100,
      usedMargin: 0,
    },
  ];
}

export function getAccountStatusLabel(status: TradingAccountStatus, locale: 'en-US' | 'zh-CN') {
  const labels = {
    'en-US': {
      active: 'Active',
      archived: 'Archived',
      demo: 'Demo',
      disabled: 'Disabled',
      readOnly: 'Read only',
    },
    'zh-CN': {
      active: 'Active',
      archived: 'Archived',
      demo: 'Demo',
      disabled: 'Disabled',
      readOnly: 'Read only',
    },
  };

  return labels[locale][status];
}
