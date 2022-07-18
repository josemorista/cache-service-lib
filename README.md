# Cache service lib

Presenting a reusable cache library to Node.Js. This library uses well defined cache solutions such as redis and node-cache to deliver scalable and reusable cache services.

An abstraction layer is provided through Adapter and Strategy design patterns, allowing also to simplify multilevel cache solutions.

## Usage

```typescript
const cacheService = new CacheService();

cacheService.registerStrategy("mem", new MemCacheStrategy());
cacheService.registerStrategy("redis", new RedisCacheStrategy({
			host: "localhost",
			port: 6379
}));

cacheService.chooseStrategy("redis");
cacheService.set("key", "value");
```

### Methods available

* registerStrategy(name: string, strategy: CacheStrategy): void
* chooseStrategy(name: string) : void
* listStrategies() : Array\<string\>
* call\<T\>(fn: () => Promise\<T\>, key: string, expiresIn?: number) : Promise\<T\>
* get\<T\>(key: string): Promise<T | undefined>;
* set(key: string, value: unknown, expiresIn?: number): Promise\<void\>;
* del(key: string): Promise\<void\>;
* delByPrefix(prefix: string): Promise\<void\>;
* flush(): Promise\<void\>;

### Notes

The first strategy registered will be automatically marked as the currentStrategy.