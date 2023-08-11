import { MongoClient, ObjectId } from 'mongodb';
import * as util2 from './util2';
import * as cache from './cache';
import * as washLogger from './logger';

const logger = washLogger.getLogger('washswat-engine:mongodb');

const REDIS_KEY_PREFIX = 'washswat-tool-mongodb';
const mongodbClients: any = [];

// Interfaces
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

async function initMongo(config: any): Promise<MongoInterface> {
  const myClient = new MongoClient(config.url);
  await myClient.connect();
  await myClient.db('admin').command({ ping: 1 });
  mongodbClients.push({
    name: config.name,
    client: myClient,
    useCache: config.useCache,
    cacheTTL: config.cacheTTL ? config.cacheTTL : (config.CacheTtl ? config.CacheTtl : (config.cacheTtl ? config.cacheTtl :60)), // For support old typos
  });
  return { status: true, message: 'success', data: {} };
}
async function initMongo2(config: MongoConnectionEntry): Promise<MongoInterface> {
  const myClient = new MongoClient(config.url);
  await myClient.connect();
  await myClient.db('admin').command({ ping: 1 });
  mongodbClients.push({
    name: config.name,
    client: myClient,
    useCache: config.useCache,
    cacheTTL: config.cacheTtl,
  });
  return { status: true, message: 'success', data: {} };
}


function getMongoClientByName(name: string): any {
  let retObject;

  mongodbClients.forEach((element: any) => {
    if (element.name === name) {
      retObject = element;
    }
  });

  return retObject;
}

async function localFind(
  name: string,
  db: string,
  collection: string,
  query: any,
  sort: any,
  fields: any,
  skip: any,
  limit: any,
): Promise<MongoInterface> {
  const mongoObject = getMongoClientByName(name);
  let returnVal: any;

  if (mongoObject?.name === undefined) {
    return { status: false, message: `No mongoClient found for name:${name}`, data: {} };
  }
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
  let myData: any;
  if (mongoObject.useCache) {
    myData = await cache.get(REDIS_KEY);
    logger.debug(`USING CACHE: data is ${util2.stringifyWithoutCircular(myData)}`);
    if (myData) {
      returnVal = { status: true, message: 'success', data: myData };
    }
  }
  if (!myData) {
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
    returnVal = { status: true, message: 'success', data: result };
  }
  return returnVal;
}

async function localFindOne(
  name: string,
  db: string,
  collection: string,
  query: any,
  fields: any,
): Promise<MongoInterface> {
  const mongoObject = getMongoClientByName(name);
  let returnVal: any;

  if (mongoObject?.name === undefined) {
    return { status: false, message: `No mongoClient found for name:${name}`, data: {} };
  }
  const REDIS_KEY = util2.genHashKey(REDIS_KEY_PREFIX, {
    mode: 'findOne',
    name,
    db,
    collection,
    query,
    fields,
  });
  let myData: any;
  if (mongoObject.useCache) {
    myData = await cache.get(REDIS_KEY);
    logger.debug(`USING CACHE: data is ${util2.stringifyWithoutCircular(myData)}`);
    if (myData) {
      returnVal = { status: true, message: 'success', data: myData };
    }
  }
  if (!myData) {
    logger.debug('USING QUERY');
    const result = await mongoObject.client.db(db).collection(collection)
      .findOne(query, { projection: fields });
    if (mongoObject.useCache) {
      await cache.set(REDIS_KEY, result, mongoObject.cacheTTL);
    }
    returnVal = { status: true, message: 'success', data: result };
  }
  return returnVal;
}

async function localDeleteOne(
  name: string,
  db: string,
  collection:
    string,
  query: any,
): Promise<MongoInterface> {
  const mongoObject = getMongoClientByName(name);
  let returnVal: any;

  if (mongoObject?.name === undefined) {
    returnVal = { status: false, message: `No mongoClient found for name:${name}`, data: {} };
  } else {
    const myData = await mongoObject.client.db(db).collection(collection).deleteOne(query);
    returnVal = { status: true, message: 'success', data: myData };
  }
  return returnVal;
}

