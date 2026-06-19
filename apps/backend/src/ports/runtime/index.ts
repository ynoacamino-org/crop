import { createAuth } from "@/ports/auth";
import { createEnvStore } from "@/ports/config";
import { createRelationalStore } from "@/ports/db";
import { isCloudflareBindings } from "@/ports/detect";
import { createKVStore } from "@/ports/kv";
import { createObjectStore } from "@/ports/object";
import type { RuntimeEnv, RuntimeMode } from "@/ports/runtime/port";

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
  const env = createEnvStore({ cf });
  const db = createRelationalStore({ env, cf });
  const kv = createKVStore({ env, cf });
  const objects = createObjectStore({
    env,
    cf,
    preferR2Binding: mode === "edge",
  });

  const runtime: RuntimeEnv = {
    mode,
    env,
    db,
    kv,
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
    const isEdge = isCloudflareBindings(options.cf);
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

export { createAuth } from "@/ports/auth";
export type { RuntimeEnv, RuntimeMode } from "@/ports/runtime/port";
