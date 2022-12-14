import log4js from 'log4js';
export declare function getLogger(name: string): log4js.Logger;
export declare function setLogLevel(logName: string, level: string): void;
export declare function debug(data: string): void;
export declare function info(data: string): void;
export declare function error(data: string): void;
export declare function stringify(object: any): any;
export declare function stringify2(object: any): any;
export declare function stringifyWithoutCircular(object: any): any;
export declare function genHashKey(prefix: string, object: object): string;
export declare function debugDump(object: any, arrayLimit: number, stringLimit: number, isPretty: boolean): any;
