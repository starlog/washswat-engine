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
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertMany = exports.insertOne = exports.updateOne = exports.deleteMany = exports.deleteOne = exports.findOne = exports.find = exports.count = exports.init = void 0;
var log4js = __importStar(require("log4js"));
var util2 = __importStar(require("./util2"));
var cache = __importStar(require("./cache"));
var mongodb_1 = require("mongodb");
var logger = log4js.getLogger();
logger.level = 'DEBUG';
var REDIS_KEY_PREFIX = 'washswat-tool-mongodb';
var mongodbClients = [];
function init(configuration) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                    var _i, configuration_1, config;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _i = 0, configuration_1 = configuration;
                                _a.label = 1;
                            case 1:
                                if (!(_i < configuration_1.length)) return [3 /*break*/, 4];
                                config = configuration_1[_i];
                                return [4 /*yield*/, initMongo(config)];
                            case 2:
                                _a.sent();
                                _a.label = 3;
                            case 3:
                                _i++;
                                return [3 /*break*/, 1];
                            case 4:
                                resolve(true);
                                return [2 /*return*/];
                        }
                    });
                }); })];
        });
    });
}
exports.init = init;
function initMongo(config) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                    var _client, ex_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 3, , 4]);
                                _client = new mongodb_1.MongoClient(config.url);
                                return [4 /*yield*/, _client.connect()];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, _client.db('admin').command({ ping: 1 })];
                            case 2:
                                _a.sent();
                                mongodbClients.push({
                                    name: config.name,
                                    client: _client,
                                    useCache: config.useCache,
                                    cacheTTL: config.cacheTTL,
                                });
                                resolve(true);
                                return [3 /*break*/, 4];
                            case 3:
                                ex_1 = _a.sent();
                                reject('mongodb:initMongo ' + ex_1);
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); })];
        });
    });
}
function getMongoClient(name) {
    var _retObject;
    for (var _i = 0, mongodbClients_1 = mongodbClients; _i < mongodbClients_1.length; _i++) {
        var item = mongodbClients_1[_i];
        if (item.name === name) {
            _retObject = item;
            break;
        }
    }
    return _retObject;
}
function count(name, db, collection, query) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                    var mongoObject, data;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                mongoObject = getMongoClient(name);
                                if (!((mongoObject === null || mongoObject === void 0 ? void 0 : mongoObject.name) === undefined)) return [3 /*break*/, 1];
                                reject('No mongoClient found for name:' + name);
                                return [3 /*break*/, 3];
                            case 1: return [4 /*yield*/, mongoObject.client.db(db).collection(collection).find(query).count()];
                            case 2:
                                data = _a.sent();
                                resolve(data);
                                _a.label = 3;
                            case 3: return [2 /*return*/];
                        }
                    });
                }); })];
        });
    });
}
exports.count = count;
function find(queryObject) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                    var result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, _find(queryObject.name, queryObject.db, queryObject.collection, queryObject.query, queryObject.sort, queryObject.fields, queryObject.skip, queryObject.limit)];
                            case 1:
                                result = _a.sent();
                                resolve(result);
                                return [2 /*return*/];
                        }
                    });
                }); })];
        });
    });
}
exports.find = find;
function findOne(queryObject) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                    var result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, _findOne(queryObject.name, queryObject.db, queryObject.collection, queryObject.query, queryObject.fields)];
                            case 1:
                                result = _a.sent();
                                resolve(result);
                                return [2 /*return*/];
                        }
                    });
                }); })];
        });
    });
}
exports.findOne = findOne;
function deleteOne(queryObject) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                    var result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, _deleteOne(queryObject.name, queryObject.db, queryObject.collection, queryObject.query)];
                            case 1:
                                result = _a.sent();
                                resolve(result);
                                return [2 /*return*/];
                        }
                    });
                }); })];
        });
    });
}
exports.deleteOne = deleteOne;
function deleteMany(queryObject) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                    var result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, _deleteMany(queryObject.name, queryObject.db, queryObject.collection, queryObject.query)];
                            case 1:
                                result = _a.sent();
                                resolve(result);
                                return [2 /*return*/];
                        }
                    });
                }); })];
        });
    });
}
exports.deleteMany = deleteMany;
function updateOne(queryObject) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                    var result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, _updateOne(queryObject.name, queryObject.db, queryObject.collection, queryObject.query, queryObject.newValue, queryObject.upsert)];
                            case 1:
                                result = _a.sent();
                                resolve(result);
                                return [2 /*return*/];
                        }
                    });
                }); })];
        });
    });
}
exports.updateOne = updateOne;
function insertOne(queryObject) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                    var result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, _insertOne(queryObject.name, queryObject.db, queryObject.collection, queryObject.newValue)];
                            case 1:
                                result = _a.sent();
                                resolve(result);
                                return [2 /*return*/];
                        }
                    });
                }); })];
        });
    });
}
exports.insertOne = insertOne;
function insertMany(queryObject) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                    var result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, _insertMany(queryObject.name, queryObject.db, queryObject.collection, queryObject.newValue)];
                            case 1:
                                result = _a.sent();
                                resolve(result);
                                return [2 /*return*/];
                        }
                    });
                }); })];
        });
    });
}
exports.insertMany = insertMany;
function _find(name, db, collection, query, sort, fields, skip, limit) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                    var mongoObject, REDIS_KEY, data, result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                mongoObject = getMongoClient(name);
                                if (!((mongoObject === null || mongoObject === void 0 ? void 0 : mongoObject.name) === undefined)) return [3 /*break*/, 1];
                                reject('No mongoClient found for name:' + name);
                                return [3 /*break*/, 7];
                            case 1:
                                REDIS_KEY = util2.genHashKey(REDIS_KEY_PREFIX, {
                                    mode: 'find',
                                    name: name,
                                    db: db,
                                    collection: collection,
                                    query: query,
                                    sort: sort,
                                    fields: fields,
                                    skip: skip,
                                    limit: limit,
                                });
                                data = void 0;
                                if (!mongoObject.useCache) return [3 /*break*/, 3];
                                return [4 /*yield*/, cache.get(REDIS_KEY)];
                            case 2:
                                data = _a.sent();
                                logger.debug('USING CACHE: data is ' + util2.stringifyWithoutCircular(data));
                                if (data)
                                    resolve(data);
                                _a.label = 3;
                            case 3:
                                if (!!data) return [3 /*break*/, 7];
                                logger.debug('USING QUERY');
                                return [4 /*yield*/, mongoObject.client
                                        .db(db)
                                        .collection(collection)
                                        .find(query)
                                        .sort(sort)
                                        .project(fields)
                                        .skip(skip)
                                        .limit(limit)
                                        .toArray()];
                            case 4:
                                result = _a.sent();
                                if (!mongoObject.useCache) return [3 /*break*/, 6];
                                return [4 /*yield*/, cache.set(REDIS_KEY, result, mongoObject.cacheTTL)];
                            case 5:
                                _a.sent();
                                _a.label = 6;
                            case 6:
                                resolve(result);
                                _a.label = 7;
                            case 7: return [2 /*return*/];
                        }
                    });
                }); })];
        });
    });
}
function _findOne(name, db, collection, query, fields) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                    var mongoObject, REDIS_KEY, data, result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                mongoObject = getMongoClient(name);
                                if (!((mongoObject === null || mongoObject === void 0 ? void 0 : mongoObject.name) === undefined)) return [3 /*break*/, 1];
                                reject('No mongoClient found for name:' + name);
                                return [3 /*break*/, 7];
                            case 1:
                                REDIS_KEY = util2.genHashKey(REDIS_KEY_PREFIX, {
                                    mode: 'findOne',
                                    name: name,
                                    db: db,
                                    collection: collection,
                                    query: query,
                                    fields: fields,
                                });
                                data = void 0;
                                if (!mongoObject.useCache) return [3 /*break*/, 3];
                                return [4 /*yield*/, cache.get(REDIS_KEY)];
                            case 2:
                                data = _a.sent();
                                logger.debug('USING CACHE: data is ' + util2.stringifyWithoutCircular(data));
                                if (data)
                                    resolve(data);
                                _a.label = 3;
                            case 3:
                                if (!!data) return [3 /*break*/, 7];
                                logger.debug('USING QUERY');
                                return [4 /*yield*/, mongoObject.client.db(db).collection(collection).findOne(query, { projection: fields })];
                            case 4:
                                result = _a.sent();
                                if (!mongoObject.useCache) return [3 /*break*/, 6];
                                return [4 /*yield*/, cache.set(REDIS_KEY, result, mongoObject.cacheTTL)];
                            case 5:
                                _a.sent();
                                _a.label = 6;
                            case 6:
                                resolve(result);
                                _a.label = 7;
                            case 7: return [2 /*return*/];
                        }
                    });
                }); })];
        });
    });
}
function _deleteOne(name, db, collection, query) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                    var mongoObject, data;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                mongoObject = getMongoClient(name);
                                if (!((mongoObject === null || mongoObject === void 0 ? void 0 : mongoObject.name) === undefined)) return [3 /*break*/, 1];
                                reject('No mongoClient found for name:' + name);
                                return [3 /*break*/, 3];
                            case 1: return [4 /*yield*/, mongoObject.client.db(db).collection(collection).deleteOne(query)];
                            case 2:
                                data = _a.sent();
                                resolve(data);
                                _a.label = 3;
                            case 3: return [2 /*return*/];
                        }
                    });
                }); })];
        });
    });
}
function _deleteMany(name, db, collection, query) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                    var mongoObject, data;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                mongoObject = getMongoClient(name);
                                if (!((mongoObject === null || mongoObject === void 0 ? void 0 : mongoObject.name) === undefined)) return [3 /*break*/, 1];
                                reject('No mongoClient found for name:' + name);
                                return [3 /*break*/, 3];
                            case 1: return [4 /*yield*/, mongoObject.client.db(db).collection(collection).deleteMany(query)];
                            case 2:
                                data = _a.sent();
                                resolve(data);
                                _a.label = 3;
                            case 3: return [2 /*return*/];
                        }
                    });
                }); })];
        });
    });
}
function _updateOne(name, db, collection, query, newValue, upsert) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                    var mongoObject, data;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                mongoObject = getMongoClient(name);
                                if (!((mongoObject === null || mongoObject === void 0 ? void 0 : mongoObject.name) === undefined)) return [3 /*break*/, 1];
                                reject('No mongoClient found for name:' + name);
                                return [3 /*break*/, 3];
                            case 1: return [4 /*yield*/, mongoObject.client.db(db).collection(collection).updateOne(query, newValue, { upsert: upsert })];
                            case 2:
                                data = _a.sent();
                                resolve(data);
                                _a.label = 3;
                            case 3: return [2 /*return*/];
                        }
                    });
                }); })];
        });
    });
}
function _insertOne(name, db, collection, newValue) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                    var mongoObject, data;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                mongoObject = getMongoClient(name);
                                if (!((mongoObject === null || mongoObject === void 0 ? void 0 : mongoObject.name) === undefined)) return [3 /*break*/, 1];
                                reject('No mongoClient found for name:' + name);
                                return [3 /*break*/, 3];
                            case 1: return [4 /*yield*/, mongoObject.client.db(db).collection(collection).insertOne(newValue)];
                            case 2:
                                data = _a.sent();
                                resolve(data);
                                _a.label = 3;
                            case 3: return [2 /*return*/];
                        }
                    });
                }); })];
        });
    });
}
function _insertMany(name, db, collection, newValue) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                    var mongoObject, data;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                mongoObject = getMongoClient(name);
                                if (!((mongoObject === null || mongoObject === void 0 ? void 0 : mongoObject.name) === undefined)) return [3 /*break*/, 1];
                                reject('No mongoClient found for name:' + name);
                                return [3 /*break*/, 3];
                            case 1: return [4 /*yield*/, mongoObject.client.db(db).collection(collection).insertMany(newValue)];
                            case 2:
                                data = _a.sent();
                                resolve(data);
                                _a.label = 3;
                            case 3: return [2 /*return*/];
                        }
                    });
                }); })];
        });
    });
}
//# sourceMappingURL=mongodb.js.map