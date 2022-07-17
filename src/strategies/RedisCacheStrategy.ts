import Redis from "ioredis";
import { RedisOptions } from "ioredis/built/cluster/util";
import { CacheStrategy } from "./CacheStrategy";

export class RedisCacheStrategy implements CacheStrategy {
	private redis: Redis;

	constructor(config: RedisOptions) {
		this.redis = new Redis(config);
	}

	async get<T>(key: string): Promise<T | undefined> {
		const entry = await this.redis.get(key);
		if (!entry) return;
		return JSON.parse(entry).value;
	}

	async set(key: string, value: unknown, expiresIn?: number): Promise<void> {
		const asJSON = JSON.stringify({ value });
		await this.redis.set(key, asJSON);
		if (expiresIn) {
			await this.redis.expire(key, expiresIn);
		}

	}
	async del(key: string): Promise<void> {
		await this.redis.del(key);
	}

	async delByPrefix(prefix: string): Promise<void> {
		const keys = await this.redis.keys(`${prefix}*`);
		const pipeline = this.redis.pipeline();

		keys.forEach(key => {
			pipeline.del(key);
		});

		await pipeline.exec();
	}

	async flush() {
		await this.redis.flushdb();
	}

	close() {
		this.redis.disconnect();
	}

}