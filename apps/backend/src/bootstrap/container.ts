import type { RuntimeEnv, RuntimeMode } from "@/bootstrap/types";
import { createAuth } from "@/modules/auth/factory";
import { createCache } from "@/modules/cache/factory";
import { createEnvConfig } from "@/modules/config/env";
import { createEnv } from "@/modules/config/factory";
import { createDb } from "@/modules/database/factory";
import { createObject } from "@/modules/object-storage/factory";

export interface ContainerOptions {
  cf?: Cloudflare.Env;
  mode: RuntimeMode;
}

export function createContainer(opts: ContainerOptions): RuntimeEnv {
  const env = createEnv({ cf: opts.cf });
  const config = createEnvConfig(env);
  const db = createDb({ config, cf: opts.cf });
  const cache = createCache({ config, cf: opts.cf });
  const objects = createObject({ config, cf: opts.cf });

  const runtime: RuntimeEnv = {
    mode: opts.mode,
    env,
    config,
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
