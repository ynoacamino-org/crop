import type { AuthInstance } from "@/lib/stores/auth/types";
import type { RelationalStore } from "@/lib/stores/db/types";
import type { EnvStore } from "@/lib/stores/env/types";
import type { KVStore } from "@/lib/stores/kv/types";
import type { ObjectStore } from "@/lib/stores/object/types";

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
