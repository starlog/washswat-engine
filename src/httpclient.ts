import axios from 'axios';
import * as http from 'http';
import * as https from 'https';
import * as util2 from './util2';
import * as cache from './cache';
import * as _ from 'lodash';
import * as washLogger from './logger';

const logger = washLogger.getLogger('washswat-engine:http');

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
  params: any,
  timeout: number,
  useCache: boolean,
  cacheTtl: number,
  retryConfig: RestQueryRetryConfig,
  headers: any,
  body: any,
  auth: any,
}
const sleep = (ms:number) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});


async function callOne(qo: RestQueryInterface) {
  const res = await axios({
    method: qo.method,
    url: qo.url,
    params: !_.isEmpty(qo.params) ? qo.params : undefined,
    timeout: qo.timeout ? qo.timeout : 300,
    data: !_.isEmpty(qo.body) ? qo.body : undefined,
    headers: !_.isEmpty(qo.headers) ? qo.headers : undefined,
    auth: !_.isEmpty(qo.auth) ? qo.auth : undefined,
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
    httpAgent: new http.Agent({ keepAlive: true }),
    httpsAgent: new https.Agent({ keepAlive: true }),
  });
  return res;
}

async function call2(qo: RestQueryInterface) {
  let result: any;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < qo.retryConfig.times; i++) {
    try {
      // eslint-disable-next-line no-await-in-loop
      result = await callOne(qo);
      break;
    } catch (ex) {
      logger.debug(`got error: ${ex}`);
      result = ex;
      // eslint-disable-next-line no-await-in-loop,no-promise-executor-return
      await new Promise((f) => setTimeout(f, qo.retryConfig.interval));
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
      logger.info(`CACHED! ${JSON.stringify(qo)}`);
      result = myData;
    } else {
      logger.info(`NOT CACHED! ${JSON.stringify(qo)}`);
    }
  }
  if (!result) {
    if(qo?.retryConfig?.times > 1){
      for(let i=0; i < qo.retryConfig.times; i++) {
        const myData = await callOne(qo);
        if (qo.useCache && myData !== null) {
          await cache.set(REDIS_KEY, myData, qo.cacheTtl);
        }
        result = myData;
        if(result.status === 200){
          break;
        }
        console.log(`Washswat:httpClient retrying ${i+1} of ${util2.stringifyWithoutCircular(qo)}... ${util2.stringifyWithoutCircular(result)}`);
        await sleep(qo.retryConfig.interval);
      }
    } else {
      const myData = await callOne(qo);
      if (qo.useCache && myData !== null) {
        await cache.set(REDIS_KEY, myData, qo.cacheTtl);
      }
      result = myData;
    }
  }
  return result;
}
