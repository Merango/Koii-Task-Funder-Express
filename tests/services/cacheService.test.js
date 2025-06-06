import { describe, it, expect, beforeEach } from 'vitest';
import cacheService from '../../src/services/cacheService.js';

describe('Cache Service', () => {
  beforeEach(() => {
    // Clear cache before each test
    cacheService.clear();
  });

  it('should set and get a value from cache', () => {
    const key = 'testKey';
    const value = { name: 'test' };

    cacheService.set(key, value);
    const cachedValue = cacheService.get(key);

    expect(cachedValue).toEqual(value);
  });

  it('should return undefined for non-existent key', () => {
    const cachedValue = cacheService.get('nonExistentKey');
    expect(cachedValue).toBeUndefined();
  });

  it('should delete a key from cache', () => {
    const key = 'deleteKey';
    const value = { name: 'delete test' };

    cacheService.set(key, value);
    cacheService.delete(key);

    const cachedValue = cacheService.get(key);
    expect(cachedValue).toBeUndefined();
  });

  it('should clear the entire cache', () => {
    cacheService.set('key1', { name: 'test1' });
    cacheService.set('key2', { name: 'test2' });

    cacheService.clear();

    expect(cacheService.get('key1')).toBeUndefined();
    expect(cacheService.get('key2')).toBeUndefined();
  });
});