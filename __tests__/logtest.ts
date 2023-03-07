import * as util2 from '../src/util2';
import * as log2 from '../src/logger';

function test1() {
  const logger = util2.getLogger('myLog');
  for(const element of log2.logList){
    if(element.name === 'myLog'){
      return true;
    }
  }
  return false;
}

describe('log test module', () => {
    test('log test 1', () => {
      expect(test1()).toBe(true);
    });
  });
