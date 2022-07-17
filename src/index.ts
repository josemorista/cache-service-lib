import { CacheService } from "./services/CacheService";
import { MemCacheStrategy } from "./strategies/MemCacheStrategy";
import { RedisCacheStrategy } from "./strategies/RedisCacheStrategy";

export default {
	CacheService,
	MemCacheStrategy,
	RedisCacheStrategy
};