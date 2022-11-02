import { SyncCacheService } from '../../services/SyncCacheService';
import { createFakeCacheStrategy } from '../utils/fakesFactories';

let cacheService: SyncCacheService;
describe('CacheService', () => {
	beforeEach(() => {
		cacheService = new SyncCacheService();
	});

	it('Should allow strategies register', () => {
		cacheService.registerStrategy('strategy1', createFakeCacheStrategy());
		cacheService.registerStrategy('strategy2', createFakeCacheStrategy());
		expect(cacheService.getStrategies()).toEqual(['strategy1', 'strategy2']);
	});

	it('Should allow strategies switch', () => {
		cacheService.registerStrategy('strategy1', createFakeCacheStrategy());
		cacheService.registerStrategy('strategy2', createFakeCacheStrategy());
		expect(cacheService.getCurrentStrategy()).toBe('strategy1');
		cacheService.chooseStrategy('strategy2');
		expect(cacheService.getCurrentStrategy()).toBe('strategy2');
	});

	it('Should not allow switch to a strategy that does not exists', () => {
		try {
			cacheService.chooseStrategy('strategy1');
		} catch (error) {
			expect(error).toEqual(new Error('Invalid strategy'));
		}
	});

	it('Should call correct strategy method', async () => {
		const s1 = createFakeCacheStrategy();
		const s2 = createFakeCacheStrategy();
		cacheService.registerStrategy('strategy1', s1);
		cacheService.registerStrategy('strategy2', s2);
		await cacheService.get('k1');
		cacheService.chooseStrategy('strategy2');
		await cacheService.del('k2');
		expect(s1.get).toHaveBeenCalled();
		expect(s2.get).not.toHaveBeenCalled();
		expect(s1.del).not.toHaveBeenCalled();
		expect(s2.del).toHaveBeenCalled();
	});

	it('Should call fn and set if no value is present on cache', async () => {
		const s1 = createFakeCacheStrategy();
		cacheService.registerStrategy('strategy1', s1);
		const call = jest.fn();
		call.mockResolvedValueOnce('value');
		s1.get.mockResolvedValueOnce(undefined);

		const value = await cacheService.call(call, 'k1', 1000);
		expect(call).toBeCalledTimes(1);
		expect(s1.set).toBeCalledWith('k1', 'value', 1000);
		expect(value).toBe('value');
	});

	it('Should not call fn if value is in cache', async () => {
		const s1 = createFakeCacheStrategy();
		cacheService.registerStrategy('strategy1', s1);
		const call = jest.fn();

		s1.get.mockResolvedValueOnce('value');
		const value = await cacheService.call(call, 'k1', 1000);

		expect(call).not.toHaveBeenCalled();
		expect(value).toBe('value');
	});
});
