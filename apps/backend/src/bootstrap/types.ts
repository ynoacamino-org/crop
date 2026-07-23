import type { AuthPort } from "@/modules/auth/ports/auth";
import type { CachePort } from "@/modules/cache/ports/cache";
import type { EnvPort } from "@/modules/config/ports/config";
import type { DbPort } from "@/modules/database/ports/db";
import type { ObjectPort } from "@/modules/object-storage/ports/storage";

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
