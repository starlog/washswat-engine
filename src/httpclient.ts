import axios from 'axios';
import * as http from 'http';
import * as https from 'https';
import * as util2 from './util2';
import * as cache from './cache';
import * as _ from 'lodash';
import * as washLogger from './logger';
import * as api from './api';

const logger = washLogger.getLogger('washswat-engine:http');

const REDIS_KEY_PREFIX = 'washswat-tool-http';

// Interfaces
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
const sleep = (ms:number) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

let rosettaRouteTable:any[] = [];
let rosettaUserTable:any[] = [];
export function setRosettaRouteTable(table:any[]) {
  rosettaRouteTable = JSON.parse(JSON.stringify(table));
}
export function setRosettaUserTable(table:any[]) {
  rosettaUserTable = JSON.parse(JSON.stringify(table));
}

function isRosettaUser(xWashswatToken:string) {
  if(rosettaUserTable.length === 0) return false;
  const tokenValue = api.extractJwtWithoutAuthentication(xWashswatToken);
  return rosettaUserTable.includes(tokenValue.uid);
}

function rosettaRoute(qo: RestQueryInterface):RestQueryInterface {
  try{
    if(rosettaRouteTable.length === 0) return qo;
    // x-washswat-token 이 존재하는 washswat API 에 대해서만 처리
    if(qo.headers['x-washswat-token'] === undefined) return qo;
    // 해당 사용자가 테이블에 존재하는 경우에만 처리
    if(!isRosettaUser(qo.headers['x-washswat-token'])) return qo;

    for(const element of rosettaRouteTable) {
      if (element.method === qo.method) {
        const convertString = element.normal.replaceAll('/', '\/');
        const re: RegExp = new RegExp(convertString);

        if (re.test(qo.url)) { // Matching path signature
          // Match found
          if(element.testing) {
            let outputUrl = element.testing;
            const match = re.exec(qo.url);
            if (match && match.length > 1) {
              for (let i = 1; i < match.length; i++) {
                outputUrl = outputUrl.replace(`##${i}##`, match[i]);
              }
              console.log(`ROSETTA route Change: CHANGE URL ${qo.url} -> ${outputUrl} for ${api.extractJwtWithoutAuthentication(qo.headers['x-washswat-token']).uid}`);
              qo.url = outputUrl;
              break;
            }
          } else {
            logger.error(`(IGNORING) rosettaRoute: no testing value for ${qo.url}`);
          }
        }
      }
    }
    return qo;
  } catch (ex) {
    logger.error(`(IGNORING) rosettaRoute: try-catch ERROR ${ex}`);
    return qo;
  }
}


async function callOne(qo: RestQueryInterface) {
  const res = await axios({
    method: qo.method,
    url: qo.url,
    params: !_.isEmpty(qo.params) ? qo.params : undefined,
    timeout: qo.timeout ? qo.timeout : 300,
    data: !_.isEmpty(qo.body) ? qo.body : undefined,
    headers: !_.isEmpty(qo.headers) ? qo.headers : undefined,
    auth: !_.isEmpty(qo.auth) ? qo.auth : undefined,
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
    httpAgent: new http.Agent({ keepAlive: true }),
    httpsAgent: new https.Agent({ keepAlive: true }),
  });
  return res;
}

async function call2(qo: RestQueryInterface) {
  let result: any;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < qo.retryConfig.times; i++) {
    try {
      // eslint-disable-next-line no-await-in-loop
      result = await callOne(qo);
      break;
    } catch (ex) {
      logger.debug(`got error: ${ex}`);
      result = ex;
      // eslint-disable-next-line no-await-in-loop,no-promise-executor-return
      await new Promise((f) => setTimeout(f, qo.retryConfig.interval));
    }
  }
  return result;
}

export async function call(qoOriginal: RestQueryInterface): Promise<any> {
  const qo = rosettaRoute(qoOriginal);
  let result: any;
  const REDIS_KEY = util2.genHashKey(REDIS_KEY_PREFIX, qo);

  if (qo.useCache) {
    const myData = await cache.get(REDIS_KEY);
    if (myData) {
      logger.info(`CACHED! ${JSON.stringify(qo)}`);
      result = myData;
    } else {
      logger.info(`NOT CACHED! ${JSON.stringify(qo)}`);
    }
  } else {
    logger.info(`NO CACHE CALL! ${JSON.stringify(qo)}`);
  }
  if (!result) {
    let isLoop = true;
    let loopCount = 0;

    while(isLoop){
      try{
        const myData = await callOne(qo);
        if (qo.useCache && myData !== null) {
          await cache.set(REDIS_KEY, myData, qo.cacheTtl);
        }
        result = myData;
        isLoop = false;
      } catch (ex){
        if(loopCount < qo.retryConfig.times){
          logger.debug(`washswat:httpRequest error: ${ex}, qo:${util2.stringifyWithoutCircular(qo)}`);
          loopCount++;
          await sleep(qo.retryConfig.interval);
        } else {
          isLoop = false;
          throw ex;
        }
      }
    }
  }
  return result;
}
