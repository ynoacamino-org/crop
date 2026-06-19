import { CloudflareEnv } from "@/ports/config/cloudflare";
import { NodeEnv } from "@/ports/config/node";
import type { EnvStore } from "@/ports/config/port";
import { isCloudflareBindings } from "@/ports/detect";

export interface EnvFactoryInput {
  cf?: Cloudflare.Env;
}

export function createEnvStore(input: EnvFactoryInput = {}): EnvStore {
  if (input.cf && isCloudflareBindings(input.cf)) {
    return new CloudflareEnv(input.cf);
  }
  return new NodeEnv();
}
