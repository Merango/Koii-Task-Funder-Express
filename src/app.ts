import express from 'express';

// Dummy market data generation function
function generateMarketData(params: any) {
  const currencies = ['bitcoin', 'ethereum', 'ripple', 'cardano', 'solana', 'polkadot', 'dogecoin', 'binancecoin', 'tether', 'litecoin'];
  const { vs_currency, order, per_page, page } = params;

  // Basic validation
  if (!['usd', 'eur', 'btc'].includes(vs_currency)) {
    throw new Error('Invalid currency');
  }

  if (page < 1) {
    throw new Error('Invalid page number');
  }

  // Generate mock data
  return currencies
    .slice((page - 1) * per_page, page * per_page)
    .map((id, index) => ({
      id,
      symbol: id.slice(0, 3),
      name: id.charAt(0).toUpperCase() + id.slice(1),
      current_price: Math.random() * 1000,
      market_cap: Math.random() * 1000000000,
      rank: index + 1
    }));
}

export function createApp() {
  const app = express();

  app.use(express.json());

  app.get('/api/markets', (req, res) => {
    try {
      const { vs_currency, order, per_page = 10, page = 1 } = req.query;

      if (!vs_currency) {
        return res.status(400).json({ error: 'Currency is required' });
      }

      const markets = generateMarketData({ 
        vs_currency: vs_currency as string, 
        order: order as string, 
        per_page: Number(per_page), 
        page: Number(page) 
      });

      res.json(markets);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  return app;
}