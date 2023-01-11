import * as http from './httpclient';
import * as mongo from './mongodb';
import * as util2 from './util2';
import * as api from './api';
import { Token } from './api';
import * as config from './config';
import { MysqlConnectionInterface } from './mysql';
import * as mysql from './mysql';
import { RestQueryInterface } from './httpclient';
import * as cache from './cache';

const logger = util2.getLogger('washswat-engine');
util2.setLogLevel('all', 'debug');

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

// eslint-disable-next-line no-unused-vars
async function doHttpTest() {
  try {
    // eslint-disable-next-line no-unused-vars
    const result1 = await http.call(queryObject);
    logger.debug(result1.data);
  } catch (ex) {
    logger.error(ex);
  }
}

// eslint-disable-next-line no-unused-vars
async function doMongoTest() {
  try {
    await mongo.init(mongoTest);
    const data = await mongo.find(mongoQueryObject);
    util2.debug(util2.debugDump(data, 2, 200, false));
    const data2 = await mongo.find(mongoQueryObject);
    util2.debug(util2.debugDump(data2, 2, 200, false));
  } catch (ex) {
    // intentional
  }
}
// eslint-disable-next-line no-unused-vars
async function doApiTest() {
  try {
    await config.configure('test', 'test', null, 'error');

    const result: Token = await api.getUidFromAuthentication('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQ'
      + 'iOjU2Njk3NywiaWF0IjoxNjYwMzc1NTY1LCJleHAiOjE2NjA0NjE5NjV9.ODroclQvYUp9G46SG4O6wHlNlGfXMWMBLS-j2-NCOc8');
    logger.debug(JSON.stringify(result, null, 2));

    const result2: Token = await api.getAuthenticationFromUid(2345);
    logger.debug(JSON.stringify(result2, null, 2));

    const result3: Token = await api.getUidFromAuthentication('xcvcvcxvv');
    logger.debug(JSON.stringify(result3, null, 2));

    const result4: Token = await api.getAuthenticationFromUid(2345);
    logger.debug(JSON.stringify(result4, null, 2));

    const result5: Token = await api.getUidFromAuthentication('xcvcvcxvv');
    logger.debug(JSON.stringify(result5, null, 2));
  } catch (ex) {
    // intentional
    logger.error(`doApiTest try-catch error: ${ex}`);
  }
}

const mySQLInit: MysqlConnectionInterface = {
  cacheTtl: 0,
  useCache: false,
  database: 'washswat',
  host: 'localhost',
  password: 'madmax2',
  user: 'root',
};

// eslint-disable-next-line no-unused-vars
async function doMysqlTest() {
  try {
    await mysql.init(mySQLInit);
    const result = await mysql.query('select * from test2');
    logger.debug(JSON.stringify(result.data.rows, null, 2));
  } catch (ex) {
    logger.error(`doMysqlTest error:${ex}`);
  }
}

// eslint-disable-next-line no-unused-vars
async function cacheTest() {
  const data = { data: 'hello' };
  await cache.set('test', data, 2000);
  const outData = await cache.get('test');
  console.log(outData);
}

const queryObject: RestQueryInterface = {
  auth: {  },
  body: {},
  method: 'get',
  url: 'https://apis.washswat.com/configuration/v1/admin/ui/editor',
  params: {
    screen: 'SCREEN001',
  },
  timeout: 300,
  useCache: true,
  cacheTtl: 100,
  retryConfig: {
    times: 3,
    interval: 10,
  },
  headers: {
    'x-washswat-token':
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjU2Njk3NywiZWRpdG9yQXV0aCI6dHJ1ZSwiaWF0IjoxNjU5OTY0MTk2LCJleHAiOjE2NjAwNTA1OTZ9.1E_czAo70_8fKxd3MP3NIzdqX_DMR2hUtwVsz3SHyWo',
  }
};


const queryObject2: RestQueryInterface = {
  auth: undefined,
  params: undefined,
  body: undefined,
  method: 'get',
  url: 'https://v2.washswat.com/order/time/pickup',
  timeout: 300,
  useCache: true,
  cacheTtl: 100,
  retryConfig: {
    times: 3,
    interval: 10,
  },
  headers: {
    'x-access-token':
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjU0MzQ3OSwiaWF0IjoxNjYxMjM4NzI5LCJleHAiOjE2NjEzMjUxMjl9.7o9IdOQWldvmVEHLCL7237FjCPsd-OI_-xl04JXS91I',
  }
};

const queryObject3: RestQueryInterface = {
  auth: undefined,
  params: undefined,
  body: undefined,
  method: 'get',
  url: 'https://apis.washswat.com/ab-test/v1/dynamic/TDG-004',
  timeout: 300,
  useCache: true,
  cacheTtl: 100,
  retryConfig: {
    times: 3,
    interval: 10,
  },
  headers: {
    'x-washswat-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXIiOiIxLjAiLCJzeXN0ZW1UeXBlIjoiVSIsInVpZCI6NTQzNDc5LCJwaG9uZSI6IjAxMDkyNTY0ODI1IiwibmFtZSI6Iu2VhOumreyKpCIsImlhdCI6MTY3MzQ0NDY0NCwiZXhwIjoxNzA0OTgwNjQ0fQ.OkLPByXsnJj1A3oI54GdXzEeFTcgngekbUwaXsP9BQg'
  }
};


async function restTest() {
  const result = await http.call(queryObject);
  console.log(result);
}

restTest().then(() => {
  process.exit(0);
});
