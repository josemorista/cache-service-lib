# Cache service lib

Presenting a reusable cache library to Node.Js. This library uses well defined cache solutions such as redis and node-cache to deliver scalable and reusable cache services.

An abstraction layer is provided through Adapter and Strategy design patterns, allowing also to simplify multilevel cache solutions.

## Simple usage

```typescript
import { createCacheService, RedisCacheStrategy } from 'cache-service-lib';
const cacheService = createCacheService();
cacheService.registerStrategy(
	'redis',
	new RedisCacheStrategy({
		host: 'localhost',
		port: 6379,
	})
);

cacheService.set('key', 'value', 30); // Will expire cache entry in 30s
```

## Multilevel cache Usage with sync scenarios

```typescript
import { createCacheService, MemcacheStrategy, RedisCacheStrategy } from 'cache-service-lib';
const cacheService = createCacheService();
cacheService.registerStrategy('mem', new MemCacheStrategy());
cacheService.registerStrategy(
	'redis',
	new RedisCacheStrategy({
		host: 'localhost',
		port: 6379,
	})
);
cacheService.chooseStrategy('redis');
cacheService.set('key', 'value', 30); // Will expire cache entry in 30s
```

## Multilevel cache Usage with async scenarios

In async scenarios, in order to ensure the correct strategy at each call is recommended to pass the parameter \*_strategyStorage_:'async'\* to createCacheService.

This parameter enables the usage of the **async_hooks** Node.Js api to store and retrieve the current strategy. Please **make sure the client node version supports this feature**.

```typescript
import { createCacheService, MemcacheStrategy, RedisCacheStrategy } from 'cache-service-lib';
const cacheService = createCacheService({ strategyStorage: 'async' });
cacheService.registerStrategy('mem', new MemCacheStrategy());
cacheService.registerStrategy(
	'redis',
	new RedisCacheStrategy({
		host: 'localhost',
		port: 6379,
	})
);
cacheService.chooseStrategy('redis');
cacheService.set('key', 'value', 30); // Will expire cache entry in 30s
```

### Notes

> The first strategy registered will be automatically marked as the currentStrategy.

### Methods available

- registerStrategy(name: string, strategy: CacheStrategy): void
- chooseStrategy(name: string) : void
- listStrategies() : Array\<string\>
- call\<T\>(fn: () => Promise\<T\>, key: string, expiresIn?: number) : Promise\<T\>
- get\<T\>(key: string): Promise<T | undefined>;
- set(key: string, value: unknown, expiresIn?: number): Promise\<void\>;
- del(key: string): Promise\<void\>;
- delByPrefix(prefix: string): Promise\<void\>;
- flush(): Promise\<void\>;

## Plugins

There are some modifiers available to enable functionalities on top of the default CacheService. This plugins can be used as decorators of CacheServiceProtocols.

### AutoRefreshCache plugin

Enable auto refresh functionality at call function.

- call\<T\>(fn: () => Promise\<T\>, key: string, refreshsIn?: number) : Promise\<T\>

```typescript
import { createCacheService, MemcacheStrategy } from 'cache-service-lib';
const cacheService = createCacheService({ enabledPlugins: { autoRefresh: true } });
cacheService.registerStrategy('mem', new MemCacheStrategy());

const fn = async () => ['value'];
cacheService.call(fn, 'key', 30); // Will autorefresh cache entry every 30s
```

Conflicting set operations will cancel auto refresh schedules.

### Developing notes

Commands to create test dynamodb table:

```bash
aws dynamodb --region us-east-1 --endpoint-url http://localhost:8000 create-table --table-name table-1 \
--attribute-definitions AttributeName=kind,AttributeType=S AttributeName=key,AttributeType=S --key-schema AttributeName=kind,KeyType=HASH AttributeName=key,KeyType=RANGE \
--provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5

aws dynamodb --region us-east-1 --endpoint-url http://localhost:8000 update-time-to-live --table-name table-1 --time-to-live-specification "Enabled=true, AttributeName=ttl"
```
