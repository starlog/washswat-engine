import * as log4js from 'log4js';
import * as forge from 'node-forge';
import * as _ from 'lodash';

const logger = log4js.getLogger();
logger.level = 'debug';

export function setLogLevel(level: string) {
  logger.level = level;
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

export function stringifyWithoutCircular(object: any) {
  let output = object;
  try {
    output = JSON.stringify(object, getCircularReplacer());
  } catch (e) {
    // intentional
  }
  return output;
}

const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key: any, value: any) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};

export function genHashKey(prefix: string, object: object) {
  const md = forge.md.sha512.create();
  if (typeof object === 'object') {
    md.update(stringify2(object));
  } else {
    md.update(object);
  }
  const result = md.digest().toHex();
  logger.debug('genHashKey Generating key for:' + prefix + '-' + stringify2(object) + ' =>' + result);
  return prefix + '-' + result;
}

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

export function debugDump(object: any, arrayLimit: number, stringLimit: number, isPretty: boolean) {
  if (!arrayLimit) {
    arrayLimit = 3;
  }
  if (!stringLimit) {
    stringLimit = 200;
  }
  let output = object;

  try {
    if (_.isArray(object)) {
      let _copy = _.clone(object);
      _copy = _copy.slice(0, arrayLimit);
      if (isPretty) {
        output = '\nDump(' + arrayLimit + ') elements only_______________\n' + JSON.stringify(_copy, null, 2);
      } else {
        output = 'Dump(' + arrayLimit + ') :' + JSON.stringify(_copy);
      }
    } else {
      if (isPretty) {
        output =
          '\nDump first(' +
          stringLimit +
          ') characters only_______________\n' +
          JSON.stringify(object, null, 2).substring(0, stringLimit) +
          '...';
      } else {
        output = 'Dump (' + stringLimit + ') :' + JSON.stringify(object).substring(0, stringLimit) + '...';
      }
    }
  } catch (ex) {
    // intentional
  }
  return output;
}
