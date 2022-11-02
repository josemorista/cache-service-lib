export { MemCacheStrategy } from './strategies/MemCacheStrategy';
export { RedisCacheStrategy } from './strategies/RedisCacheStrategy';
export { DynamoDbCacheStrategy } from './strategies/DynamoDbCacheStrategy';

import { AutoRefreshCache } from './plugins/AutoRefreshCache';
import { AsyncCacheService } from './services/AsyncCacheService';
import { CacheServiceProtocol } from './services/CacheServiceProtocol';
import { SyncCacheService } from './services/SyncCacheService';

interface CreateCacheServiceParams {
	strategyStorage?: 'sync' | 'async';
	enabledPlugins?: {
		autoRefresh: boolean;
	};
}

/**
 * Utility times
 */
export const COMMON_TIMES = {
	ONE_DAY: 86400,
	ONE_HOUR: 3600,
	HALF_HOUR: 1800,
	FIFTEEN_MINUTES: 900,
	ONE_MINUTE: 60,
};

/**
 * Factories
 */
export const createCacheService = ({ strategyStorage, enabledPlugins }: CreateCacheServiceParams = {}) => {
	let cacheService: CacheServiceProtocol = new SyncCacheService();
	if (strategyStorage === 'async') {
		cacheService = new AsyncCacheService();
	}
	if (enabledPlugins?.autoRefresh) {
		cacheService = new AutoRefreshCache(cacheService);
	}
	return cacheService;
};
