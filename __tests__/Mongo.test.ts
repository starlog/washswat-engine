import * as mongoClient from '../src/mongodb'
import * as util2 from '../src/util2'
const mongoTest = [
    {
        name: 'local',
        url: 'mongodb://localhost:27017',
        useCache: true,
        cacheTTL: 100
    }
]

const queryObject = {
    name: 'local',
    db: 'local',
    collection: 'test_result',
    query: {},
    sort: {},
    fields: {_id: 0},
    skip: 0,
    limit: 10
}
// This test requires local mongodb server (docker)
test('Mongo call', async () => {
    const result = await mongoClient.init(mongoTest);
    expect(result).toBe(true);
    const data = await mongoClient.find(queryObject);
    util2.debug(util2.debugDump(data, 2, 200, false));
    expect(data).toBeDefined();
})
