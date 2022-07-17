import { CacheService } from "../../services/CacheService";
import { CacheStrategy } from "../../strategies/CacheStrategy";

const createFakeCacheStrategy: () => CacheStrategy = () => ({
	del: jest.fn(),
	get: jest.fn(),
	delByPrefix: jest.fn(),
	set: jest.fn(),
	flush: jest.fn()
});

let cacheService: CacheService;
describe("CacheService", () => {
	beforeEach(() => {
		cacheService = new CacheService();
	});

	it("Should allow strategies register", () => {
		cacheService.registerStrategy("strategy1", createFakeCacheStrategy());
		cacheService.registerStrategy("strategy2", createFakeCacheStrategy());
		expect(cacheService.getStrategies()).toEqual(["strategy1", "strategy2"]);
	});

	it("Should allow strategies switch", () => {
		cacheService.registerStrategy("strategy1", createFakeCacheStrategy());
		cacheService.registerStrategy("strategy2", createFakeCacheStrategy());
		expect(cacheService.currentStrategy).toBe("strategy1");
		cacheService.chooseStrategy("strategy2");
		expect(cacheService.currentStrategy).toBe("strategy2");
	});

	it("Should not allow switch to a strategy that does not exists", () => {
		try {
			cacheService.chooseStrategy("strategy1");
		} catch (error) {
			expect(error).toEqual(new Error("Invalid strategy"));
		}
	});

	it("Should call correct strategy method", async () => {
		const s1 = createFakeCacheStrategy();
		const s2 = createFakeCacheStrategy();
		cacheService.registerStrategy("strategy1", s1);
		cacheService.registerStrategy("strategy2", s2);
		await cacheService.get("k1");
		cacheService.chooseStrategy("strategy2");
		await cacheService.del("k2");
		expect(s1.get).toHaveBeenCalled();
		expect(s2.get).not.toHaveBeenCalled();
		expect(s1.del).not.toHaveBeenCalled();
		expect(s2.del).toHaveBeenCalled();
	});
});