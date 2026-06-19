import { BaseKVStore } from "@/ports/kv/base";

export class CloudflareKV extends BaseKVStore {
  constructor(private readonly kv: KVNamespace) {
    super();
  }

  async get(key: string): Promise<string | null> {
    return this.kv.get(key);
  }

  async put(
    key: string,
    value: string,
    opts?: { ttl?: number },
  ): Promise<void> {
    await this.kv.put(
      key,
      value,
      opts?.ttl ? { expirationTtl: opts.ttl } : undefined,
    );
  }

  async delete(key: string): Promise<void> {
    await this.kv.delete(key);
  }

  override async list(prefix = ""): Promise<string[]> {
    const result = await this.kv.list({ prefix });
    return result.keys.map((k) => k.name);
  }
}
