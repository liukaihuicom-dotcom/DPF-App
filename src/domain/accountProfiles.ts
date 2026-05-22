import type { Account, Position } from './types';

export type TradingAccountStatus = 'active' | 'readOnly' | 'disabled' | 'demo' | 'archived';
export type TradingAccountScenario = 'default' | 'stateAnalysis';
export type TradingAccountStatusPreset = 'scenario' | 'mixed' | TradingAccountStatus;
export type TradingAccountCountPreset = 'scenario' | 'single' | 'three' | 'seven' | 'twelve';
export type TradingAccountDataPreset = 'scenario' | 'balanced' | 'marginStress' | 'noActivity' | 'drawdown';

export type TradingAccountManagementSettings = {
  countPreset: TradingAccountCountPreset;
  dataPreset: TradingAccountDataPreset;
  statusPreset: TradingAccountStatusPreset;
};

export const tradingAccountStatusGroups = ['active', 'readOnly', 'disabled', 'demo', 'archived'] as const satisfies readonly TradingAccountStatus[];
export const tradingAccountStatusPresets = [
  'scenario',
  'mixed',
  'active',
  'readOnly',
  'disabled',
  'demo',
  'archived',
] as const satisfies readonly TradingAccountStatusPreset[];
export const tradingAccountCountPresets = ['scenario', 'single', 'three', 'seven', 'twelve'] as const satisfies readonly TradingAccountCountPreset[];
export const tradingAccountDataPresets = [
  'scenario',
  'balanced',
  'marginStress',
  'noActivity',
  'drawdown',
] as const satisfies readonly TradingAccountDataPreset[];

const countByPreset: Record<Exclude<TradingAccountCountPreset, 'scenario'>, number> = {
  single: 1,
  three: 3,
  seven: 7,
  twelve: 12,
};

const mixedStatusCycle: TradingAccountStatus[] = ['active', 'active', 'readOnly', 'readOnly', 'disabled', 'demo', 'archived'];

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

export function buildTradingAccountProfiles(
  account: Account,
  positions: Position[],
  scenario: TradingAccountScenario = 'default',
  management?: TradingAccountManagementSettings,
): TradingAccountProfile[] {
  if (management && !usesScenarioManagement(management)) {
    return buildManagedTradingAccounts(account, positions, scenario, management);
  }

  if (scenario === 'default') {
    return [buildDefaultDemoTradingAccount(account, positions)];
  }

  return buildStateAnalysisTradingAccounts(account, positions);
}

function usesScenarioManagement(management: TradingAccountManagementSettings) {
  return management.countPreset === 'scenario' && management.dataPreset === 'scenario' && management.statusPreset === 'scenario';
}

function buildDefaultDemoTradingAccount(account: Account, positions: Position[]): TradingAccountProfile {
  const unrealizedPnl = positions.reduce((total, position) => total + position.unrealizedPnl, 0);

  return {
    accountNo: account.accountId,
    balance: account.balance,
    currency: account.currency,
    equity: account.equity,
    freeMargin: account.freeMargin,
    group: 'demo',
    id: 'demo-main',
    lastTrade: positions.length > 0 ? 'Live session' : 'No trades yet',
    leverage: account.leverageProfile,
    marginLevel: account.marginLevel,
    platform: 'MT5',
    realizedPnl: 0,
    server: account.server,
    type: 'Demo Standard',
    unrealizedPnl,
    usedMargin: account.usedMargin,
  };
}

