import type { EnvStore } from "@/ports/config/port";
import { isCloudflareBindings } from "@/ports/detect";
import { CloudflareKV } from "@/ports/kv/cloudflare";
import { NoopKV } from "@/ports/kv/noop";
import type { KVStore } from "@/ports/kv/port";
import { UpstashKV } from "@/ports/kv/redis";

export interface KVFactoryOptions {
  env: EnvStore;
  cf?: Cloudflare.Env;
}

export function createKVStore(opts: KVFactoryOptions): KVStore {
  if (isCloudflareBindings(opts.cf) && "KV" in opts.cf) {
    return new CloudflareKV(opts.cf.KV as KVNamespace);
  }

  const url = opts.env.get("UPSTASH_REDIS_REST_URL");
  const token = opts.env.get("UPSTASH_REDIS_REST_TOKEN");
  if (url && token) {
    return new UpstashKV(url, token);
  }

  return new NoopKV();
}
