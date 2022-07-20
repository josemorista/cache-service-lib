import { CacheServiceProtocol } from "../services/CacheServiceProtocol";
import { CacheStrategy } from "../strategies/CacheStrategy";

export class AutoRefreshCache implements CacheServiceProtocol {
	private intervals: Record<string, NodeJS.Timer>;

	constructor(private cacheService: CacheServiceProtocol) {
		this.intervals = {};
	}

	private clearRefresh(key: string) {
		if (this.intervals[key]) {
			clearInterval(this.intervals[key]);
			delete this.intervals[key];
		}
	}

	registerStrategy(name: string, strategy: CacheStrategy): void {
		return this.cacheService.registerStrategy(name, strategy);
	}

	getStrategies(): string[] {
		return this.cacheService.getStrategies();
	}

	chooseStrategy(name: string): void {
		return this.cacheService.chooseStrategy(name);
	}

	async call<T>(fn: () => Promise<T>, key: string, refreshsIn?: number): Promise<T> {
		let value = await this.cacheService.get<T>(key);
		if (value) return value;
		value = await fn();

		this.clearRefresh(key);
		await this.cacheService.set(key, value);

		if (refreshsIn) {
			this.intervals[key] = setInterval(() => {
				fn().then(newValue => {
					this.cacheService.set(key, newValue).catch(error => {
						console.log(error);
					});
				}).catch(error => {
					console.error(error);
				});
			}, 1000 * refreshsIn);
		}

		return value;
	}

	get<T>(key: string): Promise<T | undefined> {
		return this.cacheService.get<T>(key);
	}

	async set(key: string, value: unknown, expiresIn?: number | undefined): Promise<void> {
		this.clearRefresh(key);
		await this.cacheService.set(key, value, expiresIn);
	}

	async del(key: string): Promise<void> {
		this.clearRefresh(key);
		await this.cacheService.del(key);
	}

	async delByPrefix(prefix: string): Promise<void> {
		const keys = Object.keys(this.intervals).filter(el => el.startsWith(prefix));
		for (const key of keys) {
			this.clearRefresh(key);
		}
		await this.cacheService.delByPrefix(prefix);
	}

	async flush(): Promise<void> {
		const keys = Object.keys(this.intervals);
		for (const key of keys) {
			this.clearRefresh(key);
		}
		await this.cacheService.flush();
	}
}