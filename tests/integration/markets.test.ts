import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app'; // Adjust path as needed

describe('Markets Endpoint Integration Tests', () => {
  const app = createApp();

  it('should return market data for valid request', async () => {
    const response = await request(app)
      .get('/api/markets')
      .query({ 
        vs_currency: 'usd', 
        order: 'market_cap_desc', 
        per_page: 10, 
        page: 1 
      });

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);

    // Validate market data structure
    const firstMarket = response.body[0];
    expect(firstMarket).toHaveProperty('id');
    expect(firstMarket).toHaveProperty('symbol');
    expect(firstMarket).toHaveProperty('name');
    expect(firstMarket).toHaveProperty('current_price');
    expect(firstMarket).toHaveProperty('market_cap');
  });

  it('should handle invalid currency parameter', async () => {
    const response = await request(app)
      .get('/api/markets')
      .query({ 
        vs_currency: 'invalid_currency', 
        order: 'market_cap_desc', 
        per_page: 10, 
        page: 1 
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('should handle invalid page parameter', async () => {
    const response = await request(app)
      .get('/api/markets')
      .query({ 
        vs_currency: 'usd', 
        order: 'market_cap_desc', 
        per_page: 10, 
        page: -1 
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('should respect per_page parameter', async () => {
    const perPage = 5;
    const response = await request(app)
      .get('/api/markets')
      .query({ 
        vs_currency: 'usd', 
        order: 'market_cap_desc', 
        per_page: perPage, 
        page: 1 
      });

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(perPage);
  });

  it('should support different sorting orders', async () => {
    const responseDesc = await request(app)
      .get('/api/markets')
      .query({ 
        vs_currency: 'usd', 
        order: 'market_cap_desc', 
        per_page: 10, 
        page: 1 
      });

    const responseAsc = await request(app)
      .get('/api/markets')
      .query({ 
        vs_currency: 'usd', 
        order: 'market_cap_asc', 
        per_page: 10, 
        page: 1 
      });

    expect(responseDesc.status).toBe(200);
    expect(responseAsc.status).toBe(200);
    
    // Ensure different order of markets (simplified check)
    expect(responseDesc.body[0].market_cap).not.toBe(responseAsc.body[0].market_cap);
  });
});