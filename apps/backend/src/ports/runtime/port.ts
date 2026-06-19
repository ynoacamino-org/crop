import type { AuthInstance } from "@/ports/auth/port";
import type { EnvStore } from "@/ports/config/port";
import type { RelationalStore } from "@/ports/db/port";
import type { KVStore } from "@/ports/kv/port";
import type { ObjectStore } from "@/ports/object/port";

export type RuntimeMode = "edge" | "node";

export interface RuntimeEnv {
  mode: RuntimeMode;
  env: EnvStore;
  db: RelationalStore;
  kv: KVStore;
  objects: ObjectStore;
  auth: AuthInstance;
  close?(): Promise<void>;
}
