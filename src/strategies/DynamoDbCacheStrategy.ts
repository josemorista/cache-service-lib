import { CacheStrategy } from "./CacheStrategy";
import { DynamoDB } from "aws-sdk";

export class DynamoDbCacheStrategy implements CacheStrategy {
	private db: DynamoDB.DocumentClient;

	constructor(args: DynamoDB.ClientConfiguration, readonly options: {
		table: string,
		hashAttribute: string,
		ttlAttribute: string
	}) {
		this.db = new DynamoDB.DocumentClient(args);
	}

	async get<T>(key: string): Promise<T | undefined> {
		const entry = await this.db.get({
			Key: [key],
			TableName: this.options.table,
			AttributesToGet: ["value"]
		}).promise();
		return entry ? entry.Item as T : undefined;
	}

	async set(key: string, value: unknown, expiresIn?: number | undefined): Promise<void> {
		const Item = {
			value,
			[this.options.hashAttribute]: key
		};
		if (expiresIn) {
			Item[this.options.ttlAttribute] = (Date.now() / 1000) + expiresIn;
		}
		await this.db.put({
			Item,
			TableName: this.options.table
		}).promise();
	}

	async del(key: string): Promise<void> {
		await this.db.delete({
			Key: [key],
			TableName: this.options.table
		}).promise();
	}

	async delByPrefix(prefix: string): Promise<void> {
		const toDelete = await this.db.query({
			KeyConditionExpression: "begins_with(:key,:prefix})",
			ExpressionAttributeValues: {
				":key": this.options.hashAttribute,
				":prefix": prefix
			},
			TableName: this.options.table
		}).promise();
		for (const item of (toDelete.Items || [])) {
			await this.del(item[this.options.hashAttribute]);
		}
	}

	async flush(): Promise<void> {
		const toDelete = await this.db.scan({
			TableName: this.options.table
		}).promise();
		for (const item of (toDelete.Items || [])) {
			await this.del(item[this.options.hashAttribute]);
		}
	}

}