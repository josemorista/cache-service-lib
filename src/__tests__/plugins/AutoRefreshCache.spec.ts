import { AutoRefreshCache } from "../../plugins/AutoRefreshCache";
import { CacheService } from "../../services/CacheService";
import { createFakeCacheStrategy } from "../utils/fakesFactories";
import { sleep } from "../utils/timers";

let cacheServiceAr: AutoRefreshCache;
let cacheService: CacheService;
describe("AutoRefreshCache", () => {
	beforeEach(() => {
		cacheService = new CacheService();
	});

	it("Should call fn function over time to refresh entries", async () => {
		const fn = jest.fn();
		fn.mockResolvedValue("value");

		cacheService = new CacheService();
		const fakeStrategy = createFakeCacheStrategy();
		fakeStrategy.set.mockResolvedValue(undefined);

		cacheService.registerStrategy("fake", fakeStrategy);
		cacheServiceAr = new AutoRefreshCache(cacheService);

		await cacheServiceAr.call(fn, "k1", 200);
		await sleep(450);
		await cacheServiceAr.del("k1");

		expect(fn).toBeCalledTimes(3);
		expect(fakeStrategy.set).toBeCalledWith("k1", "value", undefined);
	});
});