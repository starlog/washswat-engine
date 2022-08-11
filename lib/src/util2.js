"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.debugDump = exports.stringify2 = exports.stringify = exports.genHashKey = exports.stringifyWithoutCircular = exports.error = exports.info = exports.debug = exports.setLogLevel = void 0;
var log4js = __importStar(require("log4js"));
var forge = __importStar(require("node-forge"));
var _ = __importStar(require("lodash"));
var logger = log4js.getLogger();
logger.level = 'debug';
function setLogLevel(level) {
    logger.level = level;
}
exports.setLogLevel = setLogLevel;
function debug(data) {
    logger.debug(data);
}
exports.debug = debug;
function info(data) {
    logger.info(data);
}
exports.info = info;
function error(data) {
    logger.error(data);
}
exports.error = error;
function stringifyWithoutCircular(object) {
    var output = object;
    try {
        output = JSON.stringify(object, getCircularReplacer());
    }
    catch (e) {
        // intentional
    }
    return output;
}
exports.stringifyWithoutCircular = stringifyWithoutCircular;
var getCircularReplacer = function () {
    var seen = new WeakSet();
    return function (key, value) {
        if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) {
                return;
            }
            seen.add(value);
        }
        return value;
    };
};
function genHashKey(prefix, object) {
    var md = forge.md.sha512.create();
    if (typeof object === 'object') {
        md.update(stringify2(object));
    }
    else {
        md.update(object);
    }
    var result = md.digest().toHex();
    logger.debug('genHashKey Generating key for:' + prefix + '-' + stringify2(object) + ' =>' + result);
    return prefix + '-' + result;
}
exports.genHashKey = genHashKey;
function stringify(object) {
    var output = object;
    try {
        output = JSON.stringify(object, null, 2);
    }
    catch (e) {
        // intentional
    }
    return output;
}
exports.stringify = stringify;
function stringify2(object) {
    var output = object;
    try {
        output = JSON.stringify(object);
    }
    catch (e) {
        // intentional
    }
    return output;
}
exports.stringify2 = stringify2;
function debugDump(object, arrayLimit, stringLimit, isPretty) {
    if (!arrayLimit) {
        arrayLimit = 3;
    }
    if (!stringLimit) {
        stringLimit = 200;
    }
    var output = object;
    try {
        if (_.isArray(object)) {
            var _copy = _.clone(object);
            _copy = _copy.slice(0, arrayLimit);
            if (isPretty) {
                output = '\nDump(' + arrayLimit + ') elements only_______________\n' + JSON.stringify(_copy, null, 2);
            }
            else {
                output = 'Dump(' + arrayLimit + ') :' + JSON.stringify(_copy);
            }
        }
        else {
            if (isPretty) {
                output =
                    '\nDump first(' +
                        stringLimit +
                        ') characters only_______________\n' +
                        JSON.stringify(object, null, 2).substring(0, stringLimit) +
                        '...';
            }
            else {
                output = 'Dump (' + stringLimit + ') :' + JSON.stringify(object).substring(0, stringLimit) + '...';
            }
        }
    }
    catch (ex) {
        // intentional
    }
    return output;
}
exports.debugDump = debugDump;
//# sourceMappingURL=util2.js.map