import { CacheStrategy } from "../strategies/CacheStrategy";

export interface CacheServiceProtocol extends CacheStrategy {
	registerStrategy(name: string, strategy: CacheStrategy): void;
	getStrategies(): Array<string>;
	chooseStrategy(name: string): void;
	call<T>(fn: () => Promise<T>, key: string, expiresIn?: number): Promise<T>;
}