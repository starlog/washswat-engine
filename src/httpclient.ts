import * as async from 'async';
import * as axios from 'axios';
import * as log4js from 'log4js';
import * as util2 from './util2';
import moment from 'moment';
import * as Qs from 'qs';
import * as cache from './cache';
import * as http from 'http';
import * as https from 'https';

const logger = log4js.getLogger();
logger.level = 'DEBUG';
const REDIS_KEY_PREFIX = 'washswat-tool-http';

const axiosClient = axios.default.create({
  httpAgent: new http.Agent({ keepAlive: true }),
  httpsAgent: new https.Agent({ keepAlive: true }),
});

export async function call(queryObject: any) {
  return new Promise(async (resolve, reject) => {
    if (queryObject?.url === undefined) {
      reject('queryObject has no url');
      return;
    }
    if (queryObject?.method === undefined) {
      reject('queryObject has no method');
      return;
    }
    const REDIS_KEY = util2.genHashKey(REDIS_KEY_PREFIX, { mode: 'call', data: queryObject });

    let data: any;
    if (queryObject.useCache) {
      data = await cache.get(REDIS_KEY);
      logger.debug('USING CACHE: data is ' + util2.stringifyWithoutCircular(data));
      if (data) resolve(data);
    }

    if (!data) {
      logger.debug('USING REST');
      const _startTime = moment();
      async.retry(queryObject.retryConfig, async.apply(_call, queryObject), async (err, result) => {
        const diff = moment().diff(_startTime, 'milliseconds');
        logger.debug('http.call execution time is ' + diff + ' milliseconds.');
        if (err) {
          reject(err);
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
          resolve(result);
        }
      });
    }
  });
}

