import * as forge from 'node-forge';
import * as _ from 'lodash';
import * as washLogger from './logger';

const logger = washLogger.getLogger('washswat-engine:util2');

export function getLogger(name: string):any {
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

export function debugEx(ex:any, isBeautify:boolean):string{
  const output = structuredClone(ex);
  let returnVal:string = '';
  try{
    if(output?.config) delete output.config;
    if(output?.request) delete output.request;

    if(isBeautify){
      returnVal = JSON.stringify(output, null, 2);
    }else{
      returnVal = JSON.stringify(output);
    }
  }catch(ex){
    returnVal = `${ex}`;
  }
  return returnVal;
}
