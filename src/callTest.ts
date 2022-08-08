import * as log4js from 'log4js';

const logger = log4js.getLogger();
logger.level = 'DEBUG';

import * as http from './httpclient';
import * as mongo from './mongodb';
import * as util2 from './util2';

const queryObject = {
  method: 'get',
  url: 'https://apis.washswat.com/configuration/v1/admin/ui/editor',
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

async function doHttpTest() {
  try {
    const result1 = await http.call(queryObject);
    const result2 = await http.call(queryObject);
    const result3 = await http.call(queryObject);
    // logger.debug(result);
  } catch (ex) {
    logger.error(ex);
  }
}

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

doMongoTest();
