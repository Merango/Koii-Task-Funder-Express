import cryptoPrices from '../data/crypto-prices.json';

/**
 * Retrieve a list of coins with optional filtering
 * @param {Object} options - Optional filtering parameters
 * @param {number} options.limit - Maximum number of coins to return
 * @param {string} options.search - Case-insensitive search term
 * @returns {Array} Filtered list of coins
 */
export function getCoinsList(options = {}) {
  const { limit, search } = options;

  // Input validation
  if (limit !== undefined && (typeof limit !== 'number' || limit < 0)) {
    throw new Error('Limit must be a non-negative number');
  }

  if (search !== undefined && typeof search !== 'string') {
    throw new Error('Search term must be a string');
  }

  // Convert JSON object to array of coins
  let filteredCoins = Object.values(cryptoPrices);

  // Apply search filter (case-insensitive)
  if (search) {
    filteredCoins = filteredCoins.filter(coin => 
      coin.name.toLowerCase().includes(search.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Apply limit
  if (limit !== undefined) {
    filteredCoins = filteredCoins.slice(0, limit);
  }

  return filteredCoins;
}