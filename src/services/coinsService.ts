import { CoinListItem } from '../types/coins';

interface GetCoinsOptions {
  limit?: number;
}

const mockCoins: CoinListItem[] = [
  { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin' },
  { id: 'ethereum', symbol: 'eth', name: 'Ethereum' },
  { id: 'cardano', symbol: 'ada', name: 'Cardano' },
  { id: 'dogecoin', symbol: 'doge', name: 'Dogecoin' },
  { id: 'ripple', symbol: 'xrp', name: 'Ripple' },
  { id: 'polkadot', symbol: 'dot', name: 'Polkadot' },
  { id: 'uniswap', symbol: 'uni', name: 'Uniswap' },
  { id: 'litecoin', symbol: 'ltc', name: 'Litecoin' },
  { id: 'chainlink', symbol: 'link', name: 'Chainlink' },
  { id: 'stellar', symbol: 'xlm', name: 'Stellar' },
  { id: 'eos', symbol: 'eos', name: 'EOS' }
];

export async function getCoins(options: GetCoinsOptions = {}): Promise<CoinListItem[]> {
  const { limit } = options;

  if (limit && limit < 0) {
    throw new Error('Limit must be a positive number');
  }

  return limit ? mockCoins.slice(0, limit) : mockCoins;
}