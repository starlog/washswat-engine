import moment from 'moment';
import { HttpInterface, RestQueryInterface } from './httpclient';
import * as httpClient from './httpclient';
import * as config from './config';
import * as washLogger from './logger';
import jwtDecode from 'jwt-decode';

const logger = washLogger.getLogger('washswat-engine:api');

export interface Token {
  common: {
    createdAt: string,
    status: string,
    message: string
  },
  data: any
}

export async function getUidFromAuthentication(xWashswatToken: string): Promise<Token> {
  logger.debug('getUidFromAuthentication start');
  let returnVal: Token;
  const configQuery: RestQueryInterface = {
    auth: undefined,
    body: {},
    method: 'get',
    url: `${config.getGlobalGatewayUrl()}/authentication/v1/admin/verify`,
    params: {},
    timeout: 3000,
    useCache: true,
    cacheTtl: 100,
    headers: {
      'x-washswat-token': xWashswatToken,
    },
    retryConfig: {
      times: 3,
      interval: 10,
    }
  };

  try {
    const result: HttpInterface = await httpClient.call(configQuery);
    if (result.data.common.status === 'success') {
      returnVal = result.data;
    } else {
      returnVal = {
        common: {
          createdAt: result.data.common.createdAt,
          status: result.data.common.status,
          message: result.data.common.message,
        },
        data: {},
      };
    }
  } catch (ex) {
    logger.error(`getUidFromAuthentication try-catch: ${ex}`);
    returnVal = {
      common: {
        createdAt: moment().valueOf().toString(),
        status: 'fail',
        message: '오류가 발생하였습니다.',
      },
      data: {
        error: ex,
      },
    };
  }
  return returnVal;
}

export async function getAuthenticationFromUid(uid: number): Promise<Token> {
  logger.debug('getAuthenticationFromUid start');
  let returnVal: Token;
  const configQuery: RestQueryInterface = {
    auth: undefined,
    headers: {},
    method: 'post',
    url: `${config.getGlobalGatewayUrl()}/authentication/v1/admin/create`,
    params: {},
    timeout: 3000,
    useCache: true,
    cacheTtl: 100,
    body: {
      data: {
        uid,
      },
    },
    retryConfig: {
      times: 3,
      interval: 10,
    }
  };
  try {
    const result: HttpInterface = await httpClient.call(configQuery);
    if (result.data.common.status === 'success') {
      returnVal = result.data;
    } else {
      returnVal = {
        common: {
          createdAt: result.data.common.createdAt,
          status: result.data.common.status,
          message: result.data.common.message,
        },
        data: {},
      };
    }
  } catch (ex) {
    logger.error(`getAuthenticationFromUid try-catch: ${ex}`);
    returnVal = {
      common: {
        createdAt: moment().valueOf().toString(),
        status: 'fail',
        message: '오류가 발생하였습니다.',
      },
      data: {
        error: ex,
      },
    };
  }
  return returnVal;
}

export function extractJwtWithoutAuthentication(xWashswatToken:string):any{
  try {
    const decoded = jwtDecode(xWashswatToken);
    return decoded;
  } catch (ex) {
    logger.error(`extractJwtWithoutAuthentication try-catch: ${ex}`);
    return {};
  }
}
