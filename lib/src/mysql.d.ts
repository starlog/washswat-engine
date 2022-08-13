export interface MysqlInterface {
    status: boolean;
    message: string;
    data: any;
}
export interface MysqlConnectionInterface {
    host: string;
    user: string;
    password: string;
    database: string;
    useCache: boolean;
    cacheTtl: number;
}
export declare function init(connectionConfig: MysqlConnectionInterface): Promise<MysqlInterface>;
export declare function query(queryString: string): Promise<MysqlInterface>;
