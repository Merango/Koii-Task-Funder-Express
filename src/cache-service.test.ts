import { describe, it, expect, beforeEach } from 'vitest';
import CacheService from './cache-service';

describe('CacheService', () => {
  let cacheService: CacheService;

  beforeEach(() => {
    cacheService = CacheService.getInstance();
    cacheService.clear(); // Clear cache before each test
  });

  it('should create a singleton instance', () => {
    const instance1 = CacheService.getInstance();
    const instance2 = CacheService.getInstance();
    expect(instance1).toBe(instance2);
  });

  it('should set and get a value', () => {
    const key = 'testKey';
    const value = { data: 'testValue' };
    
    const setResult = cacheService.set(key, value);
    expect(setResult).toBeTruthy();

    const retrievedValue = cacheService.get(key);
    expect(retrievedValue).toEqual(value);
  });

  it('should throw an error when setting invalid values', () => {
    expect(() => cacheService.set('', 'value')).toThrowError();
    expect(() => cacheService.set('key', undefined)).toThrowError();
  });

  it('should return undefined for non-existent keys', () => {
    const retrievedValue = cacheService.get('nonExistentKey');
    expect(retrievedValue).toBeUndefined();
  });

  it('should delete a key', () => {
    const key = 'deleteKey';
    cacheService.set(key, 'value');
    
    const deleteResult = cacheService.delete(key);
    expect(deleteResult).toBe(1);
    expect(cacheService.get(key)).toBeUndefined();
  });

  it('should check key existence', () => {
    const key = 'existenceKey';
    cacheService.set(key, 'value');
    
    expect(cacheService.has(key)).toBeTruthy();
    cacheService.delete(key);
    expect(cacheService.has(key)).toBeFalsy();
  });

  it('should get cache statistics', () => {
    const stats = cacheService.getStats();
    expect(stats).toHaveProperty('keys');
    expect(stats).toHaveProperty('hits');
    expect(stats).toHaveProperty('misses');
  });
});