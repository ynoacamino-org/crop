import type { CachePort } from "@/modules/cache/ports/cache";
import { isCloudflareBindings } from "@/modules/config/adapters/detect";

export class CloudflareCache implements CachePort {
  static isConfigured(cf?: Cloudflare.Env): cf is Cloudflare.Env {
    return !!(cf && isCloudflareBindings(cf) && "KV" in cf);
  }

  constructor(private readonly kv: KVNamespace) {}

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

  async list(prefix = ""): Promise<string[]> {
    const result = await this.kv.list({ prefix });
    return result.keys.map((k) => k.name);
  }
}
