import type { LocalizedText } from './types';

export type DupoinMvpAction = {
  id: string;
  title: LocalizedText;
  subtitle: LocalizedText;
  icon: 'marketTrend' | 'taskChecklist' | 'accountBank' | 'achievementTrophy' | 'educationCap' | 'partnerNetwork' | 'supportHeadset' | 'riskShield';
  route: string;
};

export type DupoinMarketInsight = {
  id: string;
  category: LocalizedText;
  title: LocalizedText;
  body: LocalizedText;
  time: LocalizedText;
};

export type DupoinProfileItem = {
  id: string;
  label: LocalizedText;
  value: LocalizedText;
  status: 'ready' | 'review' | 'locked';
};

export const dupoinHeroStats = [
  { id: 'quotes', label: { 'en-US': 'Live markets', 'zh-CN': '实时行情' }, value: '42' },
  { id: 'wallet', label: { 'en-US': 'Demo equity', 'zh-CN': '模拟净值' }, value: '$50K' },
  { id: 'risk', label: { 'en-US': 'Risk mode', 'zh-CN': '风控模式' }, value: 'Demo' },
];

export const dupoinQuickActions: DupoinMvpAction[] = [
  {
    id: 'markets',
    icon: 'marketTrend',
    route: '/markets',
    subtitle: { 'en-US': 'FX, metals, indices', 'zh-CN': '外汇、贵金属、指数' },
    title: { 'en-US': 'Watch markets', 'zh-CN': '看行情' },
  },
  {
    id: 'order',
    icon: 'taskChecklist',
    route: '/order/eur-usd',
    subtitle: { 'en-US': 'EUR/USD ticket', 'zh-CN': 'EUR/USD 下单票' },
    title: { 'en-US': 'Trade demo', 'zh-CN': '模拟交易' },
  },
  {
    id: 'wallet',
    icon: 'accountBank',
    route: '/accounts',
    subtitle: { 'en-US': 'Equity and margin', 'zh-CN': '净值与保证金' },
    title: { 'en-US': 'Wallet', 'zh-CN': '钱包' },
  },
  {
    id: 'academy',
    icon: 'educationCap',
    route: '/discover',
    subtitle: { 'en-US': 'CFD risk primers', 'zh-CN': 'CFD 风险入门' },
    title: { 'en-US': 'Learn', 'zh-CN': '学习' },
  },
];

export const dupoinOnboardingSteps = [
  {
    id: 'identity',
    label: { 'en-US': 'Create profile', 'zh-CN': '创建身份' },
    state: { 'en-US': 'Done', 'zh-CN': '已完成' },
  },
  {
    id: 'risk',
    label: { 'en-US': 'Risk acknowledgement', 'zh-CN': '风险确认' },
    state: { 'en-US': 'Ready', 'zh-CN': '已就绪' },
  },
  {
    id: 'trade',
    label: { 'en-US': 'First demo trade', 'zh-CN': '首笔模拟交易' },
    state: { 'en-US': 'Next', 'zh-CN': '下一步' },
  },
];

export const dupoinInsights: DupoinMarketInsight[] = [
  {
    body: {
      'en-US': 'Gold volatility remains elevated ahead of the US session. Keep lot size small in demo orders.',
      'zh-CN': '美盘前黄金波动仍高，模拟下单建议控制手数。',
    },
    category: { 'en-US': 'Market brief', 'zh-CN': '市场简报' },
    id: 'gold-vol',
    time: { 'en-US': '10 min ago', 'zh-CN': '10 分钟前' },
    title: { 'en-US': 'XAU/USD tests the upper range', 'zh-CN': 'XAU/USD 测试上沿区间' },
  },
  {
    body: {
      'en-US': 'EUR/USD spread is stable in the simulated feed. Good pair for first order practice.',
      'zh-CN': '模拟报价中 EUR/USD 点差稳定，适合首单练习。',
    },
    category: { 'en-US': 'Beginner path', 'zh-CN': '新手路径' },
    id: 'eur-spread',
    time: { 'en-US': '32 min ago', 'zh-CN': '32 分钟前' },
    title: { 'en-US': 'Major FX pairs stay orderly', 'zh-CN': '主要货币对波动有序' },
  },
];

export const dupoinProfileItems: DupoinProfileItem[] = [
  {
    id: 'demo-account',
    label: { 'en-US': 'Demo trading account', 'zh-CN': '模拟交易账户' },
    status: 'ready',
    value: { 'en-US': 'Active', 'zh-CN': '已启用' },
  },
  {
    id: 'risk',
    label: { 'en-US': 'Risk notice', 'zh-CN': '风险提示' },
    status: 'ready',
    value: { 'en-US': 'Accepted', 'zh-CN': '已确认' },
  },
  {
    id: 'kyc',
    label: { 'en-US': 'Live account KYC', 'zh-CN': '真实账户 KYC' },
    status: 'locked',
    value: { 'en-US': 'Not connected', 'zh-CN': '未接入' },
  },
  {
    id: 'partner',
    label: { 'en-US': 'Partner program', 'zh-CN': 'Partner 计划' },
    status: 'review',
    value: { 'en-US': 'Demo preview', 'zh-CN': '演示预览' },
  },
];
