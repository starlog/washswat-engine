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
exports.get = exports.set = void 0;
var node_cache_1 = __importDefault(require("node-cache"));
var myCache = new node_cache_1.default();
var log4js = __importStar(require("log4js"));
var logger = log4js.getLogger();
logger.level = 'debug';
function set(cacheKey, value, ttl) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        myCache.set(cacheKey, value, ttl);
                        resolve(true);
                        return [2 /*return*/];
                    });
                }); })];
        });
    });
}
exports.set = set;
function get(cacheKey) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                    var data;
                    return __generator(this, function (_a) {
                        data = myCache.get(cacheKey);
                        resolve(data);
                        return [2 /*return*/];
                    });
                }); })];
        });
    });
}
exports.get = get;
//
// exports.set = function (cachekey, value, ttl, callback)
// {
//     if (value)
//     {
//         if (_isRedisInitialized)
//         {
//             logger.debug('using redis cache');
//             redisSetVal(_redisMaster, cachekey, value, ttl, function (err, result)
//             {
//                 if (err)
//                 {
//                     logger.info('redisCache:set, err=' + err + ', result=' + result);
//                 }
//                 callback(err, result);
//             });
//         }
//         else
//         {
//             let saveData;
//             logger.debug('using node.js cache');
//             try
//             {
//                 saveData = JSON.stringify(value);
//             }
//             catch (e)
//             {
//                 saveData = result;
//             }
//
//             myCache.set(cachekey, saveData, ttl);
//             callback(null, value);
//         }
//
//     }
//     else //데이타가 null이면 저장하지 않고 그냥 성공 리턴
//     {
//         callback(null, null);
//     }
// };
// ///////////////////////////////////////////////////////////////////////////////////////////////////
// // myCache replacement, Felix
// // 응용프로그램에서 initialize를 하면 redis로, 하지 않으면 기존 메모리 캐시를 사용한다.
// // 오브젝트르 set하는 경우 자동으로 JSON String으로 변환하여 redis에 저장하고,
// // get 하는 경우 다시 오브젝트로 변환해준다.
// //
// // 초기화를 하지 않고 사용하면 REDIS가 아닌 node-cache를 사용하게 된다. (로컬 캐싱)
// ///////////////////////////////////////////////////////////////////////////////////////////////////
// 'use strict';
//
// let async = require('async');
// const NodeCache = require('node-cache');
// const myCache = new NodeCache({stdTTL: 100});
// let Redis = require('ioredis');
// let util = require('util');
// let log4js = require('log4js');
// let logger = log4js.getLogger();
// const util2 = require('../util/util2');
// let _ = require('lodash');
// let _redisClient = null;
// let _redisMaster = null;
//
// let _isRedisConnected = false;
// let _isRedisInitialized = false;
//
//
// ///////////////////////////////////////////////////////////////////////////////////////////////////
// exports.init = function (redisSentinels, redisName, callback)
// {
//     redisInit(redisSentinels, redisName, function (err, result)
//     {
//         if (err)
//         {
//             logger.info('redisCache:init, err=' + err + ', result=' + result);
//             _isRedisInitialized = false;
//         }
//         else
//         {
//             logger.info('redisCache initialize success');
//             _isRedisInitialized = true;
//         }
//
//         callback(err, result);
//     });
// };
// ///////////////////////////////////////////////////////////////////////////////////////////////////
// exports.ttl = function (cachekey, callback)
// {
//     if (_isRedisInitialized)
//     {
//         _redisClient.ttl(cachekey, function (err, result)
//         {
//             callback(result);
//         });
//     }
//     else
//     {
//         myCache.getTtl(cachekey, function (err, result)
//         {
//             callback(result);
//         });
//     }
// };
//
// ///////////////////////////////////////////////////////////////////////////////////////////////////
// // GET
// //
// // REDIS에 저장되어 있는 데이타를 리턴한다.
// // JSON string인 경우에는 object로 변환해서 리턴한다.
// // 빈 데이타인 경우에도 err를 리턴한다.
// ///////////////////////////////////////////////////////////////////////////////////////////////////
// exports.get = function (cachekey, callback)
// {
//     if (_isRedisInitialized)
//     {
//         logger.debug('using redis cache');
//         redisGetVal(_redisClient, cachekey, function (err, result)
//         {
//             if (err)
//             {
//                 logger.debug('redisCache:get, err=' + err + ', result=' + result);
//                 callback(true, null);
//                 // 에러가 발생하면 에러 + 빈 데이타 리턴
//             }
//             else
//             {
//                 if (result)
//                 {
//                     logger.debug('redisCache:get, err=' + err + ', result=' + result);
//                     callback(null, result);
//                     // 데이타가 존재하면 성공으로 리턴
//                 }
//                 else
//                 {
//                     callback(true, result);
//                     // 데이타가 비어 있으면 실패로 리턴
//                 }
//             }
//         });
//     }
//     else
//     {
//         logger.debug('using node.js cache');
//         let result = myCache.get(cachekey);
//
//         let returnStructure;
//         try
//         {
//             returnStructure = JSON.parse(result);
//         }
//         catch (e)
//         {
//             logger.debug('exports.get try-catch for JSON.parse err=' + e);
//             returnStructure = result;
//         }
//
//         if (util2.isNullOrUndefinedOrEmpty(result))
//         {
//             callback('nothing', returnStructure);
//         }
//         else
//         {
//             callback(null, returnStructure);
//         }
//     }
// };
//
// ///////////////////////////////////////////////////////////////////////////////////////////////////
// // SET
// //
// // REDIS에 저장한다.
// // ttl은 초단위다
// ///////////////////////////////////////////////////////////////////////////////////////////////////
// exports.set = function (cachekey, value, ttl, callback)
// {
//     if (value)
//     {
//         if (_isRedisInitialized)
//         {
//             logger.debug('using redis cache');
//             redisSetVal(_redisMaster, cachekey, value, ttl, function (err, result)
//             {
//                 if (err)
//                 {
//                     logger.info('redisCache:set, err=' + err + ', result=' + result);
//                 }
//                 callback(err, result);
//             });
//         }
//         else
//         {
//             let saveData;
//             logger.debug('using node.js cache');
//             try
//             {
//                 saveData = JSON.stringify(value);
//             }
//             catch (e)
//             {
//                 saveData = result;
//             }
//
//             myCache.set(cachekey, saveData, ttl);
//             callback(null, value);
//         }
//
//     }
//     else //데이타가 null이면 저장하지 않고 그냥 성공 리턴
//     {
//         callback(null, null);
//     }
// };
//
// exports.setBulk = function (keyValueList, ttl, callback)
// {
//     if (!keyValueList[0] || !keyValueList[0].key || !keyValueList[0].value)
//     {
//         callback('List must have "key" and "value" properties.');
//     }
//     else
//     {
//         if (_isRedisInitialized)
//         {
//             redisSetBulk(_redisMaster, keyValueList, ttl, function (err, result)
//             {
//                 if (err)
//                 {
//                     logger.info('redisCache:setBulk, err=' + err + ', result=' + result);
//                 }
//                 callback(err, result);
//             });
//         }
//         else
//         {
//             callback('Cannot use setBulk without redis initialization');
//         }
//     }
// };
// ///////////////////////////////////////////////////////////////////////////////////////////////////
// exports.del = function (cachekey, callback)
// {
//     redisDelVal(_redisMaster, cachekey, function (err)
//     {
//         callback(err);
//     });
// };
//
//
// ///////////////////////////////////////////////////////////////////////////////////////////////////
// // REDIS functions
// ///////////////////////////////////////////////////////////////////////////////////////////////////
// function redisInit(sentinels, name, callback)
// {
//     _redisClient = new Redis({
//         sentinels: sentinels,
//         role: 'slave',
//         name: name
//     });
//
//     _redisMaster = new Redis({
//         sentinels: sentinels,
//         role: 'master',
//         name: name
//     });
//
//     _redisClient.ping(function (err, result)
//     {
//         if (err)
//         {
//             _isRedisConnected = !err;
//             callback(err, result);
//         }
//         else
//         {
//             _redisMaster.ping(function (err, result)
//             {
//                 _isRedisConnected = !err;
//                 callback(err, result);
//             });
//         }
//     });
// }
//
// ///////////////////////////////////////////////////////////////////////////////////////////////////
// // REDIS functions
// ///////////////////////////////////////////////////////////////////////////////////////////////////
// function redisSetVal(redisclient, key, value, ttl, callback)
// {
//     ///////////////////////////////////////////////////////////////////////////////////////////////
//     // Sanity check
//     ///////////////////////////////////////////////////////////////////////////////////////////////
//     if (!_isRedisConnected)
//     {
//         callback(false, 'Redis not connected', null);
//     }
//
//     let stringvalue;
//
//     try
//     {
//         stringvalue = JSON.stringify(value);
//         logger.debug('redisSetVal stringfy data=' + stringvalue);
//     }
//     catch (e)
//     {
//         logger.debug('redisSetVal stringfy try-catch error=' + e);
//         stringvalue = value;
//     }
//
//     logger.debug('redisSetVal stringvalue=' + stringvalue);
//     ///////////////////////////////////////////////////////////////////////////////////////////////
//     // Action
//     ///////////////////////////////////////////////////////////////////////////////////////////////
//     try
//     {
//         let TTL;
//         if (util2.isNullOrUndefined(ttl))
//         {
//             TTL = 60 * 5; //Default 5 minutes
//         }
//         else
//         {
//             TTL = ttl;
//         }
//
//         if (TTL === -1)
//         {
//             redisclient.set(key, stringvalue, function (err, result)
//             {
//                 callback(err, result);
//             });
//         }
//         else
//         {
//             redisclient.set(key, stringvalue, 'EX', TTL, function (err, result)
//             {
//                 callback(err, result);
//             });
//         }
//     }
//     catch (exception)
//     {
//         callback(exception);
//     }
// }
//
// function redisSetBulk(redisclient, keyValueList, ttl, callback)
// {
//     ///////////////////////////////////////////////////////////////////////////////////////////////
//     // Sanity check
//     ///////////////////////////////////////////////////////////////////////////////////////////////
//     if (!_isRedisConnected)
//     {
//         callback(false, 'Redis not connected', null);
//     }
//
//     ///////////////////////////////////////////////////////////////////////////////////////////////
//     // Action
//     ///////////////////////////////////////////////////////////////////////////////////////////////
//     try
//     {
//         let _keyValueLsit = _.clone(keyValueList);
//
//         let TTL;
//         if (util2.isNullOrUndefined(ttl))
//         {
//             TTL = 60 * 5; //Default 5 minutes
//         }
//         else
//         {
//             TTL = ttl;
//         }
//         async.until(
//             function test(callback) // 계속 진행해야 하는지 확인하는 펑션, callback(null,true)리턴하면 중단
//             {
//                 callback(null, _keyValueLsit.length === 0);
//             },
//             function iter(callback) // 실제 작업 펑션
//             {
//                 let _data = _keyValueLsit.pop();
//                 if (TTL === -1)
//                 {
//                     redisclient.set(_data.key, _data.value, function (err)
//                     {
//                         callback(err);
//                     });
//                 }
//                 else
//                 {
//                     redisclient.set(_data.key, _data.value, 'EX', TTL, function (err)
//                     {
//                         callback(err);
//                     });
//                 }
//             },
//             function done(err) // 완료 펑션
//             {
//                 callback(err);
//             });
//     }
//     catch (exception)
//     {
//         callback(exception);
//     }
// }
//
//
// function redisDelVal(redisclient, key, callback)
// {
//     ///////////////////////////////////////////////////////////////////////////////////////////////
//     // Sanity check
//     ///////////////////////////////////////////////////////////////////////////////////////////////
//     if (!_isRedisConnected)
//     {
//         callback(false, 'Redis not connected', null);
//     }
//
//     ///////////////////////////////////////////////////////////////////////////////////////////////
//     // Action
//     ///////////////////////////////////////////////////////////////////////////////////////////////
//     try
//     {
//         redisclient.del(key, function (err, result)
//         {
//             callback(err);
//         });
//     }
//     catch (exception)
//     {
//         callback(exception);
//     }
// }
//
// ///////////////////////////////////////////////////////////////////////////////////////////////////
// // REDIS functions
// ///////////////////////////////////////////////////////////////////////////////////////////////////
// function redisGetVal(redisclient, key, callback)
// {
//     ///////////////////////////////////////////////////////////////////////////////////////////////
//     // Sanity check
//     ///////////////////////////////////////////////////////////////////////////////////////////////
//     if (!_isRedisConnected)
//     {
//         callback('Redis not connected.', null);
//     }
//
//     ///////////////////////////////////////////////////////////////////////////////////////////////
//     // Action
//     ///////////////////////////////////////////////////////////////////////////////////////////////
//     try
//     {
//         redisclient.get(key, function (err, result)
//         {
//             if (err)
//             {
//                 callback(err, null);
//             }
//             else
//             {
//                 if (util2.isNullOrUndefined(result))
//                 {
//                     callback('Redis:No result for key=' + key, null);
//                 }
//                 else
//                 {
//
//                     let returnStructure;
//
//                     try
//                     {
//                         returnStructure = JSON.parse(result);
//                     }
//                     catch (e)
//                     {
//                         returnStructure = result;
//                     }
//                     callback(null, returnStructure);
//                 }
//             }
//         });
//     }
//     catch (exception)
//     {
//         callback(exception, null);
//     }
// }
//# sourceMappingURL=cache.js.map