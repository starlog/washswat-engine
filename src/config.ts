import * as log4js from 'log4js';
import * as httpClient from '@src/httpclient';
import * as mongoClient from '@src/mongodb';
import * as util2 from '@src/util2';
import { HttpInterface, RestQueryInterface } from '@src/httpclient';

const logger = log4js.getLogger();
logger.level = 'DEBUG';

const configQuery: RestQueryInterface = {
  body: {},
  headers: {},
  method: 'get',
  url: 'https://config.internal.washswat.com/v1/config/domain/$1/service/$2',
  params: {},
  timeout: 3000,
  useCache: true,
  cacheTtl: 100,
  retryConfig: {
    times: 3,
    interval: 10,
  },
};

const mongoConnections = [
  {
    name: 'config',
    url:
      'mongodb://'
      + 'washswat:!Washswat101@washswat.mongo.internal:27017'
      + '?replicaSet=rs0&readPreference=secondaryPreferred',
    useCache: true,
    cacheTTL: 60,
  },
];
const queryObject = {
  name: 'config',
  db: 'configuration',
  collection: 'platform',
  query: {},
  fields: {},
  sort: { version: -1 },
  skip: 0,
  limit: 1,
};

let localConfig: any;
let localPlatformConfig: any;
let localAppConfig: any;

export interface ConfigInfo {
  status: boolean,
  message: string,
  data: object
}

// eslint-disable-next-line max-len
export async function configure(domain: string, app: string, packageJson: any, logLevel: string): Promise<ConfigInfo> {
  util2.setLogLevel(logLevel);
  logger.level = logLevel;
  localAppConfig = packageJson;
  configQuery.url = configQuery.url.replace('$1', domain).replace('$2', app);
  const result: HttpInterface = await httpClient.call(configQuery);
  localConfig = result.data;
  logger.debug(`_config:${JSON.stringify(localConfig)}`);
  await mongoClient.init(mongoConnections);
  localPlatformConfig = await mongoClient.find(queryObject);
  logger.debug(`_platformConfig:${JSON.stringify(localPlatformConfig)}`);
  return { status: true, message: 'sucess', data: {} };
}

export function getAppConfig(): any {
  return localAppConfig;
}

export function getGlobalGatewayUrl(): string {
  return localConfig.common.apigateway.url;
}

export function getPlatformConfig(): any {
  return localPlatformConfig[0];
}

export async function readPlatformConfig(): Promise<ConfigInfo> {
  localPlatformConfig = await mongoClient.find(queryObject);
  logger.debug(`configure:_platformConfig:${JSON.stringify(localPlatformConfig)}`);
  return { status: true, message: 'success', data: localPlatformConfig[0] };
}

export function setHeader(response: any): void {
  try {
    response.setHeader('x-washswat-environment', localConfig.common.environment);
    response.setHeader('x-washswat-version', `${localAppConfig.name}:${localAppConfig.version}`);
  } catch (ex) {
    response.setHeader('x-washswat-environment', 'genesis');
    response.setHeader('x-washswat-version', 'generic:0.0.0');
  }
  response.setHeader('Access-Control-Allow-Origin', '*'); // CORS Allow all
}
