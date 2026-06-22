import type { RuntimeEnv, RuntimeMode } from "@/application/ports/runtime";
import { CloudflareEnv } from "@/infrastructure/adapters/config/cloudflare";
import { createAuth } from "@/infrastructure/factories/auth";
import { createCache } from "@/infrastructure/factories/cache";
import { createDb } from "@/infrastructure/factories/db";
import { createEnv } from "@/infrastructure/factories/env";
import { createObject } from "@/infrastructure/factories/object";

export interface RuntimeOptions {
  cf?: Cloudflare.Env;
}

interface ProcessLike {
  pid?: number;
}

function getProcessKey(): string {
  if (typeof globalThis !== "undefined" && "process" in globalThis) {
    const p = (globalThis as { process?: ProcessLike }).process;
    return `pid:${p?.pid ?? "unknown"}`;
  }
  return "no-process";
}

function build(cf: Cloudflare.Env | undefined, mode: RuntimeMode): RuntimeEnv {
  const env = createEnv({ cf });
  const db = createDb({ env, cf });
  const cache = createCache({ env, cf });
  const objects = createObject({
    env,
    cf,
  });

  const runtime: RuntimeEnv = {
    mode,
    env,
    db,
    cache,
    objects,
    auth: undefined as never,
  };

  runtime.auth = createAuth(runtime);

  if (mode === "node") {
    runtime.close = async () => {
      await db.close?.();
    };
  }

  return runtime;
}

const cache: { value: RuntimeEnv | null; key: string | null } = {
  value: null,
  key: null,
};

export const runtime = {
  create(options: RuntimeOptions = {}): RuntimeEnv {
    const isEdge = CloudflareEnv.isConfigured(options.cf);
    const realCf = isEdge ? options.cf : undefined;
    const mode: RuntimeMode = isEdge ? "edge" : "node";

    if (!isEdge) {
      const key = getProcessKey();
      if (cache.value && cache.key === key) {
        return cache.value;
      }
      const rt = build(realCf, mode);
      cache.value = rt;
      cache.key = key;
      return rt;
    }

    return build(realCf, mode);
  },
  resetCache(): void {
    cache.value = null;
    cache.key = null;
  },
};

export type { RuntimeEnv, RuntimeMode } from "@/application/ports/runtime";
export { createAuth } from "@/infrastructure/factories/auth";
