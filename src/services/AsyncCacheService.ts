import { AsyncLocalStorage } from 'async_hooks';
import { CacheService } from './CacheService';

export class AsyncCacheService extends CacheService {
	private store: AsyncLocalStorage<string>;

	constructor() {
		super();
		this.store = new AsyncLocalStorage<string>();
		this.store.enterWith('');
	}

	getCurrentStrategy() {
		const currentStrategy = this.store.getStore();
		return currentStrategy || '';
	}

	protected setStrategy(name: string): void {
		this.store.enterWith(name);
	}
}
