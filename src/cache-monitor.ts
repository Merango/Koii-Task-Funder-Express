import { EventEmitter } from 'events';

/**
 * CacheMonitor provides comprehensive logging and monitoring for cache operations
 */
export class CacheMonitor {
  private eventEmitter: EventEmitter;
  private stats: {
    hits: number;
    misses: number;
    sets: number;
    deletes: number;
  };

  constructor() {
    this.eventEmitter = new EventEmitter();
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0
    };
  }

  /**
   * Record a cache hit
   * @param key Cache key
   */
  recordHit(key: string): void {
    this.stats.hits++;
    this.eventEmitter.emit('hit', key);
  }

  /**
   * Record a cache miss
   * @param key Cache key
   */
  recordMiss(key: string): void {
    this.stats.misses++;
    this.eventEmitter.emit('miss', key);
  }

  /**
   * Record a cache set operation
   * @param key Cache key
   */
  recordSet(key: string): void {
    this.stats.sets++;
    this.eventEmitter.emit('set', key);
  }

  /**
   * Record a cache delete operation
   * @param key Cache key
   */
  recordDelete(key: string): void {
    this.stats.deletes++;
    this.eventEmitter.emit('delete', key);
  }

  /**
   * Get current cache statistics
   */
  getStats() {
    return { ...this.stats };
  }

  /**
   * Add an event listener for cache events
   * @param event Event type
   * @param listener Event listener
   */
  on(event: 'hit' | 'miss' | 'set' | 'delete', listener: (key: string) => void) {
    this.eventEmitter.on(event, listener);
  }

  /**
   * Reset cache statistics
   */
  resetStats(): void {
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0
    };
  }
}

// Create a singleton instance
export const cacheMonitor = new CacheMonitor();