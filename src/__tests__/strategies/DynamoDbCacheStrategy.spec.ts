import { CacheStrategy } from "../../strategies/CacheStrategy";
import { DynamoDbCacheStrategy } from "../../strategies/DynamoDbCacheStrategy";

let cacheStrategy: CacheStrategy;
const key = "p:k1";
describe("DynamoDbCacheStrategy", () => {
	beforeEach(() => {
		cacheStrategy = new DynamoDbCacheStrategy({
			region: "us-east-1",
			endpoint: "http://localhost:8000"
		}, {
			table: "table-1",
			keyAttribute: "key",
			ttlAttribute: "ttl",
			hashAttribute: "kind",
			cacheHashValue: "#CACHE"
		});
	});

	afterEach(async () => {
		await cacheStrategy.flush();
	});

	it("Should save a value in cache", async () => {
		await cacheStrategy.set(key, "sample");
		expect(await cacheStrategy.get(key)).toBe("sample");
	});

	it("Should delete a value in cache", async () => {
		await cacheStrategy.set(key, "sample");
		await cacheStrategy.del(key);
		expect(await cacheStrategy.get(key)).toBeUndefined();
	});

	it("Should delete a value by prefix", async () => {
		await cacheStrategy.set(key, "sample");
		await cacheStrategy.delByPrefix("p:");
		expect(await cacheStrategy.get(key)).toBeUndefined();
	});

	it("Should flush all values", async () => {
		await cacheStrategy.set(key, "sample");
		await cacheStrategy.flush();
		expect(await cacheStrategy.get(key)).toBeUndefined();
	});
});