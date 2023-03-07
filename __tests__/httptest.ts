import * as util2 from '../src/util2';
import * as rest from '../src/httpclient';
import {RestQueryInterface} from "../lib/httpclient";

async function test1() {
  try{
    const queryObject: RestQueryInterface = {
      auth: {  },
      body: {},
      method: 'get',
      url: 'https://apis.washswat.com/configuration/v1/admin/ui/editor',
      params: {
        screen: 'SCREEN001',
      },
      timeout: 3000,
      useCache: true,
      cacheTtl: 100,
      retryConfig: {
        times: 3,
        interval: 10,
      },
      headers: {
        'x-washswat-token':
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjU2Njk3NywiZWRpdG9yQXV0aCI6dHJ1ZSwiaWF0IjoxNjU5OTY0MTk2LCJleHAiOjE2NjAwNTA1OTZ9.1E_czAo70_8fKxd3MP3NIzdqX_DMR2hUtwVsz3SHyWo',
      }
    };
    const result = await rest.call(queryObject);
    return true;

  }catch(ex){
    return false;
  }
}

describe('rest test module', () => {
  test('rest test 1', async () => {
    expect(await test1()).toBe(true);
  });
});
