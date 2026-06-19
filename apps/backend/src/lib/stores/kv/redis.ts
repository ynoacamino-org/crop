import Redis, { type Redis as RedisClient, type RedisOptions } from "ioredis";
import { BaseKVStore } from "@/lib/stores/kv/base";

export interface RedisKVOptions extends RedisOptions {}

export class RedisKV extends BaseKVStore {
  private readonly client: RedisClient;

  constructor(url: string, options?: RedisKVOptions) {
    super();
    this.client = new Redis(url, {
      lazyConnect: false,
      maxRetriesPerRequest: 3,
      ...options,
    });
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async put(
    key: string,
    value: string,
    opts?: { ttl?: number },
  ): Promise<void> {
    if (opts?.ttl) {
      await this.client.set(key, value, "EX", opts.ttl);
    } else {
      await this.client.set(key, value);
    }
  }

  async delete(key: string): Promise<void> {
    await this.client.del(key);
  }

  override async list(prefix = ""): Promise<string[]> {
    return this.client.keys(`${prefix}*`);
  }

  async close(): Promise<void> {
    await this.client.quit();
  }
}
