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
    status: string
  },
  data: object
}

export async function getUidFromAuthentication(xWashswatToken: string): Promise<Token> {
  const configQuery:RestQueryInterface = {
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
  const result: HttpInterface = await httpClient.call(configQuery);
  if (result.status) {
    if (result.data.data.common.status === 'success') {
      return result.data.data;
    }
  }
  return {
    common: { createdAt: moment().valueOf().toString(), status: 'error' },
    data: { message: `Error:getUidFromAuthentication ${JSON.stringify(result.data)}` },
  };
}

export async function getAuthenticationFromUid(uid: number): Promise<Token> {
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
  const result: HttpInterface = await httpClient.call(configQuery);
  if (result.status) {
    if (result.data.data.common.status === 'success') {
      return result.data.data;
    }
  }
  return {
    common: { createdAt: moment().valueOf().toString(), status: 'success' },
    data: result.data,
  };
}
