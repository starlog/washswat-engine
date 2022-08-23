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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.debugDump = exports.genHashKey = exports.stringifyWithoutCircular = exports.stringify2 = exports.stringify = exports.error = exports.info = exports.debug = exports.setLogLevel = exports.getLogger = void 0;
var log4js_1 = __importDefault(require("log4js"));
var forge = __importStar(require("node-forge"));
var _ = __importStar(require("lodash"));
var logger = log4js_1.default.getLogger('washswat-engine:util2');
var logList = ['washswat-engine:util2'];
function getLogger(name) {
    if (!logList.includes(name)) {
        logList.push(name);
    }
    var myLogger = log4js_1.default.getLogger(name);
    myLogger.level = 'error';
    return myLogger;
}
exports.getLogger = getLogger;
function setLogLevel(logName, level) {
    if (logName !== 'all') {
        log4js_1.default.getLogger(logName).level = level;
    }
    else {
        logList.forEach(function (elem) {
            log4js_1.default.getLogger(elem).level = level;
        });
    }
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
var getCircularReplacer = function () {
    var seen = new WeakSet();
    return function (key, value) {
        if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) {
                return null;
            }
            seen.add(value);
        }
        return value;
    };
};
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
function genHashKey(prefix, object) {
    var md = forge.md.sha512.create();
    if (typeof object === 'object') {
        md.update(stringify2(object));
    }
    else {
        md.update(object);
    }
    var result = md.digest().toHex();
    logger.debug("genHashKey Generating key for:".concat(prefix, "-").concat(stringify2(object), " =>").concat(result));
    return "".concat(prefix, "-").concat(result);
}
exports.genHashKey = genHashKey;
function debugDump(object, arrayLimit, stringLimit, isPretty) {
    var myArrayLimit = arrayLimit;
    var myStringLimit = stringLimit;
    if (!myArrayLimit) {
        myArrayLimit = 3;
    }
    if (!myStringLimit) {
        myStringLimit = 200;
    }
    var output = object;
    try {
        if (_.isArray(object)) {
            var localCopy = _.clone(object);
            localCopy = localCopy.slice(0, myArrayLimit);
            if (isPretty) {
                output = "\nDump(".concat(myArrayLimit, ") elements only_______________\n").concat(JSON.stringify(localCopy, null, 2));
            }
            else {
                output = "Dump(".concat(myArrayLimit, ") :").concat(JSON.stringify(localCopy));
            }
        }
        else if (isPretty) {
            output = "\nDump first(".concat(myStringLimit, ") characters only_______________\n").concat(JSON.stringify(object, null, 2).substring(0, myStringLimit), "...");
        }
        else {
            output = "Dump (".concat(myStringLimit, ") :").concat(JSON.stringify(object).substring(0, myStringLimit), "...");
        }
    }
    catch (ex) {
        // intentional
    }
    return output;
}
exports.debugDump = debugDump;
//# sourceMappingURL=util2.js.map