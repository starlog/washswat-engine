import NodeCache from 'node-cache';
import * as util2 from './util2';
import * as log4js from 'log4js';
import {configData} from './util2'

log4js.configure(configData);
// eslint-disable-next-line no-unused-vars
const logger = log4js.getLogger('washswat-engine:cache');

const myCache: any = new NodeCache({ stdTTL: 600, checkperiod: 20 });

export async function set(cacheKey: string, value: object, ttl: number): Promise<boolean> {
  // Removing circular reference
  const savingData = JSON.parse(util2.stringifyWithoutCircular(value));
  return myCache.set(cacheKey, savingData, ttl);
}

export async function get(cacheKey: string): Promise<any> {
  return myCache.get(cacheKey);
}
