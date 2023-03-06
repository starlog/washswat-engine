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
var http = __importStar(require("./httpclient"));
var mongo = __importStar(require("./mongodb"));
var util2 = __importStar(require("./util2"));
var api = __importStar(require("./api"));
var config = __importStar(require("./config"));
var mysql = __importStar(require("./mysql"));
var cache = __importStar(require("./cache"));
var logger = util2.getLogger('washswat-engine');
// util2.setLogLevel('all', 'debug');
var mongoTest = [
    {
        name: 'local',
        url: 'mongodb://localhost:27017',
        useCache: true,
        cacheTTL: 100,
    },
];
var mongoQueryObject = {
    name: 'local',
    db: 'local',
    collection: 'test_result',
    query: {},
    sort: {},
    fields: { _id: 0 },
    skip: 0,
    limit: 10,
};
// eslint-disable-next-line no-unused-vars
function doHttpTest() {
    return __awaiter(this, void 0, void 0, function () {
        var result1, ex_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, http.call(queryObject)];
                case 1:
                    result1 = _a.sent();
                    logger.debug(result1.data);
                    return [3 /*break*/, 3];
                case 2:
                    ex_1 = _a.sent();
                    logger.error(ex_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// eslint-disable-next-line no-unused-vars
function doMongoTest() {
    return __awaiter(this, void 0, void 0, function () {
        var data, data2, ex_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, mongo.init(mongoTest)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, mongo.find(mongoQueryObject)];
                case 2:
                    data = _a.sent();
                    util2.debug(util2.debugDump(data, 2, 200, false));
                    return [4 /*yield*/, mongo.find(mongoQueryObject)];
                case 3:
                    data2 = _a.sent();
                    util2.debug(util2.debugDump(data2, 2, 200, false));
                    return [3 /*break*/, 5];
                case 4:
                    ex_2 = _a.sent();
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// eslint-disable-next-line no-unused-vars
function doApiTest() {
    return __awaiter(this, void 0, void 0, function () {
        var result, result2, result3, result4, result5, ex_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 7, , 8]);
                    return [4 /*yield*/, config.configure('test', 'test', null, 'error')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, api.getUidFromAuthentication('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQ'
                            + 'iOjU2Njk3NywiaWF0IjoxNjYwMzc1NTY1LCJleHAiOjE2NjA0NjE5NjV9.ODroclQvYUp9G46SG4O6wHlNlGfXMWMBLS-j2-NCOc8')];
                case 2:
                    result = _a.sent();
                    logger.debug(JSON.stringify(result, null, 2));
                    return [4 /*yield*/, api.getAuthenticationFromUid(2345)];
                case 3:
                    result2 = _a.sent();
                    logger.debug(JSON.stringify(result2, null, 2));
                    return [4 /*yield*/, api.getUidFromAuthentication('xcvcvcxvv')];
                case 4:
                    result3 = _a.sent();
                    logger.debug(JSON.stringify(result3, null, 2));
                    return [4 /*yield*/, api.getAuthenticationFromUid(2345)];
                case 5:
                    result4 = _a.sent();
                    logger.debug(JSON.stringify(result4, null, 2));
                    return [4 /*yield*/, api.getUidFromAuthentication('xcvcvcxvv')];
                case 6:
                    result5 = _a.sent();
                    logger.debug(JSON.stringify(result5, null, 2));
                    return [3 /*break*/, 8];
                case 7:
                    ex_3 = _a.sent();
                    // intentional
                    logger.error("doApiTest try-catch error: ".concat(ex_3));
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
var mySQLInit = {
    cacheTtl: 0,
    useCache: false,
    database: 'washswat',
    host: 'localhost',
    password: 'madmax2',
    user: 'root',
};
// eslint-disable-next-line no-unused-vars
function doMysqlTest() {
    return __awaiter(this, void 0, void 0, function () {
        var result, ex_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, mysql.init(mySQLInit)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, mysql.query('select * from test2')];
                case 2:
                    result = _a.sent();
                    logger.debug(JSON.stringify(result.data.rows, null, 2));
                    return [3 /*break*/, 4];
                case 3:
                    ex_4 = _a.sent();
                    logger.error("doMysqlTest error:".concat(ex_4));
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// eslint-disable-next-line no-unused-vars
function cacheTest() {
    return __awaiter(this, void 0, void 0, function () {
        var data, outData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    data = { data: 'hello' };
                    return [4 /*yield*/, cache.set('test', data, 2000)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, cache.get('test')];
                case 2:
                    outData = _a.sent();
                    console.log(outData);
                    return [2 /*return*/];
            }
        });
    });
}
var queryObject = {
    auth: {},
    body: {},
    method: 'get',
    url: 'https://apis.washswat.com/configuration/v1/admin/ui/editor',
    params: {
        screen: 'SCREEN001',
    },
    timeout: 3000,
    useCache: true,
    cacheTtl: 100,
    retryConfig: {
        times: 3,
        interval: 10,
    },
    headers: {
        'x-washswat-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjU2Njk3NywiZWRpdG9yQXV0aCI6dHJ1ZSwiaWF0IjoxNjU5OTY0MTk2LCJleHAiOjE2NjAwNTA1OTZ9.1E_czAo70_8fKxd3MP3NIzdqX_DMR2hUtwVsz3SHyWo',
    }
};
var queryObject2 = {
    auth: undefined,
    params: undefined,
    body: undefined,
    method: 'get',
    url: 'https://v2.washswat.com/order/time/pickup',
    timeout: 300,
    useCache: true,
    cacheTtl: 100,
    retryConfig: {
        times: 3,
        interval: 10,
    },
    headers: {
        'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjU0MzQ3OSwiaWF0IjoxNjYxMjM4NzI5LCJleHAiOjE2NjEzMjUxMjl9.7o9IdOQWldvmVEHLCL7237FjCPsd-OI_-xl04JXS91I',
    }
};
var queryObject3 = {
    auth: undefined,
    params: undefined,
    body: undefined,
    method: 'get',
    url: 'https://apis.washswat.com/ab-test/v1/dynamic/TDG-004',
    timeout: 3000,
    useCache: true,
    cacheTtl: 100,
    retryConfig: {
        times: 3,
        interval: 10,
    },
    headers: {
        'x-washswat-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXIiOiIxLjAiLCJzeXN0ZW1UeXBlIjoiVSIsInVpZCI6NTQzNDc5LCJwaG9uZSI6IjAxMDkyNTY0ODI1IiwibmFtZSI6Iu2VhOumreyKpCIsImlhdCI6MTY3MzQ0NDY0NCwiZXhwIjoxNzA0OTgwNjQ0fQ.OkLPByXsnJj1A3oI54GdXzEeFTcgngekbUwaXsP9BQg'
    }
};
function restTest() {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, http.call(queryObject)];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function doTest() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, doMongoTest()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, http.call(queryObject)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
doTest().then(function () {
    process.exit(0);
});
//# sourceMappingURL=callTest.js.map