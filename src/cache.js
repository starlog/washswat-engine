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
exports.get = exports.set = exports.initRedis = exports.isRedisEnabled = void 0;
var node_cache_1 = require("node-cache");
var util2 = require("./util2");
var washLogger = require("./logger");
var redis_1 = require("redis");
var redisClient;
var isRedisInit = false;
var redisConfig = null;
var logger = washLogger.getLogger('washswat-engine:cache');
var myCache = new node_cache_1.default({ stdTTL: 600, checkperiod: 20 });
//--------------------------------------------------------------------------------------------------
function isRedisEnabled() {
    return isRedisInit;
}
exports.isRedisEnabled = isRedisEnabled;
//--------------------------------------------------------------------------------------------------
function initRedis(redisInfo) {
    return __awaiter(this, void 0, void 0, function () {
        var returnVal, redisUrl, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    returnVal = false;
                    if (!isRedisInit) return [3 /*break*/, 1];
                    returnVal = true;
                    return [3 /*break*/, 4];
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    redisUrl = "redis://".concat(redisInfo.host, ":").concat(redisInfo.port);
                    redisClient = (0, redis_1.createClient)({ url: redisUrl });
                    return [4 /*yield*/, redisClient.connect()];
                case 2:
                    _a.sent();
                    redisConfig = JSON.parse(JSON.stringify(redisInfo));
                    isRedisInit = true;
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    logger.error("Redis connection failed. ".concat(err_1));
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/, returnVal];
            }
        });
    });
}
exports.initRedis = initRedis;
//--------------------------------------------------------------------------------------------------
function set(cacheKey, value, ttlInSeconds) {
    return __awaiter(this, void 0, void 0, function () {
        var stringValue, savingData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!isRedisInit) return [3 /*break*/, 2];
                    stringValue = util2.stringifyWithoutCircular(value);
                    return [4 /*yield*/, redisClient.setEx("".concat(redisConfig.prefix).concat(cacheKey), ttlInSeconds, stringValue)];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    savingData = JSON.parse(util2.stringifyWithoutCircular(value));
                    return [2 /*return*/, myCache.set(cacheKey, savingData, ttlInSeconds)];
            }
        });
    });
}
exports.set = set;
//--------------------------------------------------------------------------------------------------
function get(cacheKey) {
    return __awaiter(this, void 0, void 0, function () {
        var stringData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!isRedisInit) return [3 /*break*/, 2];
                    return [4 /*yield*/, redisClient.get("".concat(redisConfig.prefix).concat(cacheKey))];
                case 1:
                    stringData = _a.sent();
                    return [2 /*return*/, JSON.parse(stringData)];
                case 2: return [2 /*return*/, myCache.get(cacheKey)];
            }
        });
    });
}
exports.get = get;
