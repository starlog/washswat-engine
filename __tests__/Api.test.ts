import * as api from '../src/api'
import * as util2 from '../src/util2'
import * as config from '../src/config'
import packageJSON from "../package.json";

test('Api call', async () => {
    const result = await config.configure('tets-domain','test-app',packageJSON, 'debug');
    const data = await api.getAuthenticationFromUid(1234);
    util2.debug(util2.stringifyWithoutCircular(data));
    expect(data).toBeDefined();
})
