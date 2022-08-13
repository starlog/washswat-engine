import NodeCache from 'node-cache';
import * as log4js from 'log4js';

const myCache: any = new NodeCache();

const logger = log4js.getLogger('cache');
logger.level = 'debug';

export async function set(cacheKey: string, value: object, ttl: number): Promise<boolean> {
  myCache.set(cacheKey, value, ttl);
  return true;
}

export async function get(cacheKey: string): Promise<any> {
  return myCache.get(cacheKey);
}
