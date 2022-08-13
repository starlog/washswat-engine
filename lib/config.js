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
exports.setHeader = exports.readPlatformConfig = exports.getPlatformConfig = exports.getGlobalGatewayUrl = exports.getAppConfig = exports.configure = void 0;
var log4js = __importStar(require("log4js"));
// eslint-disable-next-line import/extensions,import/no-unresolved
var httpClient = __importStar(require("./httpclient"));
// eslint-disable-next-line import/extensions,import/no-unresolved
var mongoClient = __importStar(require("./mongodb"));
// eslint-disable-next-line import/extensions,import/no-unresolved
var util2 = __importStar(require("./util2"));
var logger = log4js.getLogger();
logger.level = 'DEBUG';
var configQuery = {
    body: {},
    headers: {},
    method: 'get',
    url: 'https://config.internal.washswat.com/v1/config/domain/$1/service/$2',
    params: {},
    timeout: 3000,
    useCache: true,
    cacheTtl: 100,
    retryConfig: {
        times: 3,
        interval: 10,
    },
};
var mongoConnections = [
    {
        name: 'config',
        url: 'mongodb://'
            + 'washswat:!Washswat101@washswat.mongo.internal:27017'
            + '?replicaSet=rs0&readPreference=secondaryPreferred',
        useCache: true,
        cacheTTL: 60,
    },
];
var queryObject = {
    name: 'config',
    db: 'configuration',
    collection: 'platform',
    query: {},
    fields: {},
    sort: { version: -1 },
    skip: 0,
    limit: 1,
};
var localConfig;
var localPlatformConfig;
var localAppConfig;
// eslint-disable-next-line max-len
function configure(domain, app, packageJson, logLevel) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    util2.setLogLevel(logLevel);
                    logger.level = logLevel;
                    localAppConfig = packageJson;
                    configQuery.url = configQuery.url.replace('$1', domain).replace('$2', app);
                    return [4 /*yield*/, httpClient.call(configQuery)];
                case 1:
                    result = _a.sent();
                    localConfig = result.data;
                    logger.debug("_config:".concat(JSON.stringify(localConfig)));
                    return [4 /*yield*/, mongoClient.init(mongoConnections)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, mongoClient.find(queryObject)];
                case 3:
                    localPlatformConfig = _a.sent();
                    logger.debug("_platformConfig:".concat(JSON.stringify(localPlatformConfig)));
                    return [2 /*return*/, { status: true, message: 'sucess', data: {} }];
            }
        });
    });
}
exports.configure = configure;
function getAppConfig() {
    return localAppConfig;
}
exports.getAppConfig = getAppConfig;
function getGlobalGatewayUrl() {
    return localConfig.common.apigateway.url;
}
exports.getGlobalGatewayUrl = getGlobalGatewayUrl;
function getPlatformConfig() {
    return localPlatformConfig[0];
}
exports.getPlatformConfig = getPlatformConfig;
function readPlatformConfig() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, mongoClient.find(queryObject)];
                case 1:
                    localPlatformConfig = _a.sent();
                    logger.debug("configure:_platformConfig:".concat(JSON.stringify(localPlatformConfig)));
                    return [2 /*return*/, { status: true, message: 'success', data: localPlatformConfig[0] }];
            }
        });
    });
}
exports.readPlatformConfig = readPlatformConfig;
function setHeader(response) {
    try {
        response.setHeader('x-washswat-environment', localConfig.common.environment);
        response.setHeader('x-washswat-version', "".concat(localAppConfig.name, ":").concat(localAppConfig.version));
    }
    catch (ex) {
        response.setHeader('x-washswat-environment', 'genesis');
        response.setHeader('x-washswat-version', 'generic:0.0.0');
    }
    response.setHeader('Access-Control-Allow-Origin', '*'); // CORS Allow all
}
exports.setHeader = setHeader;
//# sourceMappingURL=config.js.map