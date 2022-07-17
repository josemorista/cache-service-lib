import { CacheStrategy } from "../strategies/CacheStrategy";

export class CacheService implements CacheStrategy {
	currentStrategy: string;
	private strategies: Record<string, CacheStrategy>;

	constructor() {
		this.currentStrategy = "";
		this.strategies = {};
	}

	registerStrategy(name: string, strategy: CacheStrategy) {
		this.strategies[name] = strategy;
		if (!this.currentStrategy) {
			this.currentStrategy = name;
		}
	}

	getStrategies() {
		return Object.keys(this.strategies);
	}

	chooseStrategy(name: string) {
		if (!this.strategies[name]) throw new Error("Invalid strategy");
		this.currentStrategy = name;
	}

	get<T>(key: string): Promise<T | undefined> {
		return this.strategies[this.currentStrategy].get<T>(key);
	}

	set(key: string, value: unknown, expiresIn?: number | undefined): Promise<void> {
		return this.strategies[this.currentStrategy].set(key, value, expiresIn);
	}

	del(key: string): Promise<void> {
		return this.strategies[this.currentStrategy].del(key);
	}

	delByPrefix(prefix: string): Promise<void> {
		return this.strategies[this.currentStrategy].delByPrefix(prefix);
	}

	flush(): Promise<void> {
		return this.strategies[this.currentStrategy].flush();
	}

}