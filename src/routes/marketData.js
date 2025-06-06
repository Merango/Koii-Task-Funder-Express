import express from 'express';
import cryptoPrices from '../data/crypto-prices.json';

const router = express.Router();

/**
 * Fetches market data for multiple cryptocurrencies
 * @route GET /market-data
 * @param {string[]} ids - Comma-separated list of cryptocurrency IDs
 * @returns {Object} Market data for requested cryptocurrencies
 */
router.get('/', (req, res) => {
  try {
    const { ids } = req.query;

    // Validate input
    if (!ids) {
      return res.status(400).json({ 
        error: 'Missing required parameter: ids', 
        message: 'Please provide a comma-separated list of cryptocurrency IDs' 
      });
    }

    // Convert ids to array and trim whitespace
    const coinIds = String(ids).split(',').map(id => id.trim());

    // Validate each coin ID
    const invalidCoins = coinIds.filter(id => !cryptoPrices[id]);
    if (invalidCoins.length > 0) {
      return res.status(404).json({ 
        error: 'Invalid cryptocurrency IDs', 
        invalidCoins 
      });
    }

    // Fetch market data for requested coins
    const marketData = coinIds.reduce((acc, id) => {
      acc[id] = {
        id,
        symbol: cryptoPrices[id].symbol,
        name: cryptoPrices[id].name,
        current_price: cryptoPrices[id].current_price,
        market_cap: cryptoPrices[id].market_cap,
        market_cap_rank: cryptoPrices[id].market_cap_rank,
        total_volume: cryptoPrices[id].total_volume,
        price_change_percentage_24h: cryptoPrices[id].price_change_percentage_24h
      };
      return acc;
    }, {});

    res.json(marketData);
  } catch (error) {
    console.error('Error in market data route:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: 'Unable to fetch market data' 
    });
  }
});

export default router;