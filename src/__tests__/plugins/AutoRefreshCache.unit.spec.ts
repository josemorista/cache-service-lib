import { AutoRefreshCache } from '../../plugins/AutoRefreshCache';
import { AsyncCacheService } from '../../services/AsyncCacheService';
import { CacheService } from '../../services/CacheService';
import { createFakeCacheStrategy } from '../__utils/fakesFactories';
import { sleep } from '../__utils/timers';

let cacheServiceAr: AutoRefreshCache;
let cacheService: CacheService;
describe('AutoRefreshCache', () => {
  beforeEach(() => {
    cacheService = new AsyncCacheService();
  });

  it('Should call fn function over time to refresh entries', async () => {
    const fn = jest.fn();
    fn.mockResolvedValue('value');

    cacheService = new AsyncCacheService();
    const fakeStrategy = createFakeCacheStrategy();
    fakeStrategy.set.mockResolvedValue(undefined);

    cacheServiceAr = new AutoRefreshCache(cacheService);
    cacheServiceAr.registerStrategy('fake', fakeStrategy);

    await cacheServiceAr.call(fn, 'k1', 1);
    await sleep(2500);
    await cacheServiceAr.del('k1');

    expect(fn).toBeCalledTimes(3);
    expect(fakeStrategy.set).toBeCalledWith('k1', 'value', undefined);
  });
});
