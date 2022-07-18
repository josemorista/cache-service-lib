export { CacheService } from "./services/CacheService";
export { MemCacheStrategy } from "./strategies/MemCacheStrategy";
export { RedisCacheStrategy } from "./strategies/RedisCacheStrategy";

/**
 * Utility times
 */
export const COMMON_TIMES = {
	ONE_HOUR: 3600,
	HALF_HOUR: 1800,
	FIFTEEN_MINUTES: 900,
	ONE_MINUTE: 60
};