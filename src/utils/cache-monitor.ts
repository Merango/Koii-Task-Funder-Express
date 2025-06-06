import winston from 'winston';

/**
 * CacheMonitor provides advanced monitoring and logging for cache operations
 */
export class CacheMonitor {
  private logger: winston.Logger;

  constructor() {
    // Configure a dedicated cache logger
    this.logger = winston.createLogger({
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
        // Log to a file
        new winston.transports.File({ 
          filename: 'logs/cache.log',
          maxsize: 5 * 1024 * 1024, // 5MB max file size
          maxFiles: 5 // Keep 5 log files before rotating
        })
      ]
    });
  }

  /**
   * Log a cache hit event
   * @param key - The cache key accessed
   * @param source - The source of the cache (e.g., 'memory', 'redis')
   */
  logHit(key: string, source: string = 'memory'): void {
    this.logger.info('Cache Hit', { 
      event: 'hit', 
      key, 
      source 
    });
  }

  /**
   * Log a cache miss event
   * @param key - The cache key that was not found
   * @param source - The source of the cache (e.g., 'memory', 'redis')
   */
  logMiss(key: string, source: string = 'memory'): void {
    this.logger.warn('Cache Miss', { 
      event: 'miss', 
      key, 
      source 
    });
  }

  /**
   * Log a cache set event
   * @param key - The cache key being set
   * @param value - The value being cached (truncated for log size)
   * @param ttl - Time to live for the cache entry
   */
  logSet(key: string, value: any, ttl?: number): void {
    this.logger.info('Cache Set', { 
      event: 'set', 
      key, 
      valueType: typeof value,
      valueSize: JSON.stringify(value).length,
      ttl 
    });
  }

  /**
   * Log a cache delete event
   * @param key - The cache key being deleted
   */
  logDelete(key: string): void {
    this.logger.info('Cache Delete', { 
      event: 'delete', 
      key 
    });
  }

  /**
   * Log a cache error
   * @param error - The error that occurred
   * @param context - Additional context about the error
   */
  logError(error: Error, context?: any): void {
    this.logger.error('Cache Error', { 
      message: error.message,
      stack: error.stack,
      ...context 
    });
  }
}

// Create a singleton instance
export const cacheMonitor = new CacheMonitor();