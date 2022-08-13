export interface HttpInterface {
    status: boolean;
    message: string;
    data: any;
}
export declare function call(queryObject: any): Promise<HttpInterface>;
export declare function callWithComStatus(queryObject: any, expectedResultCode: any): Promise<HttpInterface>;
