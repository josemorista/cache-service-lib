import { CacheStrategy } from '../strategies/CacheStrategy';
import { CacheServiceProtocol } from './CacheServiceProtocol';

export abstract class CacheService implements CacheServiceProtocol {
	protected strategies: Record<string, CacheStrategy>;

	constructor() {
		this.strategies = {};
	}

	protected abstract setStrategy(name: string): void;
	abstract getCurrentStrategy(): string;

	chooseStrategy(name: string) {
		if (!this.strategies[name]) throw new Error('Invalid strategy');
		this.setStrategy(name);
		return this;
	}

	registerStrategy(name: string, strategy: CacheStrategy) {
		const currentStrategy = this.getCurrentStrategy();
		this.strategies[name] = strategy;
		if (!currentStrategy) {
			this.chooseStrategy(name);
		}
	}

	getStrategies() {
		return Object.keys(this.strategies);
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
