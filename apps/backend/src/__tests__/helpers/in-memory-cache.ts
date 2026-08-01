import RedisMock from "ioredis-mock";
import type { CachePort } from "@/modules/cache/ports/cache";

export class InMemoryCache implements CachePort {
  private readonly client: InstanceType<typeof RedisMock>;

  constructor(client?: InstanceType<typeof RedisMock>) {
    this.client = client ?? new RedisMock();
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

  async list(prefix = ""): Promise<string[]> {
    const keys = await this.client.keys(`${prefix}*`);
    return keys;
  }

  async flushall(): Promise<void> {
    await this.client.flushall();
  }
}
