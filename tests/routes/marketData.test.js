import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';
import marketDataRoute from '../../src/routes/marketData.js';

const app = express();
app.use('/market-data', marketDataRoute);

describe('Market Data Route', () => {
  it('should return market data for valid coin IDs', async () => {
    const response = await request(app)
      .get('/market-data')
      .query({ ids: 'bitcoin,ethereum' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('bitcoin');
    expect(response.body).toHaveProperty('ethereum');
    expect(response.body.bitcoin).toHaveProperty('current_price');
    expect(response.body.ethereum).toHaveProperty('market_cap');
  });

  it('should return 400 if no IDs are provided', async () => {
    const response = await request(app)
      .get('/market-data');

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('should return 404 for invalid coin IDs', async () => {
    const response = await request(app)
      .get('/market-data')
      .query({ ids: 'nonexistent-coin' });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('invalidCoins');
  });

  it('should handle multiple valid and invalid coin IDs', async () => {
    const response = await request(app)
      .get('/market-data')
      .query({ ids: 'bitcoin,nonexistent-coin,ethereum' });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('invalidCoins');
    expect(response.body.invalidCoins).toContain('nonexistent-coin');
  });
});