export interface HttpInterface {
    status: boolean;
    message: string;
    data: any;
}
export interface RestQueryRetryConfig {
    times: number;
    interval: number;
}
export interface RestQueryInterface {
    method: string;
    url: string;
    params: any;
    timeout: number;
    useCache: boolean;
    cacheTtl: number;
    retryConfig: RestQueryRetryConfig;
    headers: any;
    body: any;
    auth: any;
}
export declare function call(qo: RestQueryInterface): Promise<any>;