async function localDeleteMany(
  name: string,
  db: string,
  collection: string,
  query: any,
): Promise<MongoInterface> {
  const mongoObject = getMongoClientByName(name);
  let returnVal: any;

  if (mongoObject?.name === undefined) {
    returnVal = { status: false, message: `No mongoClient found for name:${name}`, data: {} };
  } else {
    const myData = await mongoObject.client.db(db).collection(collection).deleteMany(query);
    returnVal = { status: true, message: 'success', data: myData };
  }
  return returnVal;
}

async function localUpdateOne(
  name: string,
  db: string,
  collection: string,
  query: any,
  newValue: any,
  upsert: boolean,
): Promise<MongoInterface> {
  const mongoObject = getMongoClientByName(name);
  let returnVal: any;

  if (mongoObject?.name === undefined) {
    returnVal = { status: false, message: `No mongoClient found for name:${name}`, data: {} };
  } else {
    const myData = await mongoObject.client.db(db).collection(collection)
      .updateOne(query, newValue, { upsert });
    returnVal = { status: true, message: 'success', data: myData };
  }
  return returnVal;
}

async function localInsertOne(
  name: string,
  db: string,
  collection: string,
  newValue: any,
): Promise<MongoInterface> {
  const mongoObject = getMongoClientByName(name);
  let returnVal: any;

  if (mongoObject?.name === undefined) {
    returnVal = { status: false, message: `No mongoClient found for name:${name}`, data: {} };
  } else {
    const myData = await mongoObject.client.db(db).collection(collection).insertOne(newValue);
    returnVal = { status: true, message: 'success', data: myData };
  }
  return returnVal;
}

async function localInsertMany(
  name: string,
  db: string,
  collection: string,
  newValue: any,
): Promise<MongoInterface> {
  const mongoObject = getMongoClientByName(name);
  let returnVal: any;

  if (mongoObject?.name === undefined) {
    returnVal = { status: false, message: `No mongoClient found for name:${name}`, data: {} };
  } else {
    const myData = await mongoObject.client.db(db).collection(collection).insertMany(newValue);
    returnVal = { status: true, message: 'success', data: myData };
  }
  return returnVal;
}

//--------------------------------------------------------------------------------------------------
// For backward compatibility
//--------------------------------------------------------------------------------------------------
export async function init(configuration: any): Promise<MongoInterface> {
  const returnVal = {
    status: true,
    message: 'success',
    data: {},
  };
  // eslint-disable-next-line no-restricted-syntax
  for (const config of configuration) {
    // eslint-disable-next-line no-await-in-loop
    const result = await initMongo(config);
    if (!result.status) {
      returnVal.status = false;
      returnVal.message = result.message;
    }
  }
  return returnVal;
}

//--------------------------------------------------------------------------------------------------
// Typescript friendly version
//--------------------------------------------------------------------------------------------------
export async function init2(configuration: MongoConnectionEntry[]): Promise<MongoInterface> {
  const returnVal = {
    status: true,
    message: 'success',
    data: {},
  };
  // eslint-disable-next-line no-restricted-syntax
  for (const config of configuration) {
    // eslint-disable-next-line no-await-in-loop
    const result = await initMongo2(config);
    if (!result.status) {
      returnVal.status = false;
      returnVal.message = result.message;
    }
  }
  return returnVal;
}
export async function init2Single(configuration: MongoConnectionEntry[], name:string): Promise<MongoInterface> {
  const returnVal = {
    status: true,
    message: 'success',
    data: {},
  };
  // eslint-disable-next-line no-restricted-syntax
  for (const config of configuration) {
    if(config.name === name) {
      // eslint-disable-next-line no-await-in-loop
      const result = await initMongo2(config);
      if (!result.status) {
        returnVal.status = false;
        returnVal.message = result.message;
      }
    }
  }
  return returnVal;
}
export async function localCountDocuments(
  name: string,
  db: string,
  collection: string,
  query: any,
): Promise<MongoInterface> {
  const mongoObject = getMongoClientByName(name);
  let returnVal: any;

  if (mongoObject?.name === undefined) {
    returnVal = { status: false, message: `No mongoClient found for name:${name}`, data: {} };
  } else {
    const countValue = await mongoObject.client.db(db).collection(collection).countDocuments(query);
    returnVal = { status: true, message: `success${name}`, data: countValue };
  }
  return returnVal;
}
export async function count(
  name: string,
  db: string,
  collection: string,
  query: any,
): Promise<MongoInterface> {
  const mongoObject = getMongoClientByName(name);
  let returnVal: any;

  if (mongoObject?.name === undefined) {
    returnVal = { status: false, message: `No mongoClient found for name:${name}`, data: {} };
  } else {
    const countValue = await mongoObject.client.db(db).collection(collection).find(query).count();
    returnVal = { status: true, message: `success${name}`, data: countValue };
  }
  return returnVal;
}
export function getObjectId(objectId: string) : ObjectId {
  return new ObjectId(objectId);
}
export async function findOne(queryObject: any): Promise<MongoInterface> {
  const result = await localFindOne(
    queryObject.name,
    queryObject.db,
    queryObject.collection,
    queryObject.query,
    queryObject.fields,
  );
  return result;
}

