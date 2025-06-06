import { describe, it, expect } from 'vitest';
import { getCoins } from '../services/coinsService'; // Assumed service file
import { CoinListItem } from '../types/coins'; // Assumed type definition

describe('Coins List Endpoint', () => {
  it('should return a non-empty array of coins', async () => {
    const coins = await getCoins();
    
    expect(Array.isArray(coins)).toBe(true);
    expect(coins.length).toBeGreaterThan(0);
  });

  it('should return coins with correct structure', async () => {
    const coins = await getCoins();
    const firstCoin = coins[0];

    expect(firstCoin).toHaveProperty('id');
    expect(firstCoin).toHaveProperty('symbol');
    expect(firstCoin).toHaveProperty('name');
    
    // Validate individual properties
    expect(typeof firstCoin.id).toBe('string');
    expect(typeof firstCoin.symbol).toBe('string');
    expect(typeof firstCoin.name).toBe('string');
  });

  it('should handle pagination', async () => {
    const limitedCoins = await getCoins({ limit: 10 });
    expect(limitedCoins.length).toBe(10);
  });

  it('should return unique coins', async () => {
    const coins = await getCoins();
    const uniqueCoins = new Set(coins.map(coin => coin.id));
    
    expect(uniqueCoins.size).toBe(coins.length);
  });

  // Error handling test
  it('should handle invalid pagination parameters', async () => {
    await expect(getCoins({ limit: -1 })).rejects.toThrow();
  });
});