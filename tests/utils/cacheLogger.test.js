import { describe, it, expect, beforeEach, vi } from 'vitest';
import NodeCache from 'node-cache';
import { CacheMonitor, createCacheLogger } from '../../src/utils/cacheLogger.js';
import winston from 'winston';

describe('CacheMonitor', () => {
  let cache;
  let cacheMonitor;
  let mockLogger;

  beforeEach(() => {
    cache = new NodeCache();
    mockLogger = {
      info: vi.fn(),
      error: vi.fn()
    };
    cacheMonitor = new CacheMonitor(cache, mockLogger);
  });

  it('should log cache set operations', () => {
    cache.set('testKey', 'testValue', 100);
    
    expect(mockLogger.info).toHaveBeenCalledWith(
      expect.stringContaining('Cache Set: Key testKey')
    );
  });

  it('should track cache hits and misses', () => {
    // Initial stats
    expect(cacheMonitor.getStats().totalRequests).toBe(0);

    // Cache miss
    const missResult = cache.get('nonexistentKey');
    expect(missResult).toBeUndefined();
    
    // Check stats after miss
    const statsAfterMiss = cacheMonitor.getStats();
    expect(statsAfterMiss.misses).toBe(1);
    expect(statsAfterMiss.totalRequests).toBe(1);
    expect(mockLogger.info).toHaveBeenCalledWith(
      expect.stringContaining('Cache Miss: Key nonexistentKey')
    );

    // Cache hit
    cache.set('existingKey', 'value');
    const hitResult = cache.get('existingKey');
    expect(hitResult).toBe('value');

    // Check stats after hit
    const statsAfterHit = cacheMonitor.getStats();
    expect(statsAfterHit.hits).toBe(1);
    expect(statsAfterHit.totalRequests).toBe(2);
    expect(mockLogger.info).toHaveBeenCalledWith(
      expect.stringContaining('Cache Hit: Key existingKey')
    );
  });

  it('should calculate hit rate correctly', () => {
    cache.set('key1', 'value1');
    cache.get('key1'); // Hit
    cache.get('key2'); // Miss

    const stats = cacheMonitor.getStats();
    expect(stats.totalRequests).toBe(2);
    expect(stats.hits).toBe(1);
    expect(stats.misses).toBe(1);
    expect(stats.hitRate).toBe('50.00%');
  });

  it('should reset statistics', () => {
    cache.set('key1', 'value1');
    cache.get('key1'); // Hit
    cache.get('key2'); // Miss

    cacheMonitor.resetStats();
    
    const stats = cacheMonitor.getStats();
    expect(stats.totalRequests).toBe(0);
    expect(stats.hits).toBe(0);
    expect(stats.misses).toBe(0);
    expect(mockLogger.info).toHaveBeenCalledWith('Cache statistics reset');
  });
});

describe('createCacheLogger', () => {
  it('should create a winston logger', () => {
    const logger = createCacheLogger();
    
    expect(logger).toBeTruthy();
    expect(logger.transports.length).toBeGreaterThan(0);
  });
});