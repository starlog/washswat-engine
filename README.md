<h1>Washswat helper tools (for typescript)</h1> <br>
A simple collection of utilities for Washswat platform.
Might useful for other people as well. <br>
<br>

<h2>Module description</h2>
|Module|Description|
|-------|-------|
|api: |some useful washswat apis |
|cache:| node-cache and redis based cache wrapper|
|config:| washswat config wrapper, based on platform-config and mongodb based|
|httpclient:| axios based, cache-able REST client tool|
|logger:| logger without using log4js|
|mongoClient:| mongodb based, cache-able mongodb client tool|
|mysql:| mysql based, cache-able mysql client tool|
|timer:| timer utility for process duration tracking|
|util2:| some useful utilities, one with JSON.stringify without circular reference problem|

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


