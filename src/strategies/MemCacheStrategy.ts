import NodeCache from "node-cache";
import { CacheStrategy } from "./CacheStrategy";

export class MemCacheStrategy implements CacheStrategy {
	private cache: NodeCache;

	constructor() {
		this.cache = new NodeCache();
	}

	async get<T>(key: string): Promise<T | undefined> {
		return this.cache.get<T>(key);
	}

	async set(key: string, value: unknown, expiresIn?: number): Promise<void> {
		if (expiresIn) {
			this.cache.set(key, value, expiresIn);
			return;
		}
		this.cache.set(key, value);
	}

	async del(key: string): Promise<void> {
		this.cache.del(key);
	}

	async delByPrefix(prefix: string): Promise<void> {
		const keys = this.cache.keys().filter(el => el.startsWith(prefix));
		for (const key of keys) {
			this.del(key);
		}
	}

	async flush(): Promise<void> {
		this.cache.flushAll();
	}

}