export async function deleteOne(queryObject: any): Promise<MongoInterface> {
  const result = await localDeleteOne(
    queryObject.name,
    queryObject.db,
    queryObject.collection,
    queryObject.query,
  );
  return result;
}

export async function deleteMany(queryObject: any): Promise<MongoInterface> {
  const result = await localDeleteMany(
    queryObject.name,
    queryObject.db,
    queryObject.collection,
    queryObject.query,
  );
  return result;
}

export async function updateOne(queryObject: any): Promise<MongoInterface> {
  const result = await localUpdateOne(
    queryObject.name,
    queryObject.db,
    queryObject.collection,
    queryObject.query,
    queryObject.newValue,
    queryObject.upsert,
  );
  return result;
}

export async function insertOne(queryObject: any): Promise<MongoInterface> {
  const result = await localInsertOne(
    queryObject.name,
    queryObject.db,
    queryObject.collection,
    queryObject.newValue,
  );
  return result;
}

export async function insertMany(queryObject: any): Promise<MongoInterface> {
  const result = await localInsertMany(
    queryObject.name,
    queryObject.db,
    queryObject.collection,
    queryObject.newValue,
  );
  return result;
}

export async function find(queryObject: any): Promise<MongoInterface> {
  const result = await localFind(
    queryObject.name,
    queryObject.db,
    queryObject.collection,
    queryObject.query,
    queryObject.sort,
    queryObject.fields,
    queryObject.skip,
    queryObject.limit,
  );
  return result;
}

export async function findOne2(queryObject: MongoQueryInterface): Promise<MongoInterface> {
  const result = await localFindOne(
    queryObject.name,
    queryObject.db,
    queryObject.collection,
    queryObject.query,
    queryObject.fields,
  );
  return result;
}

export async function deleteOne2(queryObject: MongoQueryInterface): Promise<MongoInterface> {
  const result = await localDeleteOne(
    queryObject.name,
    queryObject.db,
    queryObject.collection,
    queryObject.query,
  );
  return result;
}

export async function deleteMany2(queryObject: MongoQueryInterface): Promise<MongoInterface> {
  const result = await localDeleteMany(
    queryObject.name,
    queryObject.db,
    queryObject.collection,
    queryObject.query,
  );
  return result;
}

export async function updateOne2(queryObject: MongoQueryInterface): Promise<MongoInterface> {
  const result = await localUpdateOne(
    queryObject.name,
    queryObject.db,
    queryObject.collection,
    queryObject.query,
    queryObject.newValue,
    queryObject.upsert,
  );
  return result;
}

export async function insertOne2(queryObject: MongoQueryInterface): Promise<MongoInterface> {
  const result = await localInsertOne(
    queryObject.name,
    queryObject.db,
    queryObject.collection,
    queryObject.newValue,
  );
  return result;
}

export async function insertMany2(queryObject: MongoQueryInterface): Promise<MongoInterface> {
  const result = await localInsertMany(
    queryObject.name,
    queryObject.db,
    queryObject.collection,
    queryObject.newValue,
  );
  return result;
}

export async function find2(queryObject: MongoQueryInterface): Promise<MongoInterface> {
  const result = await localFind(
    queryObject.name,
    queryObject.db,
    queryObject.collection,
    queryObject.query,
    queryObject.sort,
    queryObject.fields,
    queryObject.skip,
    queryObject.limit,
  );
  return result;
}

export async function countDocuments(queryObject: MongoQueryInterface): Promise<MongoInterface> {
  const result = await localCountDocuments(
    queryObject.name,
    queryObject.db,
    queryObject.collection,
    queryObject.query,
  );
  return result;
}
