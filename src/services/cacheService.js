import NodeCache from 'node-cache';

/**
 * Centralized caching service using node-cache
 */
class CacheService {
  constructor(ttl = 600) { // Default 10-minute TTL
    this.cache = new NodeCache({ 
      stdTTL: ttl,
      checkperiod: ttl * 1.1 
    });
  }

  /**
   * Get value from cache
   * @param {string} key - Cache key
   * @returns {*} Cached value or undefined
   */
  get(key) {
    return this.cache.get(key);
  }

  /**
   * Set value in cache
   * @param {string} key - Cache key
   * @param {*} value - Value to cache
   * @param {number} [ttl] - Optional time-to-live override
   */
  set(key, value, ttl) {
    return this.cache.set(key, value, ttl);
  }

  /**
   * Delete a key from cache
   * @param {string} key - Cache key to delete
   */
  delete(key) {
    return this.cache.del(key);
  }

  /**
   * Clear entire cache
   */
  clear() {
    return this.cache.flushAll();
  }
}

export const cacheService = new CacheService();
export default cacheService;