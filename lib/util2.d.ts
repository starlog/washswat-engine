export declare const configData: {
    appenders: {
        out: {
            type: string;
            layout: {
                type: string;
            };
        };
        basic: {
            type: string;
            layout: {
                type: string;
            };
        };
    };
    categories: {
        default: {
            appenders: string[];
            level: string;
        };
    };
};
export declare function getLogger(name: string): any;
export declare function setLogLevel(logName: string, level: string): void;
export declare function debug(data: string): void;
export declare function info(data: string): void;
export declare function error(data: string): void;
export declare function stringify(object: any): any;
export declare function stringify2(object: any): any;
export declare function stringifyWithoutCircular(object: any): any;
export declare function genHashKey(prefix: string, object: object): string;
export declare function debugDump(object: any, arrayLimit: number, stringLimit: number, isPretty: boolean): any;
