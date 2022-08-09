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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.callWithComStatus = exports.call = void 0;
var async = __importStar(require("async"));
var axios = __importStar(require("axios"));
var log4js = __importStar(require("log4js"));
var util2 = __importStar(require("./util2"));
var moment_1 = __importDefault(require("moment"));
var Qs = __importStar(require("qs"));
var cache = __importStar(require("./cache"));
var http = __importStar(require("http"));
var https = __importStar(require("https"));
var logger = log4js.getLogger();
logger.level = 'DEBUG';
var REDIS_KEY_PREFIX = 'washswat-tool-http';
var axiosClient = axios.default.create({
    httpAgent: new http.Agent({ keepAlive: true }),
    httpsAgent: new https.Agent({ keepAlive: true }),
});
function call(queryObject) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                    var REDIS_KEY, data, _startTime_1;
                    var _this = this;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if ((queryObject === null || queryObject === void 0 ? void 0 : queryObject.url) === undefined) {
                                    reject('queryObject has no url');
                                    return [2 /*return*/];
                                }
                                if ((queryObject === null || queryObject === void 0 ? void 0 : queryObject.method) === undefined) {
                                    reject('queryObject has no method');
                                    return [2 /*return*/];
                                }
                                REDIS_KEY = util2.genHashKey(REDIS_KEY_PREFIX, { mode: 'call', data: queryObject });
                                if (!queryObject.useCache) return [3 /*break*/, 2];
                                return [4 /*yield*/, cache.get(REDIS_KEY)];
                            case 1:
                                data = _a.sent();
                                logger.debug('USING CACHE: data is ' + util2.stringifyWithoutCircular(data));
                                if (data)
                                    resolve(data);
                                _a.label = 2;
                            case 2:
                                if (!data) {
                                    logger.debug('USING REST');
                                    _startTime_1 = (0, moment_1.default)();
                                    async.retry(queryObject.retryConfig, async.apply(_call, queryObject), function (err, result) { return __awaiter(_this, void 0, void 0, function () {
                                        var diff, saveData;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    diff = (0, moment_1.default)().diff(_startTime_1, 'milliseconds');
                                                    logger.debug('http.call execution time is ' + diff + ' milliseconds.');
                                                    if (!err) return [3 /*break*/, 1];
                                                    reject(err);
                                                    return [3 /*break*/, 4];
                                                case 1:
                                                    saveData = {
                                                        status: result.status,
                                                        statusText: result.statusText,
                                                        header: result.headers,
                                                        data: result.data,
                                                    };
                                                    if (!queryObject.useCache) return [3 /*break*/, 3];
                                                    return [4 /*yield*/, cache.set(REDIS_KEY, saveData, queryObject.CacheTTL)];
                                                case 2:
                                                    _a.sent();
                                                    _a.label = 3;
                                                case 3:
                                                    resolve(result);
                                                    _a.label = 4;
                                                case 4: return [2 /*return*/];
                                            }
                                        });
                                    }); });
                                }
                                return [2 /*return*/];
                        }
                    });
                }); })];
        });
    });
}
exports.call = call;
function callWithComStatus(queryObject, expectedResultCode) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                    var REDIS_KEY, data, _startTime_2;
                    var _this = this;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if ((queryObject === null || queryObject === void 0 ? void 0 : queryObject.url) === undefined) {
                                    reject('queryObject has no url');
                                    return [2 /*return*/];
                                }
                                if ((queryObject === null || queryObject === void 0 ? void 0 : queryObject.method) === undefined) {
                                    reject('queryObject has no method');
                                    return [2 /*return*/];
                                }
                                REDIS_KEY = util2.genHashKey(REDIS_KEY_PREFIX, { mode: 'call', data: queryObject });
                                if (!queryObject.useCache) return [3 /*break*/, 2];
                                return [4 /*yield*/, cache.get(REDIS_KEY)];
                            case 1:
                                data = _a.sent();
                                logger.debug('USING CACHE: data is ' + util2.stringifyWithoutCircular(data));
                                if (data)
                                    resolve(data);
                                _a.label = 2;
                            case 2:
                                if (!data) {
                                    logger.debug('USING REST');
                                    _startTime_2 = (0, moment_1.default)();
                                    async.retry(queryObject.retryConfig, async.apply(_callWithStatusCode, queryObject, expectedResultCode), function (err, result) { return __awaiter(_this, void 0, void 0, function () {
                                        var diff, saveData;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    diff = (0, moment_1.default)().diff(_startTime_2, 'milliseconds');
                                                    logger.debug('http.callWithStatusCode execution time is ' + diff + ' milliseconds.');
                                                    if (!err) return [3 /*break*/, 1];
                                                    reject(err);
                                                    return [3 /*break*/, 4];
                                                case 1:
                                                    saveData = {
                                                        status: result.status,
                                                        statusText: result.statusText,
                                                        header: result.headers,
                                                        data: result.data,
                                                    };
                                                    if (!queryObject.useCache) return [3 /*break*/, 3];
                                                    return [4 /*yield*/, cache.set(REDIS_KEY, saveData, queryObject.CacheTTL)];
                                                case 2:
                                                    _a.sent();
                                                    _a.label = 3;
                                                case 3:
                                                    resolve(result);
                                                    _a.label = 4;
                                                case 4: return [2 /*return*/];
                                            }
                                        });
                                    }); });
                                }
                                return [2 /*return*/];
                        }
                    });
                }); })];
        });
    });
}
exports.callWithComStatus = callWithComStatus;
function _call(qo, callback) {
    logger.debug('_call qo=' + JSON.stringify(qo));
    axiosClient({
        method: qo.method ? qo.method : '',
        url: qo.url ? qo.url : '',
        params: qo.params ? qo.params : {},
        paramsSerializer: function (params) {
            return Qs.stringify(params, { arrayFormat: 'brackets' });
        },
        timeout: qo.timeout ? qo.timeout : '300',
        data: qo.data ? qo.data : {},
        headers: qo.headers ? qo.headers : {},
    })
        .then(function (response) {
        if (response.status === 200) {
            logger.debug('_call success(1) url=' + qo.url);
            callback(null, response);
        }
        else {
            logger.debug('_call fail(1) url=' + qo.url + ' (response.code=' + response.status + ')');
            callback(response.status, response);
        }
    })
        .catch(function (ex) {
        if (ex.stack) {
            logger.error('_call fail(2) url=' + qo.url + '\n' + ex.stack);
        }
        else {
            logger.error('_call fail(2) url=' + qo.url + '\n' + ex);
        }
        callback(ex, ex.response);
    });
}
function _callWithStatusCode(qo, expectedResultCode, callback) {
    logger.debug('_callWithstuatusCode qo=' + JSON.stringify(qo));
    axiosClient({
        method: qo.method ? qo.method : '',
        url: qo.url ? qo.url : '',
        params: qo.params ? qo.params : {},
        paramsSerializer: function (params) {
            return Qs.stringify(params, { arrayFormat: 'brackets' });
        },
        timeout: qo.timeout ? qo.timeout : '300',
        data: qo.data ? qo.data : {},
        headers: qo.headers ? qo.headers : {},
    }).then(function (response) {
        logger.debug('_callWithStatusCode success(1) url=' + qo.url);
        callback(null, response);
    }).catch(function (ex) {
        if (ex.response && ex.response.status && expectedResultCode.includes(ex.response.status)) {
            logger.debug('_callWithStatusCode success(2) url=' + qo.url + '(response.status=' + ex.response.status + ')');
            callback(null, ex.response);
        }
        else {
            if (ex.stack) {
                logger.debug('_callWithStatusCode(error) url=' + qo.url + '\n' + ex.stack);
            }
            else {
                logger.debug('_callWithStatusCode(error) url=' + qo.url + '\n' + ex);
            }
            callback(ex, ex.response);
        }
    });
}
//# sourceMappingURL=httpclient.js.map