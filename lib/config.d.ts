export interface ConfigInfo {
    status: boolean;
    message: string;
    data: any;
}
export declare function configure(domain: string, app: string, packageJson: any, logLevel: string): Promise<ConfigInfo>;
export declare function getAppConfig(): any;
export declare function getGlobalGatewayUrl(): string;
export declare function getPlatformConfig(): any;
export declare function readPlatformConfig(): Promise<ConfigInfo>;
export declare function setHeader(response: any): void;
