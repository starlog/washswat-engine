import * as log4js from 'log4js';
// eslint-disable-next-line import/extensions,import/no-unresolved
import * as http from './httpclient';
// eslint-disable-next-line import/extensions,import/no-unresolved
import * as mongo from './mongodb';
// eslint-disable-next-line import/extensions,import/no-unresolved
import * as util2 from './util2';
// eslint-disable-next-line import/extensions,import/no-unresolved
import * as api from './api';
// eslint-disable-next-line import/extensions,import/no-unresolved
import { Token } from './api';
// eslint-disable-next-line import/extensions,import/no-unresolved
import * as config from './config';
// eslint-disable-next-line import/extensions,import/no-unresolved
import { MysqlConnectionInterface } from './mysql';
// eslint-disable-next-line import/extensions,import/no-unresolved
import * as mysql from './mysql';
// eslint-disable-next-line import/extensions,import/no-unresolved
// import { HttpInterface } from "./httpclient";
// eslint-disable-next-line import/extensions,import/no-unresolved
import { RestQueryInterface } from './httpclient';

const logger = log4js.getLogger();
logger.level = 'DEBUG';

const queryObject: RestQueryInterface = {
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
    await config.configure('test', 'test', null, 'debug');
    const result: Token = await api.getUidFromAuthentication('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQ'
      + 'iOjU2Njk3NywiaWF0IjoxNjYwMzc1NTY1LCJleHAiOjE2NjA0NjE5NjV9.ODroclQvYUp9G46SG4O6wHlNlGfXMWMBLS-j2-NCOc8');
    logger.debug(JSON.stringify(result, null, 2));

    const result2: Token = await api.getAuthenticationFromUid(2345);
    logger.debug(JSON.stringify(result2, null, 2));

    const result3: Token = await api.getUidFromAuthentication('xcvcvcxvv');
    logger.debug(JSON.stringify(result3, null, 2));
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

doApiTest().then(() => {
  process.exit(0);
});
