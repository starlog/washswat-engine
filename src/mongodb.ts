import * as log4js from 'log4js';
import * as util2 from './util2';
import * as cache from './cache';
import { MongoClient } from 'mongodb';

const logger = log4js.getLogger();
logger.level = 'DEBUG';

const REDIS_KEY_PREFIX = 'washswat-tool-mongodb';
const mongodbClients: any = [];

export async function init(configuration: any) {
  return new Promise(async (resolve, reject) => {
    for (const config of configuration) {
      await initMongo(config);
    }
    resolve(true);
  });
}

async function initMongo(config: any) {
  return new Promise(async (resolve, reject) => {
    try {
      const _client = new MongoClient(config.url);
      await _client.connect();
      await _client.db('admin').command({ ping: 1 });
      mongodbClients.push({
        name: config.name,
        client: _client,
        useCache: config.useCache,
        cacheTTL: config.cacheTTL,
      });
      resolve(true);
    } catch (ex) {
      reject('mongodb:initMongo ' + ex);
    }
  });
}

function getMongoClient(name: string) {
  let _retObject;

  for (const item of mongodbClients) {
    if (item.name === name) {
      _retObject = item;
      break;
    }
  }
  return _retObject;
}

export async function count(name: string, db: string, collection: string, query: any) {
  return new Promise(async (resolve, reject) => {
    const mongoObject = getMongoClient(name);

    if (mongoObject?.name === undefined) {
      reject('No mongoClient found for name:' + name);
    } else {
      const data = await mongoObject.client.db(db).collection(collection).find(query).count();
      resolve(data);
    }
  });
}

export async function find(queryObject: any) {
  return new Promise(async (resolve, reject) => {
    const result = await _find(
      queryObject.name,
      queryObject.db,
      queryObject.collection,
      queryObject.query,
      queryObject.sort,
      queryObject.fields,
      queryObject.skip,
      queryObject.limit,
    );
    resolve(result);
  });
}
export async function findOne(queryObject: any) {
  return new Promise(async (resolve, reject) => {
    const result = await _findOne(
      queryObject.name,
      queryObject.db,
      queryObject.collection,
      queryObject.query,
      queryObject.fields,
    );
    resolve(result);
  });
}
export async function deleteOne(queryObject: any) {
  return new Promise(async (resolve, reject) => {
    const result = await _deleteOne(queryObject.name, queryObject.db, queryObject.collection, queryObject.query);
    resolve(result);
  });
}
export async function deleteMany(queryObject: any) {
  return new Promise(async (resolve, reject) => {
    const result = await _deleteMany(queryObject.name, queryObject.db, queryObject.collection, queryObject.query);
    resolve(result);
  });
}
export async function updateOne(queryObject: any) {
  return new Promise(async (resolve, reject) => {
    const result = await _updateOne(
      queryObject.name,
      queryObject.db,
      queryObject.collection,
      queryObject.query,
      queryObject.newValue,
      queryObject.upsert,
    );
    resolve(result);
  });
}
export async function insertOne(queryObject: any) {
  return new Promise(async (resolve, reject) => {
    const result = await _insertOne(queryObject.name, queryObject.db, queryObject.collection, queryObject.newValue);
    resolve(result);
  });
}
export async function insertMany(queryObject: any) {
  return new Promise(async (resolve, reject) => {
    const result = await _insertMany(queryObject.name, queryObject.db, queryObject.collection, queryObject.newValue);
    resolve(result);
  });
}

async function _find(
  name: string,
  db: string,
  collection: string,
  query: any,
  sort: any,
  fields: any,
  skip: any,
  limit: any,
) {
  return new Promise(async (resolve, reject) => {
    const mongoObject = getMongoClient(name);

    if (mongoObject?.name === undefined) {
      reject('No mongoClient found for name:' + name);
    } else {
      const REDIS_KEY = util2.genHashKey(REDIS_KEY_PREFIX, {
        mode: 'find',
        name,
        db,
        collection,
        query,
        sort,
        fields,
        skip,
        limit,
      });
      let data: any;
      if (mongoObject.useCache) {
        data = await cache.get(REDIS_KEY);
        logger.debug('USING CACHE: data is ' + util2.stringifyWithoutCircular(data));
        if (data) resolve(data);
      }
      if (!data) {
        logger.debug('USING QUERY');
        const result = await mongoObject.client
          .db(db)
          .collection(collection)
          .find(query)
          .sort(sort)
          .project(fields)
          .skip(skip)
          .limit(limit)
          .toArray();
        if (mongoObject.useCache) {
          await cache.set(REDIS_KEY, result, mongoObject.cacheTTL);
        }
        resolve(result);
      }
    }
  });
}

async function _findOne(name: string, db: string, collection: string, query: any, fields: any) {
  return new Promise(async (resolve, reject) => {
    const mongoObject = getMongoClient(name);

    if (mongoObject?.name === undefined) {
      reject('No mongoClient found for name:' + name);
    } else {
      const REDIS_KEY = util2.genHashKey(REDIS_KEY_PREFIX, {
        mode: 'findOne',
        name,
        db,
        collection,
        query,
        fields,
      });
      let data: any;
      if (mongoObject.useCache) {
        data = await cache.get(REDIS_KEY);
        logger.debug('USING CACHE: data is ' + util2.stringifyWithoutCircular(data));
        if (data) resolve(data);
      }
      if (!data) {
        logger.debug('USING QUERY');
        const result = await mongoObject.client.db(db).collection(collection).findOne(query, { projection: fields });
        if (mongoObject.useCache) {
          await cache.set(REDIS_KEY, result, mongoObject.cacheTTL);
        }
        resolve(result);
      }
    }
  });
}

async function _deleteOne(name: string, db: string, collection: string, query: any) {
  return new Promise(async (resolve, reject) => {
    const mongoObject = getMongoClient(name);

    if (mongoObject?.name === undefined) {
      reject('No mongoClient found for name:' + name);
    } else {
      const data = await mongoObject.client.db(db).collection(collection).deleteOne(query);
      resolve(data);
    }
  });
}

async function _deleteMany(name: string, db: string, collection: string, query: any) {
  return new Promise(async (resolve, reject) => {
    const mongoObject = getMongoClient(name);

    if (mongoObject?.name === undefined) {
      reject('No mongoClient found for name:' + name);
    } else {
      const data = await mongoObject.client.db(db).collection(collection).deleteMany(query);
      resolve(data);
    }
  });
}

async function _updateOne(name: string, db: string, collection: string, query: any, newValue: any, upsert: boolean) {
  return new Promise(async (resolve, reject) => {
    const mongoObject = getMongoClient(name);

    if (mongoObject?.name === undefined) {
      reject('No mongoClient found for name:' + name);
    } else {
      const data = await mongoObject.client.db(db).collection(collection).updateOne(query, newValue, { upsert });
      resolve(data);
    }
  });
}

async function _insertOne(name: string, db: string, collection: string, newValue: any) {
  return new Promise(async (resolve, reject) => {
    const mongoObject = getMongoClient(name);

    if (mongoObject?.name === undefined) {
      reject('No mongoClient found for name:' + name);
    } else {
      const data = await mongoObject.client.db(db).collection(collection).insertOne(newValue);
      resolve(data);
    }
  });
}

async function _insertMany(name: string, db: string, collection: string, newValue: any) {
  return new Promise(async (resolve, reject) => {
    const mongoObject = getMongoClient(name);

    if (mongoObject?.name === undefined) {
      reject('No mongoClient found for name:' + name);
    } else {
      const data = await mongoObject.client.db(db).collection(collection).insertMany(newValue);
      resolve(data);
    }
  });
}