function buildStateAnalysisTradingAccounts(account: Account, positions: Position[]): TradingAccountProfile[] {
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

function buildManagedTradingAccounts(
  account: Account,
  positions: Position[],
  scenario: TradingAccountScenario,
  management: TradingAccountManagementSettings,
): TradingAccountProfile[] {
  const scenarioCount = scenario === 'stateAnalysis' ? mixedStatusCycle.length : 1;
  const count = management.countPreset === 'scenario' ? scenarioCount : countByPreset[management.countPreset];
  const dataPreset = management.dataPreset === 'scenario' ? 'balanced' : management.dataPreset;
  const unrealizedPnl = positions.reduce((total, position) => total + position.unrealizedPnl, 0);

  return Array.from({ length: count }, (_, index) => {
    const group = resolveManagedStatus(index, scenario, management.statusPreset);
    return buildManagedTradingAccount(account, group, dataPreset, index, unrealizedPnl);
  });
}

function resolveManagedStatus(index: number, scenario: TradingAccountScenario, preset: TradingAccountStatusPreset): TradingAccountStatus {
  if (preset === 'scenario') {
    return scenario === 'stateAnalysis' ? mixedStatusCycle[index % mixedStatusCycle.length] : 'demo';
  }

  if (preset === 'mixed') {
    return mixedStatusCycle[index % mixedStatusCycle.length];
  }

  return preset;
}

function buildManagedTradingAccount(
  account: Account,
  group: TradingAccountStatus,
  dataPreset: Exclude<TradingAccountDataPreset, 'scenario'>,
  index: number,
  sourceUnrealizedPnl: number,
): TradingAccountProfile {
  const accountNo = group === 'demo' && index === 0 ? account.accountId : String(900054 + index).padStart(6, '0');
  const balance = getManagedBalance(account, index, dataPreset);
  const realizedPnl = dataPreset === 'noActivity' ? 0 : dataPreset === 'drawdown' ? -120 - index * 35 : 60 + index * 18;
  let unrealizedPnl = getManagedUnrealizedPnl(sourceUnrealizedPnl, balance, index, dataPreset);
  let equity = Math.max(0, balance + unrealizedPnl);
  let usedMargin = getManagedUsedMargin(equity, group, index, dataPreset);
  let freeMargin = Math.max(0, equity - usedMargin);
  let marginLevel = usedMargin > 0 ? (equity / usedMargin) * 100 : 100189;
  let lastTrade = dataPreset === 'noActivity' ? 'No trades yet' : index === 0 ? 'Live session' : `${index + 1}h ago`;

  if (group === 'disabled') {
    usedMargin = equity;
    freeMargin = 0;
    marginLevel = 0;
    lastTrade = 'Disabled';
  }

  if (group === 'archived') {
    usedMargin = 0;
    freeMargin = equity;
    marginLevel = 100189;
    lastTrade = 'Archived';
  }

  if (group === 'readOnly') {
    usedMargin = dataPreset === 'marginStress' ? usedMargin : 0;
    freeMargin = Math.max(0, equity - usedMargin);
    marginLevel = usedMargin > 0 ? (equity / usedMargin) * 100 : 100189;
    lastTrade = dataPreset === 'noActivity' ? 'No trades yet' : 'Read only';
  }

  if (dataPreset === 'noActivity') {
    unrealizedPnl = 0;
    equity = balance;
    usedMargin = 0;
    freeMargin = equity;
    marginLevel = 100189;
  }

  return {
    accountNo,
    balance,
    currency: account.currency,
    equity,
    freeMargin,
    group,
    id: `account-${accountNo}`,
    lastTrade,
    leverage: group === 'demo' ? account.leverageProfile : index % 2 === 0 ? '1:100' : '1:200',
    marginLevel,
    platform: 'MT5',
    realizedPnl,
    server: group === 'demo' ? account.server : 'DupoinMarkets-Live01',
    type: getManagedAccountType(group),
    unrealizedPnl,
    usedMargin,
  };
}

function getManagedBalance(account: Account, index: number, dataPreset: Exclude<TradingAccountDataPreset, 'scenario'>) {
  if (dataPreset === 'marginStress') {
    return Math.max(12000, account.balance - index * 1200);
  }

  if (dataPreset === 'drawdown') {
    return account.balance + index * 1600;
  }

  return account.balance + index * 2500;
}

function getManagedUnrealizedPnl(
  sourceUnrealizedPnl: number,
  balance: number,
  index: number,
  dataPreset: Exclude<TradingAccountDataPreset, 'scenario'>,
) {
  if (dataPreset === 'noActivity') {
    return 0;
  }

  if (dataPreset === 'marginStress') {
    return -Math.max(600, balance * 0.045 + index * 180);
  }

  if (dataPreset === 'drawdown') {
    return -Math.max(1200, balance * 0.08 + index * 260);
  }

  if (index === 0 && sourceUnrealizedPnl !== 0) {
    return sourceUnrealizedPnl;
  }

  return index % 2 === 0 ? 120 + index * 20 : -100 - index * 15;
}

function getManagedUsedMargin(
  equity: number,
  group: TradingAccountStatus,
  index: number,
  dataPreset: Exclude<TradingAccountDataPreset, 'scenario'>,
) {
  if (group === 'demo' || group === 'active') {
    if (dataPreset === 'marginStress') {
      return Math.max(1, equity * 0.92);
    }

    if (dataPreset === 'drawdown') {
      return Math.max(1, equity * 0.36);
    }

    return index === 0 ? Math.max(0, equity * 0.12) : Math.max(0, equity * (0.12 + (index % 3) * 0.04));
  }

  return 0;
}

function getManagedAccountType(group: TradingAccountStatus) {
  const types: Record<TradingAccountStatus, string> = {
    active: 'Standard',
    archived: 'Archived',
    demo: 'Demo Standard',
    disabled: 'Disabled',
    readOnly: 'Read only',
  };

  return types[group];
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
      active: '活跃',
      archived: '已归档',
      demo: '模拟',
      disabled: '已禁用',
      readOnly: '只读',
    },
  };

  return labels[locale][status];
}
