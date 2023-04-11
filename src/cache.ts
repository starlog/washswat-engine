import NodeCache from 'node-cache';
import * as util2 from './util2';
import * as washLogger from './logger';
import { createClient } from 'redis';
let redisClient:any;
let isRedisInit = false;
let redisConfig:any = null;

const logger = washLogger.getLogger('washswat-engine:cache');

export interface RedisInitConfig {
  host: string,
  port: number,
  prefix: string,
}

const myCache: any = new NodeCache({ stdTTL: 600, checkperiod: 20 });
//--------------------------------------------------------------------------------------------------
export function isRedisEnabled(): boolean {
  return isRedisInit;
}

//--------------------------------------------------------------------------------------------------
export async function initRedis(redisInfo:RedisInitConfig): Promise<boolean> {
  let returnVal = false;
  if (isRedisInit) {
    returnVal = true;
  } else {
    try {
      const redisUrl = `redis://${redisInfo.host}:${redisInfo.port}`;
      redisClient = createClient({url: redisUrl});
      await redisClient.connect();
      redisConfig = JSON.parse(JSON.stringify(redisInfo));
      isRedisInit = true;
    } catch (err) {
      logger.error(`Redis connection failed. ${err}`);
    }
  }
  return returnVal;
}

//--------------------------------------------------------------------------------------------------
export async function set(cacheKey: string, value: object, ttlInSeconds: number): Promise<boolean> {
  if (isRedisInit) {
    const stringValue:string = util2.stringifyWithoutCircular(value);
    return await redisClient.setEx(`${redisConfig.prefix}${cacheKey}`, ttlInSeconds, stringValue);
  } else {
    // Removing circular reference
    const savingData = JSON.parse(util2.stringifyWithoutCircular(value));
    return myCache.set(cacheKey, savingData, ttlInSeconds);
  }
}
//--------------------------------------------------------------------------------------------------
export async function get(cacheKey: string): Promise<any> {
  if(isRedisInit) {
    const stringData = await redisClient.get(`${redisConfig.prefix}${cacheKey}`);
    return JSON.parse(stringData);
  } else {
    return myCache.get(cacheKey);
  }
}

