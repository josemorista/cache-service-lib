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

## Plugins

There are some modifiers available to enable functionalities on top of the default CacheService. This plugins can be used as decorators of CacheServiceProtocols.

### AutoRefreshCache plugin

Enable auto refresh functionality at call function.

* call\<T\>(fn: () => Promise\<T\>, key: string, refreshsIn?: number) : Promise\<T\>

```typescript
import { Plugins } from "cache-service-lib";
const cacheService = new Plugins.AutoRefreshCache(new CacheService());
cacheService.registerStrategy("mem", new MemCacheStrategy());

const fn = async () => ["value"];
cacheService.call(fn, "key", 1000); // Will autorefresh cache entry in 1000ms
```

Conflicting set operations will cancel auto refresh schedules.

### Notes

The first strategy registered will be automatically marked as the currentStrategy.