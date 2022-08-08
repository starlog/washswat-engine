import * as config from '../src/config'
import packageJSON from "../package.json";

test('Config call', async () => {
    const data = await config.configure('test-domain','test-app',packageJSON, 'debug');
    expect(data).toBeDefined();
})
