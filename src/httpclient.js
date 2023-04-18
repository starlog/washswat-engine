"use strict";
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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.call = void 0;
var axios_1 = require("axios");
var http = require("http");
var https = require("https");
var util2 = require("./util2");
var cache = require("./cache");
var _ = require("lodash");
var washLogger = require("./logger");
var logger = washLogger.getLogger('washswat-engine:http');
var REDIS_KEY_PREFIX = 'washswat-tool-http';
var sleep = function (ms) { return new Promise(function (resolve) {
    setTimeout(resolve, ms);
}); };
function callOne(qo) {
    return __awaiter(this, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, axios_1.default)({
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
                    })];
                case 1:
                    res = _a.sent();
                    return [2 /*return*/, res];
            }
        });
    });
}
function call2(qo) {
    return __awaiter(this, void 0, void 0, function () {
        var result, i, ex_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < qo.retryConfig.times)) return [3 /*break*/, 7];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 6]);
                    return [4 /*yield*/, callOne(qo)];
                case 3:
                    // eslint-disable-next-line no-await-in-loop
                    result = _a.sent();
                    return [3 /*break*/, 7];
                case 4:
                    ex_1 = _a.sent();
                    logger.debug("got error: ".concat(ex_1));
                    result = ex_1;
                    // eslint-disable-next-line no-await-in-loop,no-promise-executor-return
                    return [4 /*yield*/, new Promise(function (f) { return setTimeout(f, qo.retryConfig.interval); })];
                case 5:
                    // eslint-disable-next-line no-await-in-loop,no-promise-executor-return
                    _a.sent();
                    return [3 /*break*/, 6];
                case 6:
                    i++;
                    return [3 /*break*/, 1];
                case 7: return [2 /*return*/, result];
            }
        });
    });
}
function call(qo) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var result, REDIS_KEY, myData, i, myData, myData;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    REDIS_KEY = util2.genHashKey(REDIS_KEY_PREFIX, qo);
                    if (!qo.useCache) return [3 /*break*/, 2];
                    return [4 /*yield*/, cache.get(REDIS_KEY)];
                case 1:
                    myData = _b.sent();
                    if (myData) {
                        logger.info("CACHED! ".concat(JSON.stringify(qo)));
                        result = myData;
                    }
                    else {
                        logger.info("NOT CACHED! ".concat(JSON.stringify(qo)));
                    }
                    _b.label = 2;
                case 2:
                    if (!!result) return [3 /*break*/, 14];
                    if (!(((_a = qo === null || qo === void 0 ? void 0 : qo.retryConfig) === null || _a === void 0 ? void 0 : _a.times) > 1)) return [3 /*break*/, 10];
                    i = 0;
                    _b.label = 3;
                case 3:
                    if (!(i < qo.retryConfig.times)) return [3 /*break*/, 9];
                    return [4 /*yield*/, callOne(qo)];
                case 4:
                    myData = _b.sent();
                    if (!(qo.useCache && myData !== null)) return [3 /*break*/, 6];
                    return [4 /*yield*/, cache.set(REDIS_KEY, myData, qo.cacheTtl)];
                case 5:
                    _b.sent();
                    _b.label = 6;
                case 6:
                    result = myData;
                    if (result.status === 200) {
                        return [3 /*break*/, 9];
                    }
                    return [4 /*yield*/, sleep(qo.retryConfig.interval)];
                case 7:
                    _b.sent();
                    _b.label = 8;
                case 8:
                    i++;
                    return [3 /*break*/, 3];
                case 9: return [3 /*break*/, 14];
                case 10: return [4 /*yield*/, callOne(qo)];
                case 11:
                    myData = _b.sent();
                    if (!(qo.useCache && myData !== null)) return [3 /*break*/, 13];
                    return [4 /*yield*/, cache.set(REDIS_KEY, myData, qo.cacheTtl)];
                case 12:
                    _b.sent();
                    _b.label = 13;
                case 13:
                    result = myData;
                    _b.label = 14;
                case 14: return [2 /*return*/, result];
            }
        });
    });
}
exports.call = call;
