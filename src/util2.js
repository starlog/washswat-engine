"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.debugEx = exports.debugDump = exports.genHashKey = exports.stringifyWithoutCircular = exports.stringify2 = exports.stringify = exports.error = exports.info = exports.debug = exports.setLogLevel = exports.getLogger = void 0;
var forge = require("node-forge");
var _ = require("lodash");
var washLogger = require("./logger");
var logger = washLogger.getLogger('washswat-engine:util2');
function getLogger(name) {
    return washLogger.getLogger(name);
}
exports.getLogger = getLogger;
function setLogLevel(logName, level) {
    return washLogger.setLogLevel(logName, level);
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
function debugEx(ex, isBeautify) {
    var _a;
    var output = JSON.parse(stringifyWithoutCircular(ex));
    var returnVal = '';
    try {
        if (output === null || output === void 0 ? void 0 : output.config)
            delete output.config;
        if (output === null || output === void 0 ? void 0 : output.request)
            delete output.request;
        if (ex === null || ex === void 0 ? void 0 : ex.response) {
            output.respose = {
                status: ex.response.status,
                statusText: ex.response.statusText,
                data: (_a = ex.response) === null || _a === void 0 ? void 0 : _a.data,
            };
        }
        if (isBeautify) {
            returnVal = JSON.stringify(output, null, 2);
        }
        else {
            returnVal = JSON.stringify(output);
        }
    }
    catch (message) {
        returnVal = "".concat(message);
    }
    return returnVal;
}
exports.debugEx = debugEx;
