import type { EnvPort } from "@/application/ports/config";
import { NodeEnv } from "@/infrastructure/adapters/config/node";

export function createEnv(): EnvPort {
  return new NodeEnv();
}
