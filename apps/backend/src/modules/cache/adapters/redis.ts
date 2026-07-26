import { Redis } from "@upstash/redis";
import type { CachePort } from "@/modules/cache/ports/cache";
import type { EnvConfig } from "@/modules/config/env";

export class UpstashCache implements CachePort {
  private readonly client: Redis;

  static isConfigured(config: EnvConfig): boolean {
    return !!(config.redis.url && config.redis.token);
  }

  constructor(config: EnvConfig) {
    this.client = new Redis({
      url: config.redis.url ?? "",
      token: config.redis.token ?? "",
    });
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

  async list(prefix = ""): Promise<string[]> {
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
