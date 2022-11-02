import { CacheService } from './CacheService';

export class SyncCacheService extends CacheService {
	private currentStrategy: string;

	constructor() {
		super();
		this.currentStrategy = '';
	}

	getCurrentStrategy() {
		return this.currentStrategy;
	}

	protected setStrategy(name: string): void {
		this.currentStrategy = name;
	}
}
