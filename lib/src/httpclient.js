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
exports.call = exports.call2 = void 0;
var axios = __importStar(require("axios"));
var log4js = __importStar(require("log4js"));
var Qs = __importStar(require("qs"));
var http = __importStar(require("http"));
var https = __importStar(require("https"));
var util2 = __importStar(require("./util2"));
// eslint-disable-next-line import/extensions,import/no-unresolved
// import * as util2 from './util2';
var logger = log4js.getLogger();
logger.level = 'DEBUG';
var REDIS_KEY_PREFIX = 'washswat-tool-http';
var axiosClient = axios.default.create({
    httpAgent: new http.Agent({ keepAlive: true }),
    httpsAgent: new https.Agent({ keepAlive: true }),
});
function callOne(qo) {
    return __awaiter(this, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, axiosClient({
                        method: qo.method,
                        url: qo.url,
                        params: qo.params ? qo.params : {},
                        paramsSerializer: function (params) { return Qs.stringify(params, { arrayFormat: 'brackets' }); },
                        timeout: qo.timeout ? qo.timeout : 300,
                        data: qo.body ? qo.body : {},
                        headers: qo.headers ? qo.headers : {},
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
                    if (!(i < qo.retryConfig.times)) return [3 /*break*/, 6];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, callOne(qo)];
                case 3:
                    // eslint-disable-next-line no-await-in-loop
                    result = _a.sent();
                    return [3 /*break*/, 6];
                case 4:
                    ex_1 = _a.sent();
                    logger.debug('got error');
                    return [3 /*break*/, 5];
                case 5:
                    i++;
                    return [3 /*break*/, 1];
                case 6: return [2 /*return*/, result];
            }
        });
    });
}
exports.call2 = call2;
function call(qo) {
    return __awaiter(this, void 0, void 0, function () {
        var result, REDIS_KEY, myData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    REDIS_KEY = util2.genHashKey(REDIS_KEY_PREFIX, qo);
                    if (!!result) return [3 /*break*/, 2];
                    return [4 /*yield*/, call2(qo)];
                case 1:
                    myData = _a.sent();
                    // if (qo.useCache) {
                    //   await cache.set(REDIS_KEY, myData, qo.cacheTtl);
                    // }
                    result = myData;
                    _a.label = 2;
                case 2: return [2 /*return*/, result];
            }
        });
    });
}
exports.call = call;
//# sourceMappingURL=httpclient.js.map