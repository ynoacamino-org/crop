import { isCloudflareBindings } from "@/lib/stores/detect";
import type { EnvStore } from "@/lib/stores/env/types";
import { CloudflareKV } from "@/lib/stores/kv/cloudflare";
import { NoopKV } from "@/lib/stores/kv/noop";
import { RedisKV } from "@/lib/stores/kv/redis";
import type { KVStore } from "@/lib/stores/kv/types";

export interface KVFactoryOptions {
  env: EnvStore;
  cf?: Cloudflare.Env;
}

export function KVFactory(opts: KVFactoryOptions): KVStore {
  if (opts.cf && isCloudflareBindings(opts.cf) && "KV" in opts.cf) {
    return new CloudflareKV(opts.cf.KV as KVNamespace);
  }

  const url = opts.env.get("REDIS_URL");
  if (!url) {
    return new NoopKV();
  }
  return new RedisKV(url);
}
