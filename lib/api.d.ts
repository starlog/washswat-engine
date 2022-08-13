export interface Token {
    common: {
        createdAt: string;
        status: string;
        message: string;
    };
    data: object;
}
export declare function getUidFromAuthentication(xWashswatToken: string): Promise<Token>;
export declare function getAuthenticationFromUid(uid: number): Promise<Token>;
