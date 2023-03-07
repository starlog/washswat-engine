import * as mysql from 'mysql2/promise';
import * as _ from 'lodash';
import * as util2 from './util2';
import * as cache from './cache';
import * as washLogger from './logger';

const logger = washLogger.getLogger('washswat-engine:mysql');

const REDIS_KEY_PREFIX = 'washswat-tool-mysql';

let pool: any;

let localConnectionConfig: any;

// Interfaces
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

export async function init(connectionConfig: MysqlConnectionInterface): Promise<MysqlInterface> {
  let returnVal: any = { status: false, message: 'not initialized', data: {} };

  localConnectionConfig = _.cloneDeep(connectionConfig);

  pool = await mysql.createPool({
    connectionLimit: 2,
    host: connectionConfig.host,
    user: connectionConfig.user,
    password: connectionConfig.password,
    database: connectionConfig.database,
  });

  if (Object.keys(pool).length > 0) {
    returnVal = { status: true, message: 'success', data: {} };
  }
  return returnVal;
}

export async function query(queryString: string): Promise<MysqlInterface> {
  let returnVal: any;

  const REDIS_KEY = util2.genHashKey(REDIS_KEY_PREFIX, {
    mode: 'query', queryString,
  });

  console.log(`localConnectionConfig.useCache=${localConnectionConfig.useCache}`);
  let myData: any;
  if (localConnectionConfig.useCache) {
    myData = await cache.get(REDIS_KEY);
    logger.debug(`USING CACHE: data is ${util2.stringifyWithoutCircular(myData)}`);
    if (myData) {
      return { status: true, message: 'success', data: myData };
    }
  }
  if (!myData) {
    logger.debug('USING QUERY');

    const [myRows, myFields] = await pool.query(queryString);
    const myDataOut = { rows: myRows, fields: myFields };
    if (localConnectionConfig.useCache) {
      await cache.set(REDIS_KEY, myDataOut, localConnectionConfig.cacheTTL);
    }

    returnVal = { status: true, message: 'success', data: myDataOut };
  }
  return returnVal;
}
