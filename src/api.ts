import * as httpClient from './httpclient';
import * as config from './config';
import * as log4js from 'log4js';
import moment from 'moment';

const logger = log4js.getLogger('api.ts');
logger.level = 'DEBUG';


export interface Token {
  common: {
    createdAt: string,
    status: string
  },
  data: object
}

export async function getUidFromAuthentication(xWashswatToken: string): Promise<Token> {
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
  try {
    const result: any = await httpClient.call(configQuery);
    if (result.data.common.status === 'success') {
      return result.data;
    } else {
      return {
        common: { createdAt: moment().valueOf().toString(), status: 'error' },
        data: { message: `Error:getUidFromAuthentication ${JSON.stringify(result.data)}` }
      };
    }
  } catch (ex) {
    return {
      common: { createdAt: moment().valueOf().toString(), status: 'error' },
      data: { message: `getUidFromAuthentication try-catch err:${ex}}` }
    };
  }
}

export async function getAuthenticationFromUid(uid: number): Promise<Token> {
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
  try {
    const result: any = await httpClient.call(configQuery);
    if (result.data.common.status !== 'success') {
      return {
        common: { createdAt: moment().valueOf().toString(), status: 'error' },
        data: { message: `Error:getAuthenticationFromUid ${JSON.stringify(result.data)}` }
      };
    } else {
      return {
        common: { createdAt: moment().valueOf().toString(), status: 'success' },
        data: result.data
      }
    }
  } catch (ex) {
    return {
      common: { createdAt: moment().valueOf().toString(), status: 'error' },
      data: { message: 'getAuthenticationFromUid try-catch err:' + ex }
    };
  }
}
