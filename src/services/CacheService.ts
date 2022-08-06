import { CacheStrategy } from "../strategies/CacheStrategy";
import { CacheServiceProtocol } from "./CacheServiceProtocol";
import { AsyncLocalStorage } from "async_hooks";

export class CacheService implements CacheServiceProtocol {

	private strategies: Record<string, CacheStrategy>;
	private store: AsyncLocalStorage<string>;

	constructor() {
		this.store = new AsyncLocalStorage<string>();
		this.store.enterWith("");
		this.strategies = {};
	}

	registerStrategy(name: string, strategy: CacheStrategy) {
		const currentStrategy = this.getCurrentStrategy();
		this.strategies[name] = strategy;
		if (!currentStrategy) {
			this.chooseStrategy(name);
		}
	}

	getCurrentStrategy() {
		const currentStrategy = this.store.getStore();
		return currentStrategy || "";
	}

	getStrategies() {
		return Object.keys(this.strategies);
	}

	chooseStrategy(name: string) {
		if (!this.strategies[name]) throw new Error("Invalid strategy");
		this.store.enterWith(name);
	}

	get<T>(key: string): Promise<T | undefined> {
		return this.strategies[this.getCurrentStrategy()].get<T>(key);
	}

	set(key: string, value: unknown, expiresIn?: number | undefined): Promise<void> {
		return this.strategies[this.getCurrentStrategy()].set(key, value, expiresIn);
	}

	del(key: string): Promise<void> {
		return this.strategies[this.getCurrentStrategy()].del(key);
	}

	delByPrefix(prefix: string): Promise<void> {
		return this.strategies[this.getCurrentStrategy()].delByPrefix(prefix);
	}

	flush(): Promise<void> {
		return this.strategies[this.getCurrentStrategy()].flush();
	}

	async call<T>(fn: () => Promise<T>, key: string, expiresIn?: number) {
		let value = await this.get<T>(key);
		if (!value) {
			value = await fn();
			await this.set(key, value, expiresIn);
		}
		return value;
	}

}