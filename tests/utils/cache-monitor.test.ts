import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CacheMonitor, cacheMonitor } from '../../src/utils/cache-monitor';
import winston from 'winston';

describe('CacheMonitor', () => {
  let monitor: CacheMonitor;

  beforeEach(() => {
    monitor = new CacheMonitor();
    
    // Mock winston logger methods to prevent actual logging during tests
    vi.spyOn(monitor['logger'], 'info').mockImplementation(() => true as any);
    vi.spyOn(monitor['logger'], 'warn').mockImplementation(() => true as any);
    vi.spyOn(monitor['logger'], 'error').mockImplementation(() => true as any);
  });

  it('should log cache hit', () => {
    const logSpy = vi.spyOn(monitor['logger'], 'info');
    monitor.logHit('test-key');
    
    expect(logSpy).toHaveBeenCalledWith('Cache Hit', {
      event: 'hit',
      key: 'test-key',
      source: 'memory'
    });
  });

  it('should log cache miss', () => {
    const logSpy = vi.spyOn(monitor['logger'], 'warn');
    monitor.logMiss('test-key', 'redis');
    
    expect(logSpy).toHaveBeenCalledWith('Cache Miss', {
      event: 'miss',
      key: 'test-key',
      source: 'redis'
    });
  });

  it('should log cache set', () => {
    const logSpy = vi.spyOn(monitor['logger'], 'info');
    const testValue = { data: 'example' };
    monitor.logSet('test-key', testValue, 3600);
    
    expect(logSpy).toHaveBeenCalledWith('Cache Set', {
      event: 'set',
      key: 'test-key',
      valueType: 'object',
      valueSize: JSON.stringify(testValue).length,
      ttl: 3600
    });
  });

  it('should log cache delete', () => {
    const logSpy = vi.spyOn(monitor['logger'], 'info');
    monitor.logDelete('test-key');
    
    expect(logSpy).toHaveBeenCalledWith('Cache Delete', {
      event: 'delete',
      key: 'test-key'
    });
  });

  it('should log cache error', () => {
    const logSpy = vi.spyOn(monitor['logger'], 'error');
    const testError = new Error('Test error');
    const context = { operation: 'read' };
    
    monitor.logError(testError, context);
    
    expect(logSpy).toHaveBeenCalledWith('Cache Error', {
      message: testError.message,
      stack: testError.stack,
      operation: 'read'
    });
  });

  it('should export a singleton instance', () => {
    expect(cacheMonitor).toBeInstanceOf(CacheMonitor);
  });
});