export interface Token {
    common: {
        createdAt: string;
        status: string;
        message: string;
    };
    data: any;
}
export declare function getUidFromAuthentication(xWashswatToken: string): Promise<Token>;
export declare function getAuthenticationFromUid(uid: number): Promise<Token>;
