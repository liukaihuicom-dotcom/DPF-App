import type { Href } from 'expo-router';

import type { AppIconName } from '@/src/components/AppIcon';
import type { TranslationKey } from '@/src/i18n/translations';
import type { LocalizedText } from './types';

export type FundingOperation = 'deposit' | 'withdrawal' | 'internal_transfer';

export type FundingOperationRoute = '/funding/deposit' | '/funding/withdrawal' | '/funding/transfer';

export type FundingOperationEntry = {
  icon: AppIconName;
  labelKey: TranslationKey;
  operation: FundingOperation;
  route: FundingOperationRoute;
  routeLabel: FundingOperationRoute;
  tone: FundingOperationTone;
};

export type FundingOperationTone = 'deposit' | 'withdraw' | 'transfer';

export type FundingOperationAction = {
  href: Href;
  icon: AppIconName;
  label: string;
  operation: FundingOperation;
  tone: FundingOperationTone;
};

export const fundingOperationEntries: FundingOperationEntry[] = [
  {
    icon: 'icon.wallet.deposit',
    labelKey: 'funding.action.deposit',
    operation: 'deposit',
    route: '/funding/deposit',
    routeLabel: '/funding/deposit',
    tone: 'deposit',
  },
  {
    icon: 'icon.wallet.withdrawal',
    labelKey: 'funding.action.withdrawal',
    operation: 'withdrawal',
    route: '/funding/withdrawal',
    routeLabel: '/funding/withdrawal',
    tone: 'withdraw',
  },
  {
    icon: 'icon.wallet.transfer',
    labelKey: 'funding.action.transfer',
    operation: 'internal_transfer',
    route: '/funding/transfer',
    routeLabel: '/funding/transfer',
    tone: 'transfer',
  },
];

export const fundingOperationRouteByOperation: Record<FundingOperation, FundingOperationRoute> = fundingOperationEntries.reduce(
  (routes, entry) => ({ ...routes, [entry.operation]: entry.route }),
  {} as Record<FundingOperation, FundingOperationRoute>,
);

export type FundingStatus =
  | 'draft'
  | 'submitted'
  | 'awaiting_payment'
  | 'payment_confirmed'
  | 'fx_locked'
  | 'crediting'
  | 'validating'
  | 'reviewing'
  | 'processing'
  | 'paid'
  | 'completed'
  | 'rejected'
  | 'expired'
  | 'failed'
  | 'cancelled';

export type FundingMethodType = 'bank_transfer' | 'virtual_account' | 'e_wallet';

export type FundingErrorCode =
  | 'FUNDING_PERMISSION_DENIED'
  | 'FUNDING_ACCOUNT_NOT_ACTIVE'
  | 'FUNDING_KYC_REQUIRED'
  | 'FUNDING_LIMIT_EXCEEDED'
  | 'FUNDING_METHOD_UNAVAILABLE'
  | 'DEPOSIT_PAYMENT_EXPIRED'
  | 'DEPOSIT_AMOUNT_MISMATCH'
  | 'DEPOSIT_NAME_MISMATCH'
  | 'WITHDRAWAL_INSUFFICIENT_BALANCE'
  | 'WITHDRAWAL_BANK_ACCOUNT_UNVERIFIED'
  | 'WITHDRAWAL_REVIEW_REQUIRED'
  | 'TRANSFER_SAME_ACCOUNT_NOT_ALLOWED'
  | 'TRANSFER_OWNER_MISMATCH'
  | 'TRANSFER_TARGET_RESTRICTED'
  | 'FX_QUOTE_EXPIRED'
  | 'FX_RATE_UNAVAILABLE'
  | 'FEE_RULE_MISSING';

export type FundingAccountStatus = 'active' | 'demo' | 'readOnly' | 'disabled' | 'archived';

export type FundingTradingAccount = {
  accountNo: string;
  balance: number;
  currency: 'USD';
  equity: number;
  freeMargin: number;
  group: FundingAccountStatus;
  id: string;
  label: string;
  ownerId: string;
  server: string;
};

export type FundingPaymentMethod = {
  available: boolean;
  estimatedMinutes: number;
  icon: AppIconName;
  id: string;
  label: LocalizedText & { 'id-ID': string };
  maintenanceNote?: LocalizedText & { 'id-ID': string };
  type: FundingMethodType;
};

export type FundingFee = {
  currency: 'IDR' | 'USD';
  feeAmount: number;
  feeType: 'fixed' | 'percentage' | 'fixed_plus_percentage' | 'none';
};

