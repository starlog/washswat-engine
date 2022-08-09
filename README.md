<h2>Washswat helper tools (for typescript)</h2> <br>
A simple collection of utilities for Washswat platform.
Might useful for other people as well. <br>


export * as util2 from './util2'; <br>
export * as cache from './cache'; <br>
export * as httpClient from './httpclient'; <br>
export * as mongoClient from './mongodb'; <br>
export * as config from './config'; <br>
export * as api from './api'; <br>

httpclient: axios based, cache-able REST client tool <br>
mongodb: mongodb based, cache-able mongodb client tool <br>
cache: simple cache wrapper <br>
util2: some useful utilities <br>
config, api: only for washswat platform <br>

~~~
const queryObject = {
  method: 'get',
  url: 'https://call.url.com',
  params: {
    screen: 'SCREEN001',
  },
  timeout: 300,
  useCache: true,
  CacheTTL: 100,
  retryConfig: {
    times: 3,
    interval: 10,
  },
  headers: {
    'x-washswat-token':
      'xxx',
  },
};
const mongoTest = [
  {
    name: 'local',
    url: 'mongodb://localhost:27017',
    useCache: true,
    cacheTTL: 100,
  },
];

const mongoQueryObject = {
  name: 'local',
  db: 'local',
  collection: 'test_result',
  query: {},
  sort: {},
  fields: { _id: 0 },
  skip: 0,
  limit: 10,
};

const mysqlExample = {
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'database',
    useCache: true,
    cacheTTL: 100
}
~~~

