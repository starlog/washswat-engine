import * as mysqlClient from '../src/mysql'
import * as util2 from '../src/util2'


const mysqlConfig = {
    host: 'localhost',
    user: 'root',
    password: 'madmax2',
    database: 'washswat',
    useCache: true,
    cacheTTL: 100
}


// This test requires local mongodb server (docker)
test('Mysql call', async () => {
    const result = await mysqlClient.init(mysqlConfig);
    expect(result).toBe(true);
    const data = await mysqlClient.query('select count(*) from washswat.test');
    util2.debug('Result is ' + data);
    expect(data).toBeDefined();
})
