import * as log4js from 'log4js';
import moment from 'moment';
// eslint-disable-next-line import/extensions,import/no-unresolved
import { HttpInterface, RestQueryInterface } from './httpclient';
// eslint-disable-next-line import/extensions,import/no-unresolved
import * as httpClient from './httpclient';
// eslint-disable-next-line import/extensions,import/no-unresolved
import * as config from './config';

const logger = log4js.getLogger('api');
logger.level = 'debug';

export interface Token {
  common: {
    createdAt: string,
    status: string,
    message: string
  },
  data: object
}

export async function getUidFromAuthentication(xWashswatToken: string): Promise<Token> {
  let returnVal: Token;
  const configQuery: RestQueryInterface = {
    body: {},
    method: 'get',
    url: `${config.getGlobalGatewayUrl()}/authentication/v1/admin/verify`,
    params: {},
    timeout: 3000,
    useCache: false,
    cacheTtl: 100,
    headers: {
      'x-washswat-token': xWashswatToken,
    },
    retryConfig: {
      times: 3,
      interval: 10,
    },
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
  let returnVal: Token;
  const configQuery: RestQueryInterface = {
    headers: {},
    method: 'post',
    url: `${config.getGlobalGatewayUrl()}/authentication/v1/admin/create`,
    params: {},
    timeout: 3000,
    useCache: false,
    cacheTtl: 100,
    body: {
      data: {
        uid,
      },
    },
    retryConfig: {
      times: 3,
      interval: 10,
    },
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
