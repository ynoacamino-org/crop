import { Redis } from "@upstash/redis";
import { BaseKVStore } from "@/ports/kv/base";

export class UpstashKV extends BaseKVStore {
  private readonly client: Redis;

  constructor(url: string, token: string) {
    super();
    this.client = new Redis({ url, token });
  }

  async get(key: string): Promise<string | null> {
    return this.client.get<string>(key);
  }

  async put(
    key: string,
    value: string,
    opts?: { ttl?: number },
  ): Promise<void> {
    if (opts?.ttl) {
      await this.client.set(key, value, { ex: opts.ttl });
    } else {
      await this.client.set(key, value);
    }
  }

  async delete(key: string): Promise<void> {
    await this.client.del(key);
  }

  override async list(prefix = ""): Promise<string[]> {
    const collected: string[] = [];
    let cursor = 0;
    do {
      const [next, keys] = await this.client.scan(cursor, {
        match: `${prefix}*`,
        count: 100,
      });
      collected.push(...keys);
      cursor = Number(next);
    } while (cursor !== 0);
    return collected;
  }
}