// ///////////////////////////////////////////////////////////////////////////////////////////////////
function _call(qo: any, callback: any) {
  logger.debug('_call qo=' + JSON.stringify(qo));
  axiosClient({
    method: qo.method ? qo.method : '',
    url: qo.url ? qo.url : '',
    params: qo.params ? qo.params : {},
    paramsSerializer: (params) => {
      return Qs.stringify(params, { arrayFormat: 'brackets' });
    },
    timeout: qo.timeout ? qo.timeout : '300',
    data: qo.data ? qo.data : {},
    headers: qo.headers ? qo.headers : {},
  })
    .then((response) => {
      if (response.status === 200) {
        logger.debug('_call success(1) url=' + qo.url);
        callback(null, response);
      } else {
        logger.debug('_call fail(1) url=' + qo.url + ' (response.code=' + response.status + ')');
        callback(response.status, response);
      }
    })
    .catch((ex) => {
      if (ex.stack) {
        logger.error('_call fail(2) url=' + qo.url + '\n' + ex.stack);
      } else {
        logger.error('_call fail(2) url=' + qo.url + '\n' + ex);
      }
      callback(ex, ex.response);
    });
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// exports.call = function (queryObject, retryConfig, callback)
// {
//     if (queryObject.useRedis && queryObject.RedisTtl)
//     {
//         let REDIS_KEY = util2.genHashKey(REDIS_KEY_PREFIX, {mode: 'call', data: queryObject});
//         redisCache.get(REDIS_KEY, function (err, result)
//         {
//             if (!err)
//             {
//                 logger.debug('httpclient:call - REDIS Cached, key=' + REDIS_KEY + ', data=' + result);
//                 callback(null, result);
//             }
//             else
//             {
//                 if (util2.isNullOrUndefinedOrEmpty(queryObject.method) || util2.isNullOrUndefinedOrEmpty(queryObject.url))
//                 {
//                     callback('call:require at least method and url');
//                 }
//                 else
//                 {
//                     if (!callback)
//                     {
//                         logger.error('httpclient:call callback is null');
//                     }
//                     let _startTime = moment();
//
//                     if (!queryObject.data)
//                     {
//                         queryObject.data = null;
//                     }
//                     async.retry(
//                         retryConfig,
//                         async.apply(_call, queryObject),
//                         function (err, result)
//                         {
//                             let diff = moment().diff(_startTime, 'miliseconds');
//                             logger.debug('http.call execution time is ' + diff + ' miliseconds.');
//
//                             if (err)
//                             {
//                                 callback(err, result);
//                             }
//                             else
//                             {
//                                 let saveData = {
//                                     status: result.status,
//                                     statusText: result.statusText,
//                                     header: result.headers,
//                                     // config: result.config, // causing circular JSON conversion
//                                     // request: result.request, // causing circular JSON conversion
//                                     data: result.data
//                                 };
//                                 redisCache.set(REDIS_KEY, saveData, queryObject.RedisTtl, function (err)
//                                 {
//                                     callback(null, result);
//                                 });
//                             }
//                         });
//                 }
//             }
//         });
//     }
//     else
//     {
//         if (util2.isNullOrUndefinedOrEmpty(queryObject.method) || util2.isNullOrUndefinedOrEmpty(queryObject.url))
//         {
//             callback('call:require at least method and url');
//         }
//         else
//         {
//             if (!callback)
//             {
//                 logger.error('httpclient:call callback is null');
//             }
//             let _startTime = moment();
//
//             if (!queryObject.data)
//             {
//                 queryObject.data = null;
//             }
//             async.retry(
//                 retryConfig,
//                 async.apply(_call, queryObject),
//                 function (err, result)
//                 {
//                     let diff = moment().diff(_startTime, 'miliseconds');
//                     logger.debug('http.call execution time is ' + diff + ' miliseconds.');
//                     callback(err, result);
//                 });
//         }
//     }
// };
// //////////////////////////////////////////////////////////////////////////////////////////////////
// exports.callWithComStatus = function (queryObject, retryConfig, expectedResultCode, callback)
// {
//     if (queryObject.useRedis && queryObject.RedisTtl)
//     {
//         let REDIS_KEY = util2.genHashKey(REDIS_KEY_PREFIX, {mode: 'callWithComStatus', data: queryObject});
//         redisCache.get(REDIS_KEY, function (err, result)
//         {
//             if (!err)
//             {
//                 logger.debug('httpclient:callWithComStatus - REDIS Cached, key=' + REDIS_KEY);
//                 callback(null, result);
//             }
//             else
//             {
//                 if (!callback)
//                 {
//                     logger.error('httpclient:callWithComStatus callback is null');
//                 }
//                 if (!queryObject.data)
//                 {
//                     queryObject.data = null;
//                 }
//
//                 let _startTime = moment();
//                 async.retry(
//                     retryConfig,
//                     async.apply(_callWithStatusCode, queryObject, expectedResultCode),
//                     function (err, result)
//                     {
//                         let diff = moment().diff(_startTime, 'miliseconds');
//                         logger.debug('http.callWithComStatus execution time is ' + diff + ' miliseconds.');
//                         if (err)
//                         {
//                             callback(err, result);
//                         }
//                         else
//                         {
//                             let saveData = {
//                                 status: result.status,
//                                 statusText: result.statusText,
//                                 header: result.headers,
//                                 config: result.config,
//                                 // request: result.request, // causing circular JSON conversion
//                                 data: result.data
//                             };
//
//                             redisCache.set(REDIS_KEY, saveData, queryObject.RedisTtl, function (err)
//                             {
//                                 callback(null, result);
//                             });
//                         }
//                     });
//             }
//         });
//     }
//     else
//     {
//         if (!callback)
//         {
//             logger.error('httpclient:callWithComStatus callback is null');
//         }
//         if (!queryObject.data)
//         {
//             queryObject.data = null;
//         }
//
//         let _startTime = moment();
//         async.retry(
//             retryConfig,
//             async.apply(_callWithStatusCode, queryObject, expectedResultCode),
//             function (err, result)
//             {
//                 let diff = moment().diff(_startTime, 'miliseconds');
//                 logger.debug('http.callWithComStatus execution time is ' + diff + ' miliseconds.');
//                 callback(err, result);
//             });
//     }
// };
//

// ///////////////////////////////////////////////////////////////////////////////////////////////////
// function _callWithStatusCode(qo, expectedResultCode, callback)
// {
//     logger.debug('_callWithstuatusCode qo=' + JSON.stringify(qo));
//     axiosClient({
//         method: qo.method ? qo.method : '',
//         url: qo.url ? qo.url : '',
//         params: qo.params ? qo.params : {},
//         paramsSerializer: function (params)
//         {
//             return Qs.stringify(params, {arrayFormat: 'brackets'})
//         },
//         timeout: qo.timeout ? qo.timeout : '300',
//         data: qo.data ? qo.data : {},
//         headers: qo.headers ? qo.headers : {},
//     }).then(function (response)
//     {
//         logger.debug('_callWithStatusCode success(1) url=' + qo.url);
//         callback(null, response);
//     }).catch(function (ex)
//     {
//         if (ex.response && ex.response.status && expectedResultCode.includes(ex.response.status))
//         {
//             logger.debug('_callWithStatusCode success(2) url=' + qo.url + '(response.status=' + ex.response.status + ')');
//             callback(null, ex.response);
//         }
//         else
//         {
//             if (ex.stack)
//             {
//                 logger.debug('_callWithStatusCode(error) url=' + qo.url + '\n' + ex.stack);
//             }
//             else
//             {
//                 logger.debug('_callWithStatusCode(error) url=' + qo.url + '\n' + ex);
//             }
//             callback(ex, ex.response);
//         }
//     });
// }
