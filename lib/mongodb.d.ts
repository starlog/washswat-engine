import { ObjectId } from 'mongodb';
export interface MongoInterface {
    status: boolean;
    message: string;
    data: any;
}
export declare function init(configuration: any): Promise<MongoInterface>;
export declare function count(name: string, db: string, collection: string, query: any): Promise<MongoInterface>;
export declare function getObjectId(objectId: string): ObjectId;
export declare function findOne(queryObject: any): Promise<MongoInterface>;
export declare function deleteOne(queryObject: any): Promise<MongoInterface>;
export declare function deleteMany(queryObject: any): Promise<MongoInterface>;
export declare function updateOne(queryObject: any): Promise<MongoInterface>;
export declare function insertOne(queryObject: any): Promise<MongoInterface>;
export declare function insertMany(queryObject: any): Promise<MongoInterface>;
export declare function find(queryObject: any): Promise<MongoInterface>;
