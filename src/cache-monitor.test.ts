import { describe, it, expect, beforeEach } from 'vitest';
import { CacheMonitor, cacheMonitor } from './cache-monitor';

describe('CacheMonitor', () => {
  let monitor: CacheMonitor;

  beforeEach(() => {
    monitor = new CacheMonitor();
  });

  it('should record cache hits', () => {
    monitor.recordHit('test-key');
    const stats = monitor.getStats();
    expect(stats.hits).toBe(1);
  });

  it('should record cache misses', () => {
    monitor.recordMiss('test-key');
    const stats = monitor.getStats();
    expect(stats.misses).toBe(1);
  });

  it('should record cache sets', () => {
    monitor.recordSet('test-key');
    const stats = monitor.getStats();
    expect(stats.sets).toBe(1);
  });

  it('should record cache deletes', () => {
    monitor.recordDelete('test-key');
    const stats = monitor.getStats();
    expect(stats.deletes).toBe(1);
  });

  it('should reset statistics', () => {
    monitor.recordHit('key1');
    monitor.recordMiss('key2');
    monitor.resetStats();
    const stats = monitor.getStats();
    expect(stats).toEqual({
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0
    });
  });

  it('should emit events for cache operations', () => {
    return new Promise<void>((resolve) => {
      const key = 'test-event-key';
      
      monitor.on('hit', (eventKey) => {
        expect(eventKey).toBe(key);
        resolve();
      });

      monitor.recordHit(key);
    });
  });

  // Singleton test
  it('should have a consistent singleton instance', () => {
    cacheMonitor.recordHit('singleton-key');
    const stats = cacheMonitor.getStats();
    expect(stats.hits).toBeGreaterThan(0);
  });
});