"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setLogLevel = exports.getLogger = exports.logList = void 0;
var moment_timezone_1 = require("moment-timezone");
var logLevel = ['all', 'debug', 'info', 'warn', 'error', 'fatal', 'off'];
//--------------------------------------------------------------------------------------------------
var FelixLogger = /** @class */ (function () {
    function FelixLogger(name) {
        this.name = name;
        this.prompt = name;
        this.isTimeStamp = false;
        this.level = 'error';
    }
    FelixLogger.prototype.setLevel = function (level) {
        if (logLevel.indexOf(level) === -1) {
            return { status: false, message: "Level must be one of ".concat(JSON.stringify(logLevel)) };
        }
        else {
            this.level = level;
            return { status: true, message: 'success' };
        }
    };
    FelixLogger.prototype.setPrompt = function (prompt) {
        this.prompt = prompt;
        return { status: true, message: 'success' };
    };
    FelixLogger.prototype.setIsTimestamp = function (isTimeStamp) {
        this.isTimeStamp = isTimeStamp;
        return { status: true, message: 'success' };
    };
    FelixLogger.prototype.print = function (data, functionLevel) {
        var setIndex = logLevel.indexOf(this.level);
        var functionIndex = logLevel.indexOf(functionLevel);
        if (setIndex <= functionIndex) {
            if (functionLevel === 'err' || functionLevel === 'fatal') {
                console.error("".concat(this.isTimeStamp ? '[' + moment_timezone_1.default.tz('Asia/Seoul').toISOString() + ']' : '', "[").concat(this.prompt, "] ").concat(data));
            }
            else {
                console.log("".concat(this.isTimeStamp ? '[' + moment_timezone_1.default.tz('Asia/Seoul').toISOString() + ']' : '', "[").concat(this.prompt, "] ").concat(data));
            }
        }
    };
    FelixLogger.prototype.debug = function (data) {
        this.print(data, 'debug');
    };
    FelixLogger.prototype.info = function (data) {
        this.print(data, 'info');
    };
    FelixLogger.prototype.warn = function (data) {
        this.print(data, 'warn');
    };
    FelixLogger.prototype.error = function (data) {
        this.print(data, 'error');
    };
    FelixLogger.prototype.fatal = function (data) {
        this.print(data, 'fatal');
    };
    return FelixLogger;
}());
exports.logList = [];
//--------------------------------------------------------------------------------------------------
function findMyLogger(name) {
    for (var _i = 0, logList_1 = exports.logList; _i < logList_1.length; _i++) {
        var element = logList_1[_i];
        if (element.name === name) {
            return element;
        }
    }
    return null;
}
//--------------------------------------------------------------------------------------------------
function getLogger(loggerName) {
    var myLogger = findMyLogger(loggerName);
    if (!myLogger) {
        myLogger = new FelixLogger(loggerName);
        exports.logList.push(myLogger);
    }
    return myLogger;
}
exports.getLogger = getLogger;
//--------------------------------------------------------------------------------------------------
function setLogLevel(loggerName, level) {
    if (logLevel.indexOf(level) !== -1) {
        if (loggerName === 'all') { // apply to all
            exports.logList.forEach(function (x) {
                x.level = level;
            });
            return { status: true, message: 'success' };
        }
        else {
            var myLogger = findMyLogger(loggerName);
            if (myLogger) {
                myLogger.level = level;
                return { status: true, message: 'success' };
            }
            else {
                return { status: false, message: "Cannot find logger name:".concat(loggerName) };
            }
        }
    }
    else { // level string does not match
        return {
            status: false,
            message: "Invalid level data:".concat(level, ". This should be one of ").concat(JSON.stringify(logLevel))
        };
    }
}
exports.setLogLevel = setLogLevel;
