import { describe, it, expect } from 'vitest';
import { validateMarketsParams } from './validation';

describe('Markets Endpoint Validation', () => {
  it('should validate required vs_currency', () => {
    expect(() => validateMarketsParams({ vs_currency: 'usd' })).not.toThrow();
    expect(() => validateMarketsParams({ vs_currency: '' })).toThrow('vs_currency is required');
    expect(() => validateMarketsParams({ vs_currency: 123 as any })).toThrow('vs_currency is required');
  });

  it('should validate ids', () => {
    expect(() => validateMarketsParams({ 
      vs_currency: 'usd', 
      ids: ['bitcoin', 'ethereum'] 
    })).not.toThrow();
    
    expect(() => validateMarketsParams({ 
      vs_currency: 'usd', 
      ids: 'bitcoin' as any 
    })).toThrow('ids must be an array of strings');
  });

  it('should validate order', () => {
    const validOrders = ['market_cap_desc', 'market_cap_asc', 'volume_desc', 'volume_asc', 'id_desc', 'id_asc'];
    
    validOrders.forEach(order => {
      expect(() => validateMarketsParams({ 
        vs_currency: 'usd', 
        order 
      })).not.toThrow();
    });

    expect(() => validateMarketsParams({ 
      vs_currency: 'usd', 
      order: 'invalid_order' 
    })).toThrow('Invalid order');
  });

  it('should validate per_page', () => {
    expect(() => validateMarketsParams({ 
      vs_currency: 'usd', 
      per_page: 50 
    })).not.toThrow();
    
    expect(() => validateMarketsParams({ 
      vs_currency: 'usd', 
      per_page: 0 
    })).toThrow('per_page must be an integer between 1 and 250');
    
    expect(() => validateMarketsParams({ 
      vs_currency: 'usd', 
      per_page: 300 
    })).toThrow('per_page must be an integer between 1 and 250');
  });

  it('should validate page', () => {
    expect(() => validateMarketsParams({ 
      vs_currency: 'usd', 
      page: 1 
    })).not.toThrow();
    
    expect(() => validateMarketsParams({ 
      vs_currency: 'usd', 
      page: 0 
    })).toThrow('page must be a positive integer');
  });

  it('should validate sparkline', () => {
    expect(() => validateMarketsParams({ 
      vs_currency: 'usd', 
      sparkline: true 
    })).not.toThrow();
    
    expect(() => validateMarketsParams({ 
      vs_currency: 'usd', 
      sparkline: false 
    })).not.toThrow();
    
    expect(() => validateMarketsParams({ 
      vs_currency: 'usd', 
      sparkline: 'true' as any 
    })).toThrow('sparkline must be a boolean');
  });
});