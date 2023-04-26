import * as util2 from '../src/util2';
import * as mongo from '../src/mongodb';
import {
  MongoQueryInterface, MongoConnectionEntry,
  MongoConnectionOptions,
} from '../src/mongodb';

async function test1() {
  try {
    const mongoTest = [
      {
        name: 'local',
        url: 'mongodb://localhost:27017',
        useCache: true,
        cacheTtl: 100,
      },
    ];

    const mongoQueryObject = {
      name: 'local',
      db: 'local',
      collection: 'test_result',
      query: {},
      sort: {},
      fields: {_id: 0},
      skip: 0,
      limit: 10,
    };
    await mongo.init(mongoTest);
    const data = await mongo.find(mongoQueryObject);
    util2.debug(util2.debugDump(data, 2, 200, false));
    const data2 = await mongo.find(mongoQueryObject);
    util2.debug(util2.debugDump(data2, 2, 200, false));
    return true;

  } catch (ex) {
    return false;
  }
}

async function test2() {
  try {
    const mongoTest: MongoConnectionEntry[] = [
      {
        name: 'local',
        url: 'mongodb://localhost:27017',
        useCache: true,
        cacheTtl: 100,
        options: {
          poolSize: 2,
          connectTimeoutMS: 20000,
        },
  }
  ]

    const mongoQueryObject:MongoQueryInterface = {
      newValue: undefined, upsert: false,
      name: 'local',
      db: 'local',
      collection: 'test_result',
      query: {},
      sort: {},
      fields: {_id: 0},
      skip: 0,
      limit: 10
    };
    await mongo.init2(mongoTest);
    const data = await mongo.find2(mongoQueryObject);
    util2.debug(util2.debugDump(data, 2, 200, false));
    const data2 = await mongo.find2(mongoQueryObject);
    util2.debug(util2.debugDump(data2, 2, 200, false));
    return true;

  } catch (ex) {
    return false;
  }
}

describe('mongo test module', () => {
  test('mongo test 1', async () => {
    expect(await test1()).toBe(true);
  });
  test('mongo test 2 with Typescript type support', async () => {
    expect(await test2()).toBe(true);
  });
});
