import { isCloudflareBindings } from "@/lib/stores/detect";
import { CloudflareEnv } from "@/lib/stores/env/cloudflare";
import { NodeEnv } from "@/lib/stores/env/node";
import type { EnvStore } from "@/lib/stores/env/types";

export interface EnvFactoryInput {
  cf?: Cloudflare.Env;
}

export function EnvFactory(input: EnvFactoryInput = {}): EnvStore {
  if (input.cf && isCloudflareBindings(input.cf)) {
    return new CloudflareEnv(input.cf);
  }
  return new NodeEnv();
}
