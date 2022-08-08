import * as cache from "../src/cache";

test('Cache set', async () => {
    const data = await cache.set('key', {data:'here'}, 200);
    expect(data).toBe(true);
})

test('Cache get', async () => {
    const data = await cache.get('key');
    expect(data).toStrictEqual({data:'here'});
})
