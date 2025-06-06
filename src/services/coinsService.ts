import { CoinListItem } from '../types/coins';

interface GetCoinsOptions {
  limit?: number;
}

const mockCoins: CoinListItem[] = [
  { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin' },
  { id: 'ethereum', symbol: 'eth', name: 'Ethereum' },
  { id: 'cardano', symbol: 'ada', name: 'Cardano' },
  // Add more mock coins as needed
];

export async function getCoins(options: GetCoinsOptions = {}): Promise<CoinListItem[]> {
  const { limit } = options;

  if (limit && limit < 0) {
    throw new Error('Limit must be a positive number');
  }

  return limit ? mockCoins.slice(0, limit) : mockCoins;
}