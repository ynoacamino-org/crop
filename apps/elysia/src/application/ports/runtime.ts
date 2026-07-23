import type { AuthPort } from "@/application/ports/auth";
import type { CachePort } from "@/application/ports/cache";
import type { EnvPort } from "@/application/ports/config";
import type { DbPort } from "@/application/ports/db";
import type { ObjectPort } from "@/application/ports/object";

export type RuntimeMode = "edge" | "node";

export interface RuntimeEnv {
  mode: RuntimeMode;
  env: EnvPort;
  db: DbPort;
  cache: CachePort;
  objects: ObjectPort;
  auth: AuthPort;
  close?(): Promise<void>;
}
