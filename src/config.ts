import * as httpClient from './httpclient';
import * as mongoClient from './mongodb';
import * as util2 from './util2';
import * as log4js from 'log4js';

const logger = log4js.getLogger();
logger.level = 'DEBUG';

const configQuery = {
  method: 'get',
  url: 'https://config.internal.washswat.com/v1/config/domain/$1/service/$2',
  params: {},
  timeout: 3000,
  useCache: true,
  cacheTTL: 100,
  retryConfig: {
    time: 3,
    interval: 10,
  },
};

const mongoConnections = [
  {
    name: 'config',
    url:
      'mongodb://' +
      'washswat:!Washswat101@washswat.mongo.internal:27017' +
      '?replicaSet=rs0&readPreference=secondaryPreferred',
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
  sort: {version: -1},
  skip: 0,
  limit: 1,
};

let _config: any;
let _platformConfig: any;
let _appConfig: any;

export async function configure(domain: string, app: string, packageJson: any, logLevel: string) {
  return new Promise(async (resolve, reject) => {
    try {
      util2.setLogLevel(logLevel);
      logger.level = logLevel;
      _appConfig = packageJson;
      configQuery.url = configQuery.url.replace('$1', domain).replace('$2', app);
      const result: any = await httpClient.call(configQuery);
      _config = result.data;
      logger.debug('_config:' + JSON.stringify(_config));
      await mongoClient.init(mongoConnections);
      _platformConfig = await mongoClient.find(queryObject);
      logger.debug('_platformConfig:' + JSON.stringify(_platformConfig));
      resolve(true);
    } catch (ex) {
      reject('configure error:' + ex);
    }
  });
}

export function getAppConfig() {
  return _appConfig;
}

export function getGlobalGatewayUrl() {
  return _config.common.apigateway.url;
}

export function getPlatformConfig() {
  return _platformConfig[0];
}

export async function readPlatformConfig() {
  return new Promise(async (resolve, reject) => {
    try {
      _platformConfig = await mongoClient.find(queryObject);
      logger.debug('configure:_platformConfig:' + JSON.stringify(_platformConfig));
      resolve(_platformConfig[0]);
    } catch (ex) {
      reject('readPlatformConfig err:' + ex);
    }
  });
}

export function setHeader(response: any) {
  try {
    response.setHeader('x-washswat-environment', _config.common.environment);
    response.setHeader('x-washswat-version', _appConfig.name + ':' + _appConfig.version);
  } catch (ex) {
    response.setHeader('x-washswat-environment', 'genesis');
    response.setHeader('x-washswat-version', 'generic:0.0.0');
  }
  response.setHeader('Access-Control-Allow-Origin', '*'); // CORS Allow all
}
