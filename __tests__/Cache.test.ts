// eslint-disable-next-line import/extensions,import/no-unresolved
import * as cache from '../src/cache';

// eslint-disable-next-line no-undef
test('Cache set', async () => {
  const data = await cache.set('key', { data: 'here' }, 200);
  // eslint-disable-next-line no-undef
  expect(data).toBe(true);
});

// eslint-disable-next-line no-undef
test('Cache get', async () => {
  const data = await cache.get('key');
  // eslint-disable-next-line no-undef
  expect(data).toStrictEqual({ data: 'here' });
});
