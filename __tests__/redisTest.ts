import * as cache from '../src/cache';
import * as config from "../src/config";

const redisConfig = {
  host: 'redis-common.redis.svc.cluster.local',
  port: 6379,
  prefix: 'common-',
};

function sleep(seconds:number) {
  const milliseconds = seconds * 1000;
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

async function redisTest() {
  try{
    // node-cache test first
    await cache.set('test', {a:1}, 1);
    const result1 = await cache.get('test');
    // redis test
    await cache.initRedis(redisConfig);
    await cache.set('test', {a:1}, 1);
    const result2 = await cache.get('test');
    // TTL expiration in seconds
    await sleep(2);
    const result3 = await cache.get('test');
    const result4 = await cache.get('test');
    // Check result
    return JSON.stringify(result1) === JSON.stringify(result2) && result3 === null && result4 === null;
  }catch(ex){
    return false;
  }
}
describe('redis test module', () => {
  test('redis init', async () => {
    expect(await redisTest()).toBe(true);
  });
});
