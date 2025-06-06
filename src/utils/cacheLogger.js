import winston from 'winston';
import NodeCache from 'node-cache';

/**
 * Create a logger for cache events
 * @returns {winston.Logger} Configured cache logger
 */
export const createCacheLogger = () => {
  return winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    transports: [
      // Log to console
      new winston.transports.Console({
        format: winston.format.simple()
      }),
      // Log to file
      new winston.transports.File({ 
        filename: 'logs/cache.log',
        level: 'info'
      })
    ]
  });
};

/**
 * Cache monitoring class to track cache performance
 */
export class CacheMonitor {
  constructor(cache, logger) {
    this.cache = cache;
    this.logger = logger || createCacheLogger();
    this.stats = {
      hits: 0,
      misses: 0,
      totalRequests: 0
    };

    // Wrap cache methods to monitor
    this.monitorCache();
  }

  /**
   * Monitor cache methods by adding logging and tracking
   */
  monitorCache() {
    const originalGet = this.cache.get.bind(this.cache);
    const originalSet = this.cache.set.bind(this.cache);

    this.cache.get = (key) => {
      this.stats.totalRequests++;
      const value = originalGet(key);
      
      if (value === undefined) {
        this.stats.misses++;
        this.logger.info(`Cache Miss: Key ${key}`);
      } else {
        this.stats.hits++;
        this.logger.info(`Cache Hit: Key ${key}`);
      }

      return value;
    };

    this.cache.set = (key, value, ttl) => {
      this.logger.info(`Cache Set: Key ${key}, TTL: ${ttl || 'default'}`);
      return originalSet(key, value, ttl);
    };
  }

  /**
   * Get current cache performance statistics
   * @returns {Object} Cache performance metrics
   */
  getStats() {
    const hitRate = this.stats.totalRequests > 0 
      ? (this.stats.hits / this.stats.totalRequests * 100).toFixed(2) 
      : 0;

    return {
      ...this.stats,
      hitRate: `${hitRate}%`
    };
  }

  /**
   * Reset cache statistics
   */
  resetStats() {
    this.stats = {
      hits: 0,
      misses: 0,
      totalRequests: 0
    };
    this.logger.info('Cache statistics reset');
  }
}