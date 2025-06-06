import { describe, it, expect } from 'vitest';
import { getCoinsList } from '../routes/coinsList.js';
import cryptoPrices from '../data/crypto-prices.json';

describe('Coins List Endpoint', () => {
  it('should return a list of coins with correct structure', () => {
    const coinsList = getCoinsList();
    
    expect(Array.isArray(coinsList)).toBe(true);
    expect(coinsList.length).toBeGreaterThan(0);
    
    const firstCoin = coinsList[0];
    expect(firstCoin).toHaveProperty('id');
    expect(firstCoin).toHaveProperty('symbol');
    expect(firstCoin).toHaveProperty('name');
  });

  it('should filter coins based on optional parameters', () => {
    const allCoins = getCoinsList();
    const filteredCoins = getCoinsList({ limit: 4 });
    
    expect(filteredCoins.length).toBe(4);
    expect(filteredCoins.length).toBeLessThanOrEqual(allCoins.length);
  });

  it('should handle case-insensitive search', () => {
    const bitcoinCoins = getCoinsList({ search: 'bitcoin' });
    const BitcoinCoins = getCoinsList({ search: 'Bitcoin' });
    
    expect(bitcoinCoins.length).toEqual(BitcoinCoins.length);
  });

  it('should return an empty array if no coins match search', () => {
    const nonExistentCoins = getCoinsList({ search: 'XYZ_NONEXISTENT_COIN' });
    
    expect(nonExistentCoins.length).toBe(0);
  });

  // Error handling test
  it('should handle invalid input gracefully', () => {
    expect(() => getCoinsList({ limit: -1 })).toThrow();
    expect(() => getCoinsList({ search: 123 })).toThrow();
  });
});