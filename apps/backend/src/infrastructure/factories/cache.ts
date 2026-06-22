import type { CachePort } from "@/application/ports/cache";
import type { EnvPort } from "@/application/ports/config";
import { CloudflareCache } from "@/infrastructure/adapters/cache/cloudflare";
import { NoopCache } from "@/infrastructure/adapters/cache/noop";
import { UpstashCache } from "@/infrastructure/adapters/cache/redis";

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
