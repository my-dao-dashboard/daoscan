import { CacheMap } from "./cache-map";

test("cache", done => {
  const ttl = 100;
  const cache = new CacheMap<string, number>(ttl);
  const key = "one";
  const value = 1;
  cache.set(key, value);
  expect(cache.get(key)).toEqual(value);
  setTimeout(() => {
    expect(cache.get(key)).toBeUndefined();
    done();
  }, ttl * 2);
});
