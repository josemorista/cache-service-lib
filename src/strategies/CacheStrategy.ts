export interface CacheStrategy {
	get<T>(key: string): Promise<T | undefined>;
	set(key: string, value: unknown, expiresIn?: number): Promise<void>;
	del(key: string): Promise<void>;
	delByPrefix(prefix: string): Promise<void>;
	flush(): Promise<void>;
}