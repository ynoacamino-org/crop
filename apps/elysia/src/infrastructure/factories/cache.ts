import type { CachePort } from "@/application/ports/cache";
import type { EnvPort } from "@/application/ports/config";
import { NoopCache } from "@/infrastructure/adapters/cache/noop";
import { UpstashCache } from "@/infrastructure/adapters/cache/redis";

export function createCache(env: EnvPort): CachePort {
  if (UpstashCache.isConfigured(env)) {
    return new UpstashCache(env);
  }

  return new NoopCache();
}
