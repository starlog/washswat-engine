<h1>Washswat helper tools (for typescript)</h1> <br>
A simple collection of utilities for Washswat platform.
Might useful for other people as well. <br>
<br>

<h2>Module description</h2>
api: some useful washswat apis <br>

| api                      | description              |
|--------------------------|--------------------------|
| getUidFromAuthentication | WashswatAuthtication API |
| getAuthenticationFromUid | WashswatAuthtication API |
|extractJwtWithoutAuthentication| Extract payload without actual authentication |



cache: node-cache and redis based cache wrapper <br>

| api                      | description                                                                                                |
|--------------------------|------------------------------------------------------------------------------------------------------------|
|initRedis | Initialize cache to utilize redis. When cache uses without calling this init, it will use own memory cache. |
|set | set cache.                                                                                   |
|get | get cache                                                                                                  |

config: washswat config wrapper, based on platform-config and mongodb based <br>

| api                       | description                                          |
|---------------------------|------------------------------------------------------|
| configure                 | Washswat platform configuration.                     |
| getFullPlatformConfigData | getting full platform config data.                   |
| getAppConfig| get application configuration data from package.json |
|getGlobalGatewayUrl | get just gateway url from platform config data |
|getPlatformConfig| get first platform config data. |
|readPlatformConfig | read platform config data from mongodb |
|setHeader|set http/https header |
|clearExtraHeader| clear local header storage for new request |
|addHeader | add new header. Probably for testing/debugging/information purpose |


httpclient: axios based, cache-able REST client tool <br>

| api                       | description                                          |
|---------------------------|------------------------------------------------------|
| call | call axios based rest call with retry, cache functionality |


logger: logger without using log4js <br>

| api                      | description                 |
|--------------------------|-----------------------------|
| FelixLogger.constructor  | initialize logger           |
| FelixLogger.setLevel     | set log level               |
| FelixLogger.setPrompt    | set log prompt              |
| FelixLogger.setTimestamp | set log timestamp           |
| FelixLogger.print        | print formatted log message |
| FelixLogger.debug        | print debug log             |
| FelixLogger.info         | print info log              |
| FelixLogger.warn         | print warn log              |
| FelixLogger.error        | print error log             |
| FelixLogger.fatal        | print fatal log             |
|findMyLogger| find logger by name |
|getLogger| get logger by name |
|setLogLevel| set log level by name |



mongoClient: mongodb based, cache-able mongodb client tool <br>

Note: *2 version of apis are for supporting Typescript. <br>

| api        | description                         |
|------------|-------------------------------------|
| init/init2 | initialize with mongo configuration |
|count                     | count query                         |
|findOne/findOne2                     | find one query with cache support   |
|deleteOne/deleteOne2                     | delete one query                    |
|deleteMany/deleteMany2                     | delete many query                   |
|updateOne/updateOne2                     | update one quey |
|insertOne/intertOne2                     | insert one query                    |
|insertMany/insertMany2                     | inset many query                    |
|find/find2                     | find query with cache support |



mysql: mysql based, cache-able mysql client tool <br>

| api        | description                         |
|------------|-------------------------------------|
| init | initialize with mysql configuration |
|query                     | query with cache support   |



timer: timer utility for process duration tracking <br>

| api               | description                       |
|-------------------|-----------------------------------|
| Timer.constructor | initialize timer with information |
| Timer.time        | record lap time with information  |
| Timer.toString    | get timing information as string |
| Timer.toJSON      | get timing information as JSON |




util2: some useful utilities, one with JSON.stringify without circular reference problem <br>

| api               | description                                                          |
|-------------------|----------------------------------------------------------------------|
| getLogger| Legacy API call to get logger                                        |
| setLogLevel| Legacy API call to set log level                                     |
| debug| Legacy API call to print debug log                                   |
| info| Legacy API call to print info log                                    |
| error| Legacy API call to print error log                                   |
| stringify| JSON.stringify with try-catch, multi-line format                     |
| stringify2| JSON.stringify with try-catch, single-line format                    |
| stringifyWithoutCircular| JSON.stringify without circular reference problem                    |
| genHashKey| generate hash key from object (for cache key)                        |
| debugDump| dump object with limit and pretty format                             |
|debugEx| dump exception with pretty format                                    |
|encryptObject| encrypt object with key and iv                                       |
|decryptObject| decrypt object with key and iv                                       |
|encryptObjectWithSingleKey| encrypt object with single key, iv will use same key with variation. |
|decryptObjectWithSingleKey| decrypt object with single key, iv will use same key with variation. |


<br>
<h2>Interfaces</h2>

~~~
export interface HttpInterface {
  status: boolean,
  message: string,
  data: any
}

export interface RestQueryRetryConfig {
  times: number,
  interval: number,
}

export interface RestQueryInterface {
  method: string,
  url: string,
  params: any,
  timeout: number,
  useCache: boolean,
  cacheTtl: number,
  retryConfig: RestQueryRetryConfig,
  headers: any,
  body: any,
  auth: any,
}

export interface RedisInitConfig {
  host: string,
  port: number,
  prefix: string,
}

export interface loggerOption {
  level: string,
  prompt: string,
  timestamp: boolean,
}

export interface MongoInterface {
  status: boolean,
  message: string,
  data: any
}

export interface MongoQueryInterface {
  name: string,
  db: string,
  collection: string,
  query: object,
  sort: object,
  fields: object,
  skip: number,
  limit: number,
  newValue: any,
  upsert: boolean,
}


export interface MongoConnectionOptions {
  poolSize: number,
  connectTimeoutMS: number,
}

export interface MongoConnectionEntry {
  name: string,
  url: string,
  options: MongoConnectionOptions,
  useCache: boolean,
  cacheTtl: number,
}

export interface MongoConnectionEntryList extends Array<MongoConnectionEntry> {}


export interface MysqlInterface {
  status: boolean,
  message: string,
  data: any
}

export interface MysqlConnectionInterface {
  host: string,
  user: string,
  password: string,
  database: string,
  useCache: boolean,
  cacheTtl: number
}


~~~

<h2>Object Examples</h2>

~~~
const configQuery: RestQueryInterface = {
  auth: undefined,
  body: {},
  headers: {},
  method: 'get',
  url: 'https://api.example.com/v1/config/domain/$1/service/$2',
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
      + 'id:password@example.mongoserver.com:27017'
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
  sort: {version: -1},
  skip: 0,
  limit: 1,
};
~~~

