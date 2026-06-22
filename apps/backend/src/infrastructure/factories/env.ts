import type { EnvPort } from "@/application/ports/config";
import { CloudflareEnv } from "@/infrastructure/adapters/config/cloudflare";
import { NodeEnv } from "@/infrastructure/adapters/config/node";

export interface EnvOptions {
  cf?: Cloudflare.Env;
}

export function createEnv(input: EnvOptions = {}): EnvPort {
  if (CloudflareEnv.isConfigured(input.cf)) {
    return new CloudflareEnv(input.cf);
  }
  return new NodeEnv();
}
