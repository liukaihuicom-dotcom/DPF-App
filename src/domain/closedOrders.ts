import type { Direction } from './types';

export type ClosedOrder = {
  closeTime: string;
  commission: number;
  dealId: string;
  delta: string;
  direction: Direction;
  id: string;
  lots: string;
  openTime: string;
  priceRange: string;
  pnl: number;
  symbol: string;
  swap: number;
};

export const closedOrderHistory: ClosedOrder[] = [
  {
    closeTime: '15/04/2023 12:27:28',
    commission: 0,
    dealId: '90002333',
    delta: '△=10',
    direction: 'buy',
    id: 'hist-1',
    lots: '5.00',
    openTime: '15/04/2023 12:00:00',
    pnl: 500,
    priceRange: '1887.87 - 1888.87',
    symbol: 'XAUUSD',
    swap: -0.9,
  },
  {
    closeTime: '16/04/2023 15:18:10',
    commission: 0,
    dealId: '90002334',
    delta: '△=10',
    direction: 'buy',
    id: 'hist-2',
    lots: '5.00',
    openTime: '16/04/2023 14:42:00',
    pnl: 500,
    priceRange: '1887.87 - 1888.87',
    symbol: 'XAUUSD',
    swap: -0.9,
  },
  {
    closeTime: '18/04/2023 09:52:30',
    commission: 0,
    dealId: '90002335',
    delta: '△=10',
    direction: 'buy',
    id: 'hist-3',
    lots: '5.00',
    openTime: '18/04/2023 09:12:09',
    pnl: 500,
    priceRange: '1887.87 - 1888.87',
    symbol: 'XAUUSD',
    swap: -0.9,
  },
  {
    closeTime: '19/04/2023 18:22:42',
    commission: 0,
    dealId: '90002336',
    delta: '△=10',
    direction: 'sell',
    id: 'hist-4',
    lots: '5.00',
    openTime: '19/04/2023 17:11:00',
    pnl: -500,
    priceRange: '1887.87 - 1888.87',
    symbol: 'XAUUSD',
    swap: -0.9,
  },
  {
    closeTime: '22/04/2023 11:27:28',
    commission: 0,
    dealId: '90002337',
    delta: '△=10',
    direction: 'buy',
    id: 'hist-5',
    lots: '5.00',
    openTime: '22/04/2023 10:00:00',
    pnl: 500,
    priceRange: '1887.87 - 1888.87',
    symbol: 'XAUUSD',
    swap: -0.9,
  },
];

export function getCloseDateTitle(order: Pick<ClosedOrder, 'closeTime'>) {
  const [day = '00', month = '00', year = '0000'] = order.closeTime.split(' ')[0]?.split('/') ?? [];
  return `${year}-${month}-${day}`;
}
