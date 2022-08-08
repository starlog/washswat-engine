import * as httpClient from './httpclient';
import * as config from './config';
import * as log4js from 'log4js';

const logger = log4js.getLogger('api.ts');
logger.level = 'DEBUG';

export function getUidFromAuthentication(xWashswatToken: string) {
  const configQuery = {
    method: 'get',
    url: config.getGlobalGatewayUrl() + '/authentication/v1/admin/verify',
    params: {},
    timeout: 3000,
    useRedis: false,
    RedisTtl: 100,
    headers: {
      'x-washswat-token': xWashswatToken,
    },
    retryConfig: {
      time: 3,
      interval: 10,
    },
  };
  return new Promise(async (resolve, reject) => {
    try {
      const result: any = await httpClient.call(configQuery);
      if (result.data.common.status !== 'success') {
        reject('Error:getUidFromAuthentication' + JSON.stringify(result.data));
      } else {
        resolve(result.data);
      }
    } catch (ex) {
      reject('getUidFromAuthentication try-catch err:' + ex);
    }
  });
}

export async function getAuthenticationFromUid(uid: number) {
  const configQuery = {
    method: 'post',
    url: config.getGlobalGatewayUrl() + '/authentication/v1/admin/create',
    params: {},
    timeout: 3000,
    useRedis: false,
    RedisTtl: 100,
    data: {
      data: {
        uid,
      },
    },
    retryConfig: {
      time: 3,
      interval: 10,
    },
  };
  return new Promise(async (resolve, reject) => {
    try {
      const result: any = await httpClient.call(configQuery);
      if (result.data.common.status !== 'success') {
        reject('Error:getAuthenticationFromUid' + JSON.stringify(result.data));
      } else {
        resolve(result.data);
      }
    } catch (ex) {
      reject('getAuthenticationFromUid try-catch err:' + ex);
    }
  });
}
