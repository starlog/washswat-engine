import * as axios from 'axios';
import * as Qs from 'qs';
import * as http from 'http';
import * as https from 'https';
import * as util2 from './util2';
import * as cache from './cache';

const logger = util2.getLogger('washswat-engine:http');

const REDIS_KEY_PREFIX = 'washswat-tool-http';

// Interfaces
export interface HttpInterface {
  status: boolean,
  message: string,
  data: any
}

export interface RestQueryRetryConfig {
  times: number,
  interval: number,
}

export interface RestQueryInterface {
  method: string,
  url: string,
  params: object,
  timeout: number,
  useCache: boolean,
  cacheTtl: number,
  retryConfig: RestQueryRetryConfig,
  headers: any,
  body: object
}

const axiosClient = axios.default.create({
  httpAgent: new http.Agent({ keepAlive: true }),
  httpsAgent: new https.Agent({ keepAlive: true }),
});

async function callOne(qo: RestQueryInterface): Promise<any> {
  const res = await axiosClient({
    method: qo.method,
    url: qo.url,
    params: qo.params ? qo.params : {},
    paramsSerializer: (params) => Qs.stringify(params, { arrayFormat: 'brackets' }),
    timeout: qo.timeout ? qo.timeout : 300,
    data: qo.body ? qo.body : {},
    headers: qo.headers ? qo.headers : {},
  });
  return res;
}

async function call2(qo: RestQueryInterface): Promise<any> {
  let result: any;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < qo.retryConfig.times; i++) {
    try {
      // eslint-disable-next-line no-await-in-loop
      result = await callOne(qo);
      break;
    } catch (ex) {
      logger.debug('got error');
    }
  }
  return result;
}

export async function call(qo: RestQueryInterface): Promise<any> {
  let result: any;
  const REDIS_KEY = util2.genHashKey(REDIS_KEY_PREFIX, qo);

  if (qo.useCache) {
    const myData = await cache.get(REDIS_KEY);
    if (myData) {
      logger.debug('CACHED!');
      result = myData;
    } else {
      logger.debug('NOT CACHED!');
    }
  }
  if (!result) {
    const myData = await call2(qo);
    if (qo.useCache) {
      await cache.set(REDIS_KEY, myData, qo.cacheTtl);
    }
    result = myData;
  }
  return result;
}