export type FundingFxQuote = {
  expiresAt: string;
  fxQuoteId: string;
  pair: 'USDIDR';
  rate: number;
};

export type FundingRuleConfig = {
  dailyLimit: number;
  fee: FundingFee;
  fxQuote: FundingFxQuote;
  maxAmount: number;
  minAmount: number;
  monthlyLimit: number;
  operation: FundingOperation;
};

export type FundingAuditContext = {
  actor: string;
  actorRole: string;
  requestId: string;
};

export type FundingMutationMeta = {
  auditContext: FundingAuditContext;
  clientRequestId: string;
  idempotencyKey: string;
  riskAcknowledged: boolean;
};

export type FundingTimelineItem = {
  at: string;
  label: LocalizedText & { 'id-ID': string };
  status: FundingStatus;
};

export type FundingTransaction = {
  actualUsdAmount?: number;
  amount: number;
  createdAt: string;
  errorCode?: FundingErrorCode;
  fee: FundingFee;
  fxQuote?: FundingFxQuote;
  id: string;
  method?: FundingPaymentMethod;
  note: LocalizedText & { 'id-ID': string };
  operation: FundingOperation;
  reference: string;
  requestedIdrAmount?: number;
  requestedUsdAmount?: number;
  riskFlags: string[];
  sourceTradingAccountId?: string;
  status: FundingStatus;
  targetTradingAccountId?: string;
  timeline: FundingTimelineItem[];
  tradingAccountId?: string;
  updatedAt: string;
};

export type FundingTransactionFilters = {
  operation?: FundingOperation | 'all';
  status?: FundingStatus | 'all';
  tradingAccountId?: string;
};

export type CreateDepositPayload = FundingMutationMeta & {
  fxQuoteId: string;
  paymentMethodId: string;
  requestedIdrAmount: number;
  tradingAccountId: string;
};

export type CreateWithdrawalPayload = FundingMutationMeta & {
  fxQuoteId: string;
  paymentMethodId: string;
  payoutAccountId: string;
  requestedIdrAmount: number;
  tradingAccountId: string;
};

export type CreateTransferPayload = FundingMutationMeta & {
  requestedUsdAmount: number;
  sourceTradingAccountId: string;
  targetTradingAccountId: string;
};

export function isFundingFinalStatus(status: FundingStatus) {
  return ['completed', 'rejected', 'expired', 'failed', 'cancelled'].includes(status);
}

export function isFundingActiveAccount(account?: Pick<FundingTradingAccount, 'group'> | null) {
  return account?.group === 'active';
}

export function getFundingOperationIcon(operation: FundingOperation): AppIconName {
  if (operation === 'withdrawal') {
    return 'icon.wallet.withdrawal';
  }

  if (operation === 'internal_transfer') {
    return 'icon.wallet.transfer';
  }

  return 'icon.wallet.deposit';
}

export function getFundingOperationRoute(operation: FundingOperation): FundingOperationRoute {
  return fundingOperationRouteByOperation[operation];
}

export function getFundingOperationHref(operation: FundingOperation, accountId?: string): Href {
  if (!accountId) {
    return getFundingOperationRoute(operation);
  }

  return {
    params: { accountId },
    pathname: getFundingOperationRoute(operation),
  };
}

export function getFundingOperationActions(t: (key: TranslationKey) => string, accountId?: string): FundingOperationAction[] {
  return fundingOperationEntries.map((entry) => ({
    icon: entry.icon,
    href: getFundingOperationHref(entry.operation, accountId),
    label: t(entry.labelKey),
    operation: entry.operation,
    tone: entry.tone,
  }));
}

export function getFundingSignedAmount(transaction: FundingTransaction) {
  if (transaction.operation === 'withdrawal') {
    return -Math.abs(transaction.actualUsdAmount ?? transaction.requestedUsdAmount ?? transaction.amount);
  }

  if (transaction.operation === 'internal_transfer') {
    return -Math.abs(transaction.requestedUsdAmount ?? transaction.amount);
  }

  return Math.abs(transaction.actualUsdAmount ?? transaction.requestedUsdAmount ?? transaction.amount);
}

export function buildFundingMeta(actor = 'local-demo-user', actorRole = 'trader'): FundingMutationMeta {
  const stamp = Date.now().toString(36);

  return {
    auditContext: {
      actor,
      actorRole,
      requestId: `req_${stamp}`,
    },
    clientRequestId: `client_${stamp}`,
    idempotencyKey: `idem_${stamp}`,
    riskAcknowledged: true,
  };
}
