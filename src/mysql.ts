import * as log4js from 'log4js';
import * as util2 from './util2';
import * as cache from './cache';
import * as mysql from 'mysql';
import * as _ from 'lodash';

const logger = log4js.getLogger();
logger.level = 'DEBUG';

const REDIS_KEY_PREFIX = 'washswat-tool-mysql';

let pool: any;

let _connectionConfig: any;

export async function init(connectionConfig: any) {
    return new Promise(async (resolve, reject) => {
        try {
            pool = mysql.createPool({
                connectionLimit: 2,
                host: connectionConfig.host,
                user: connectionConfig.user,
                password: connectionConfig.password,
                database: connectionConfig.database
            });
            const result = await pool.query('SELECT 1+1 as solution');
            _connectionConfig = _.cloneDeep(connectionConfig);
            resolve(true);
        } catch (ex) {
            reject(ex);
        }
    })
}

export async function query(queryString: string) {
    return new Promise(async (resolve, reject) => {
        try {
            const REDIS_KEY = util2.genHashKey(REDIS_KEY_PREFIX, {
                mode: 'query', queryString
            });

            let data: any;
            if (_connectionConfig.useCache) {
                data = await cache.get(REDIS_KEY);
                logger.debug('USING CACHE: data is ' + util2.stringifyWithoutCircular(data));
                if (data) resolve(data);
            }
            if (!data) {
                logger.debug('USING QUERY');

                pool.getConnection((error: any, connection: any) => {
                    if (error) {
                        reject(error);
                    } else {
                        connection.query(queryString, (error2: any, result: any) => {
                            connection.release();
                            if (error2) {
                                reject(error2);
                            } else {
                                resolve(result);
                            }
                        })
                    }
                })
            }
        } catch (ex) {
            reject(ex);
        }
    })

}
