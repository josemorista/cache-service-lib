export { CacheService } from "./services/CacheService";
export { MemCacheStrategy } from "./strategies/MemCacheStrategy";
export { RedisCacheStrategy } from "./strategies/RedisCacheStrategy";
export { DynamoDbCacheStrategy } from "./strategies/DynamoDbCacheStrategy";
import { AutoRefreshCache } from "./plugins/AutoRefreshCache";

/**
 * Utility times
 */
export const COMMON_TIMES = {
	ONE_DAY: 86400,
	ONE_HOUR: 3600,
	HALF_HOUR: 1800,
	FIFTEEN_MINUTES: 900,
	ONE_MINUTE: 60
};

export const Plugins = {
	AutoRefreshCache
};