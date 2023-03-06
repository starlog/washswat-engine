import * as log4js from 'log4js';
import * as forge from 'node-forge';
import * as _ from 'lodash';

log4js.configure({
  appenders: {
    out: { type: 'stdout', layout: { type: 'messagePassThrough' } },
    basic: { type: 'stdout', layout: { type: 'basic' } },
  },
  categories: {
    default: { appenders: ['basic'], level: 'info' },
  },
});
const logList: any[] = [];

function findMyLogger(name:string){
  for(const element of logList){
    if(element.key === name){
      return element.logger;
    }
  }
  return null;
}

const logger = getLogger('washswat-engine:util2');
setLogLevel('washswat-engine:util2','error');

export function getLogger(name: string) {
  let myLogger = findMyLogger(name);

  if(!myLogger){
    const myLoggerLocal = log4js.getLogger(name);
    myLoggerLocal.level = 'info';
    logList.push({key:name, logger: myLoggerLocal});
    myLogger = myLoggerLocal;
  }
  return myLogger;
}

export function setLogLevel(logName: string, level: string) {
  if (logName !== 'all') {
    const myLogger = findMyLogger(logName);
    myLogger.level = level;
  } else {
    logList.forEach((x) => {
      x.logger.level = level;
    })
  }
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
