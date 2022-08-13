import * as async from 'async';
import * as axios from 'axios';
import * as log4js from 'log4js';
import moment from 'moment';
import * as Qs from 'qs';
import * as http from 'http';
import * as https from 'https';
// eslint-disable-next-line import/extensions,import/no-unresolved
import * as cache from './cache';
// eslint-disable-next-line import/extensions,import/no-unresolved
import * as util2 from './util2';

const logger = log4js.getLogger();
logger.level = 'DEBUG';
const REDIS_KEY_PREFIX = 'washswat-tool-http';

// Interfaces
export interface HttpInterface {
  status: boolean,
  message: string,
  data: any
}

const axiosClient = axios.default.create({
  httpAgent: new http.Agent({ keepAlive: true }),
  httpsAgent: new https.Agent({ keepAlive: true }),
});

function localCall(qo: any, callback: any) {
  logger.debug(`_call qo=${JSON.stringify(qo)}`);
  axiosClient({
    method: qo.method ? qo.method : '',
    url: qo.url ? qo.url : '',
    params: qo.params ? qo.params : {},
    paramsSerializer: (params) => Qs.stringify(params, { arrayFormat: 'brackets' }),
    timeout: qo.timeout ? qo.timeout : '300',
    data: qo.data ? qo.data : {},
    headers: qo.headers ? qo.headers : {},
  })
    .then((response) => {
      if (response.status === 200) {
        logger.debug(`_call success(1) url=${qo.url}`);
        callback(null, response);
      } else {
        logger.debug(`_call fail(1) url=${qo.url} (response.code=${response.status})`);
        callback(response.status, response);
      }
    })
    .catch((ex) => {
      if (ex.stack) {
        logger.error(`_call fail(2) url=${qo.url}\n${ex.stack}`);
      } else {
        logger.error(`_call fail(2) url=${qo.url}\n${ex}`);
      }
      callback(ex, ex.response);
    });
}

function localCallWithStatusCode(qo: any, expectedResultCode: any, callback: any) {
  logger.debug(`_callWithstuatusCode qo=${JSON.stringify(qo)}`);
  axiosClient({
    method: qo.method ? qo.method : '',
    url: qo.url ? qo.url : '',
    params: qo.params ? qo.params : {},
    paramsSerializer: (params) => Qs.stringify(params, { arrayFormat: 'brackets' }),
    timeout: qo.timeout ? qo.timeout : '300',
    data: qo.data ? qo.data : {},
    headers: qo.headers ? qo.headers : {},
  }).then((response) => {
    logger.debug(`_callWithStatusCode success(1) url=${qo.url}`);
    callback(null, response);
  }).catch((ex) => {
    if (ex.response && ex.response.status && expectedResultCode.includes(ex.response.status)) {
      logger.debug(`_callWithStatusCode success(2) url=${qo.url}(response.status=${ex.response.status})`);
      callback(null, ex.response);
    } else {
      if (ex.stack) {
        logger.debug(`_callWithStatusCode(error) url=${qo.url}\n${ex.stack}`);
      } else {
        logger.debug(`_callWithStatusCode(error) url=${qo.url}\n${ex}`);
      }
      callback(ex, ex.response);
    }
  });
}

export async function call(queryObject: any): Promise<HttpInterface> {
  if (queryObject?.url === undefined) {
    return { status: false, message: 'queryObject has no url', data: {} };
  }
  if (queryObject?.method === undefined) {
    return { status: false, message: 'queryObject has no method', data: {} };
  }
  const REDIS_KEY = util2.genHashKey(REDIS_KEY_PREFIX, { mode: 'call', data: queryObject });

  let returnVal: HttpInterface;

  let myData: any;
  if (queryObject.useCache) {
    myData = await cache.get(REDIS_KEY);
    logger.debug(`USING CACHE: data is ${util2.stringifyWithoutCircular(myData)}`);
    if (myData) {
      returnVal = { status: true, message: 'success', data: myData };
      return returnVal;
    }
  }
  if (!myData) {
    logger.debug('USING REST');
    const localStartTime = moment();
    async.retry(
      queryObject.retryConfig,
      async.apply(localCall, queryObject),
      async (err, result) => {
        const diff = moment().diff(localStartTime, 'milliseconds');
        logger.debug(`http.call execution time is ${diff} milliseconds.`);
        if (err) {
          logger.error(`httpClient.call async.retry error:${err}`);
          returnVal = { status: false, message: `httpClient.call async.retry error:${err}`, data: {} };
        } else {
          const saveData = {
            status: result.status,
            statusText: result.statusText,
            header: result.headers,
            data: result.data,
          };
          if (queryObject.useCache) {
            await cache.set(REDIS_KEY, saveData, queryObject.CacheTTL);
          }
          returnVal = { status: true, message: 'success', data: result };
        }
        return returnVal;
      },
    );
  }
  return { status: false, message: 'should not happen', data: {} };
}

export async function callWithComStatus(
  queryObject: any,
  expectedResultCode: any,
): Promise<HttpInterface> {
  if (queryObject?.url === undefined) {
    return { status: false, message: 'queryObject has no url', data: {} };
  }
  if (queryObject?.method === undefined) {
    return { status: false, message: 'queryObject has no method', data: {} };
  }
  const REDIS_KEY = util2.genHashKey(REDIS_KEY_PREFIX, { mode: 'call', data: queryObject });

  let returnVal: HttpInterface;

  let myData: any;
  if (queryObject.useCache) {
    myData = await cache.get(REDIS_KEY);
    logger.debug(`USING CACHE: data is ${util2.stringifyWithoutCircular(myData)}`);
    if (myData) {
      returnVal = { status: true, message: 'success', data: myData };
      return returnVal;
    }
  }
  if (!myData) {
    logger.debug('USING REST');
    const localStartTime = moment();
    async.retry(
      queryObject.retryConfig,
      async.apply(localCallWithStatusCode, queryObject, expectedResultCode),
      async (err, result) => {
        const diff = moment().diff(localStartTime, 'milliseconds');
        logger.debug(`http.callWithStatusCode execution time is ${diff} milliseconds.`);
        if (err) {
          logger.error(`httpClient.callWithComStatus async.retry error:${err}`);
          returnVal = { status: false, message: `httpClient.callWithComStatus async.retry error:${err}`, data: {} };
        } else {
          const saveData = {
            status: result.status,
            statusText: result.statusText,
            header: result.headers,
            data: result.data,
          };
          if (queryObject.useCache) {
            await cache.set(REDIS_KEY, saveData, queryObject.CacheTTL);
          }
          returnVal = { status: true, message: 'success', data: result };
        }
        return returnVal;
      },
    );
  }
  return { status: false, message: 'should not happen', data: {} };
}
