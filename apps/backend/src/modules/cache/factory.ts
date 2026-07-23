import { CloudflareCache } from "@/modules/cache/adapters/cloudflare";
import { NoopCache } from "@/modules/cache/adapters/noop";
import { UpstashCache } from "@/modules/cache/adapters/redis";
import type { CachePort } from "@/modules/cache/ports/cache";
import type { EnvPort } from "@/modules/config/ports/config";

export interface CacheOptions {
  env: EnvPort;
  cf?: Cloudflare.Env;
}

export function createCache(opts: CacheOptions): CachePort {
  if (CloudflareCache.isConfigured(opts.cf)) {
    return new CloudflareCache(opts.cf.KV as KVNamespace);
  }

  if (UpstashCache.isConfigured(opts.env)) {
    return new UpstashCache(opts.env);
  }

  return new NoopCache();
}
