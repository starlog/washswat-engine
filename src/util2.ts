import * as forge from 'node-forge';
import * as _ from 'lodash';
import * as washLogger from './logger';
import * as crypto from "crypto";
let jwt = require('jsonwebtoken');
const {google} = require('googleapis');


const logger = washLogger.getLogger('washswat-engine:util2');

export function getLogger(name: string): any {
  return washLogger.getLogger(name);
}

export function setLogLevel(logName: string, level: string) {
  return washLogger.setLogLevel(logName, level);
}

export function debug(data: string) {
  logger.debug(data);
}

export function info(data: string) {
  logger.info(data);
}

export function error(data: string) {
  logger.error(data);
}

const getCircularReplacer = (): any => {
  const seen = new WeakSet();
  return (key: any, value: any) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return null;
      }
      seen.add(value);
    }
    return value;
  };
};

export function stringify(object: any) {
  let output: any = object;
  try {
    output = JSON.stringify(object, null, 2);
  } catch (e) {
    // intentional
  }
  return output;
}

export function stringify2(object: any) {
  let output: any = object;
  try {
    output = JSON.stringify(object);
  } catch (e) {
    // intentional
  }
  return output;
}

export function stringifyWithoutCircular(object: any) {
  let output = object;
  try {
    output = JSON.stringify(object, getCircularReplacer());
  } catch (e) {
    // intentional
  }
  return output;
}

export function displayHttpResult(result: any) {
  const copyData = _.cloneDeep(result);
  if (copyData?.config) {
    delete copyData.config;
  }
  if (copyData?.request) {
    delete copyData.request;
  }
  return stringifyWithoutCircular(copyData);
}

export function genHashKey(prefix: string, object: object) {
  const md = forge.md.sha512.create();
  if (typeof object === 'object') {
    md.update(stringify2(object));
  } else {
    md.update(object);
  }
  const result = md.digest().toHex();
  logger.debug(`genHashKey Generating key for:${prefix}-${stringify2(object)} =>${result}`);
  return `${prefix}-${result}`;
}

export function debugDump(object: any, arrayLimit: number, stringLimit: number, isPretty: boolean) {
  let myArrayLimit = arrayLimit;
  let myStringLimit = stringLimit;

  if (!myArrayLimit) {
    myArrayLimit = 3;
  }
  if (!myStringLimit) {
    myStringLimit = 200;
  }
  let output = object;

  try {
    if (_.isArray(object)) {
      let localCopy = _.clone(object);
      localCopy = localCopy.slice(0, myArrayLimit);
      if (isPretty) {
        output = `\nDump(${myArrayLimit}) elements only_______________\n${JSON.stringify(localCopy, null, 2)}`;
      } else {
        output = `Dump(${myArrayLimit}) :${JSON.stringify(localCopy)}`;
      }
    } else if (isPretty) {
      output = `\nDump first(${
        myStringLimit
      }) characters only_______________\n${
        JSON.stringify(object, null, 2).substring(0, myStringLimit)
      }...`;
    } else {
      output = `Dump (${myStringLimit}) :${JSON.stringify(object).substring(0, myStringLimit)}...`;
    }
  } catch (ex) {
    // intentional
  }
  return output;
}

export function debugEx(ex: any, isBeautify: boolean): string {
  const output = JSON.parse(stringifyWithoutCircular(ex));
  let returnVal: string = '';
  try {
    if (output?.config) delete output.config;
    if (output?.request) delete output.request;
    if (ex?.response) {
      output.respose = {
        status: ex.response.status,
        statusText: ex.response.statusText,
        data: ex.response?.data,
      };
    }
    if (isBeautify) {
      returnVal = JSON.stringify(output, null, 2);
    } else {
      returnVal = JSON.stringify(output);
    }
  } catch (message) {
    returnVal = `${message}`;
  }
  return returnVal;
}

//--------------------------------------------------------------------------------------------------
// Object encryption and decryption
//--------------------------------------------------------------------------------------------------
const paddingData = 'THIS IS PADDING DATA 1234567890 The quick brown fox jumps over the lazy dog';
export function encryptObject(target:any, key:string, iv:string):string {
  const encoder = new TextEncoder();
  const ivByte = encoder.encode(iv+paddingData).slice(0, 16);
  const keyByte = encoder.encode(key+paddingData).slice(0, 32);
  const cipher = crypto.createCipheriv('aes-256-cbc', keyByte, ivByte);
  let encrypted = cipher.update(JSON.stringify(target), 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return encrypted;
}

export function decryptObject(target:any, key:string, iv:string):any {
  const encoder = new TextEncoder();
  const ivByte = encoder.encode(iv+paddingData).slice(0, 16);
  const keyByte = encoder.encode(key+paddingData).slice(0, 32);
  const decipher = crypto.createDecipheriv('aes-256-cbc', keyByte, ivByte);
  let decrypted = decipher.update(target, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  return JSON.parse(decrypted);
}

export function encryptObjectWithSingleKey(target:any, keyAndIv:string):string {
  const encoder = new TextEncoder();
  const ivByte = encoder.encode(keyAndIv+paddingData).slice(1, 17);
  const keyByte = encoder.encode(keyAndIv+paddingData).slice(0, 32);
  const cipher = crypto.createCipheriv('aes-256-cbc', keyByte, ivByte);
  let encrypted = cipher.update(JSON.stringify(target), 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return encrypted;
}

export function decryptObjectWithSingleKey(target:any, keyAndIv:string):any {
  const encoder = new TextEncoder();
  const ivByte = encoder.encode(keyAndIv+paddingData).slice(1, 17);
  const keyByte = encoder.encode(keyAndIv+paddingData).slice(0, 32);
  const decipher = crypto.createDecipheriv('aes-256-cbc', keyByte, ivByte);
  let decrypted = decipher.update(target, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  return JSON.parse(decrypted);
}

export function generateAppleJwt(privateKey:string, iss:string, expInMinutes:number, aud:string, kid:string): string {
  if(expInMinutes > 20) {
    throw new Error('Apple JWT token can only be valid for 20 minutes');
  }
// Define the claims for the JWT
  const claims = {
    iss: iss,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (60 * expInMinutes), // Expires in expInMinutes minutes
    aud: aud,
  };

// Sign the JWT using the private key and the RS256 algorithm
  const jwtToken = jwt.sign(claims, privateKey, { algorithm: 'ES256', header: { alg: 'ES256', kid: kid, typ: 'JWT' } });

  return jwtToken;
}

export async function generateGoogleJwt(key:any):Promise<string> {
  // create a new JWT client using the service account key
  const jwtClient = new google.auth.JWT(
    key.client_email,
    null,
    key.private_key,
    ['https://www.googleapis.com/auth/androidpublisher'],
    null
  );

// authenticate and get an access token
  const result = await jwtClient.authorize();
  return result.access_token;
}
