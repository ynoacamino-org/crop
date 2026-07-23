import { CloudflareEnv } from "@/modules/config/adapters/cloudflare";
import { NodeEnv } from "@/modules/config/adapters/node";
import type { EnvPort } from "@/modules/config/ports/config";

export interface EnvOptions {
  cf?: Cloudflare.Env;
}

export function createEnv(input: EnvOptions = {}): EnvPort {
  if (CloudflareEnv.isConfigured(input.cf)) {
    return new CloudflareEnv(input.cf);
  }
  return new NodeEnv();
}
