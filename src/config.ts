import * as httpClient from './httpclient';
import {HttpInterface, RestQueryInterface} from './httpclient';
import * as mongoClient from './mongodb';
import * as util2 from './util2';
import * as washLogger from './logger';

const logger = washLogger.getLogger('washswat-engine:config');

const configQuery: RestQueryInterface = {
  auth: undefined,
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
  }
};

const mongoConnections = [
  {
    name: 'config',
    url:
      'mongodb://'
      + 'washswat:!Washswat101@washswat.mongo.internal:27017'
      + '?replicaSet=rs0&readPreference=secondaryPreferred',
    useCache: true,
    cacheTtl: 60,
  },
];
const queryObject = {
  name: 'config',
  db: 'configuration',
  collection: 'platform',
  query: {},
  fields: {},
  sort: {version: -1},
  skip: 0,
  limit: 1,
};

let localConfig: any;
let localPlatformConfig: any;
const localAppConfig = {
  name: 'generic',
  version: '0.0.0',
};

export interface ConfigInfo {
  status: boolean,
  message: string,
  data: any
}

// eslint-disable-next-line max-len
export async function configure(domain: string, app: string, packageJson: any, logLevel: string): Promise<ConfigInfo> {
  util2.setLogLevel('washswat-engine:config', logLevel);
  if (packageJson?.name && packageJson?.version) {
    localAppConfig.name = packageJson.name;
    localAppConfig.version = packageJson.version;
  }
  logger.debug(`LocalAppConfig: ${JSON.stringify(localAppConfig)}`);
  configQuery.url = configQuery.url.replace('$1', domain).replace('$2', app);
  const result: HttpInterface = await httpClient.call(configQuery);
  localConfig = result.data;
  logger.debug(`_config:${JSON.stringify(localConfig)}`);
  await mongoClient.init(mongoConnections);
  localPlatformConfig = await mongoClient.find(queryObject);
  logger.debug(`_platformConfig:${JSON.stringify(localPlatformConfig)}`);
  return {status: true, message: 'success', data: {}};
}

export function getFullPlatformConfigData(): any {
  try {
    return localConfig;
  } catch (ex) {
    throw new Error(`Something went wrong ${ex}`);
  }
}

export function getAppConfig(): any {
  return localAppConfig;
}

export function getGlobalGatewayUrl(): string {
  try {
    return localConfig.common.apigateway.url;
  } catch (ex) {
    throw new Error('Gateway URL is empty. Have you done config.configure()?');
  }
}

export function getPlatformConfig(): any {
  return localPlatformConfig.data[0];
}

export async function readPlatformConfig(): Promise<ConfigInfo> {
  localPlatformConfig = await mongoClient.find(queryObject);
  logger.debug(`configure:_platformConfig:${JSON.stringify(localPlatformConfig)}`);
  return {status: true, message: 'success', data: localPlatformConfig.data[0]};
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
  savedHeaders.forEach((header) => {
    response.setHeader(header.title, header.value);
  });
}

let savedHeaders: any[] = [];

export function clearExtraHeader(): void {
  savedHeaders = [];
}
export function addHeader(headerTitle:string, headerValue:string): void {
  savedHeaders.push({title: headerTitle, value: headerValue});
}
