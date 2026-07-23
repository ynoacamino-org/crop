import type { RuntimeEnv, RuntimeMode } from "@/bootstrap/types";
import { createAuth } from "@/modules/auth/factory";
import { createCache } from "@/modules/cache/factory";
import { createEnv } from "@/modules/config/factory";
import { createDb } from "@/modules/database/factory";
import { createObject } from "@/modules/object-storage/factory";

export interface ContainerOptions {
  cf?: Cloudflare.Env;
  mode: RuntimeMode;
}

export function createContainer(opts: ContainerOptions): RuntimeEnv {
  const env = createEnv({ cf: opts.cf });
  const db = createDb({ env, cf: opts.cf });
  const cache = createCache({ env, cf: opts.cf });
  const objects = createObject({ env, cf: opts.cf });

  const runtime: RuntimeEnv = {
    mode: opts.mode,
    env,
    db,
    cache,
    objects,
    auth: undefined as never,
  };

  runtime.auth = createAuth(runtime);

  if (opts.mode === "node") {
    runtime.close = async () => {
      await db.close?.();
    };
  }

  return runtime;
}
