import type { RuntimeEnv } from "@/application/ports/runtime";
import { createAuth } from "@/infrastructure/factories/auth";
import { createCache } from "@/infrastructure/factories/cache";
import { createDb } from "@/infrastructure/factories/db";
import { createEnv } from "@/infrastructure/factories/env";
import { createObject } from "@/infrastructure/factories/object";

let cached: RuntimeEnv | null = null;

function build(): RuntimeEnv {
  const env = createEnv();
  const db = createDb(env);
  const cache = createCache(env);
  const objects = createObject(env);

  const runtime: RuntimeEnv = {
    mode: "node",
    env,
    db,
    cache,
    objects,
    auth: undefined as never,
  };

  runtime.auth = createAuth(runtime);

  runtime.close = async () => {
    await db.close?.();
  };

  return runtime;
}

export function getRuntime(): RuntimeEnv {
  if (!cached) {
    cached = build();
  }
  return cached;
}

export function resetRuntime(): void {
  cached = null;
}

export type { RuntimeEnv } from "@/application/ports/runtime";
