import * as rest from '../src/config';
import * as config from "../src/config";

async function test1() {
  try{
    await config.configure('test', 'test', null, 'error');
    return true;

  }catch(ex){
    return false;
  }
}

describe('config test module', () => {
  test('config test 1', async () => {
    expect(await test1()).toBe(true);
  });
});
