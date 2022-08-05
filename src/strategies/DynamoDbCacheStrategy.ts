import { CacheStrategy } from "./CacheStrategy";
import { DynamoDB } from "aws-sdk";

export class DynamoDbCacheStrategy implements CacheStrategy {
	private db: DynamoDB.DocumentClient;

	constructor(args: DynamoDB.ClientConfiguration, readonly options: {
		table: string,
		keyAttribute: string,
		hashAttribute: string,
		ttlAttribute: string
		cacheHashValue: string
	}) {
		this.db = new DynamoDB.DocumentClient(args);
	}

	async get<T>(key: string): Promise<T | undefined> {
		const entry = await this.db.get({
			Key: { [this.options.hashAttribute]: this.options.cacheHashValue, [this.options.keyAttribute]: key },
			TableName: this.options.table,
			AttributesToGet: ["value"]
		}).promise();
		return entry.Item?.value;
	}

	async set(key: string, value: unknown, expiresIn?: number | undefined): Promise<void> {
		const Item = {
			value,
			[this.options.keyAttribute]: key,
			[this.options.hashAttribute]: this.options.cacheHashValue
		};
		if (expiresIn) {
			Item[this.options.ttlAttribute] = Math.round((Date.now() / 1000) + expiresIn);
		}
		await this.db.put({
			Item,
			TableName: this.options.table
		}).promise();
	}

	async del(key: string): Promise<void> {
		await this.db.delete({
			Key: { [this.options.hashAttribute]: this.options.cacheHashValue, [this.options.keyAttribute]: key },
			TableName: this.options.table
		}).promise();
	}

	async delByPrefix(prefix: string): Promise<void> {
		const toDelete = await this.db.query({
			KeyConditionExpression: "#hashKey=:hashValue and begins_with(#key,:prefix)",
			ExpressionAttributeNames: {
				"#hashKey": this.options.hashAttribute,
				"#key": this.options.keyAttribute,
			},
			ExpressionAttributeValues: {
				":hashValue": this.options.cacheHashValue,
				":prefix": prefix
			},
			TableName: this.options.table
		}).promise();
		for (const item of (toDelete.Items || [])) {
			await this.del(item[this.options.keyAttribute]);
		}
	}

	async flush(): Promise<void> {
		const toDelete = await this.db.query({
			KeyConditionExpression: "#hashKey=:hashValue",
			ExpressionAttributeNames: {
				"#hashKey": this.options.hashAttribute
			},
			ExpressionAttributeValues: {
				":hashValue": this.options.cacheHashValue
			},
			TableName: this.options.table
		}).promise();
		for (const item of (toDelete.Items || [])) {
			await this.del(item[this.options.keyAttribute]);
		}
	}

}