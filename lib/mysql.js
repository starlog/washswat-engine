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
exports.query = exports.init = void 0;
var mysql = __importStar(require("mysql2/promise"));
var _ = __importStar(require("lodash"));
var util2 = __importStar(require("./util2"));
var cache = __importStar(require("./cache"));
var logger = util2.getLogger('washswat-engine:mysql');
var REDIS_KEY_PREFIX = 'washswat-tool-mysql';
var pool;
var localConnectionConfig;
function init(connectionConfig) {
    return __awaiter(this, void 0, void 0, function () {
        var returnVal;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    returnVal = { status: false, message: 'not initialized', data: {} };
                    localConnectionConfig = _.cloneDeep(connectionConfig);
                    return [4 /*yield*/, mysql.createPool({
                            connectionLimit: 2,
                            host: connectionConfig.host,
                            user: connectionConfig.user,
                            password: connectionConfig.password,
                            database: connectionConfig.database,
                        })];
                case 1:
                    pool = _a.sent();
                    if (Object.keys(pool).length > 0) {
                        returnVal = { status: true, message: 'success', data: {} };
                    }
                    return [2 /*return*/, returnVal];
            }
        });
    });
}
exports.init = init;
function query(queryString) {
    return __awaiter(this, void 0, void 0, function () {
        var returnVal, REDIS_KEY, myData, _a, myRows, myFields, myDataOut;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    REDIS_KEY = util2.genHashKey(REDIS_KEY_PREFIX, {
                        mode: 'query',
                        queryString: queryString,
                    });
                    console.log("localConnectionConfig.useCache=".concat(localConnectionConfig.useCache));
                    if (!localConnectionConfig.useCache) return [3 /*break*/, 2];
                    return [4 /*yield*/, cache.get(REDIS_KEY)];
                case 1:
                    myData = _b.sent();
                    logger.debug("USING CACHE: data is ".concat(util2.stringifyWithoutCircular(myData)));
                    if (myData) {
                        return [2 /*return*/, { status: true, message: 'success', data: myData }];
                    }
                    _b.label = 2;
                case 2:
                    if (!!myData) return [3 /*break*/, 6];
                    logger.debug('USING QUERY');
                    return [4 /*yield*/, pool.query(queryString)];
                case 3:
                    _a = _b.sent(), myRows = _a[0], myFields = _a[1];
                    myDataOut = { rows: myRows, fields: myFields };
                    if (!localConnectionConfig.useCache) return [3 /*break*/, 5];
                    return [4 /*yield*/, cache.set(REDIS_KEY, myDataOut, localConnectionConfig.cacheTTL)];
                case 4:
                    _b.sent();
                    _b.label = 5;
                case 5:
                    returnVal = { status: true, message: 'success', data: myDataOut };
                    _b.label = 6;
                case 6: return [2 /*return*/, returnVal];
            }
        });
    });
}
exports.query = query;
//# sourceMappingURL=mysql.js.map