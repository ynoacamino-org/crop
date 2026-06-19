import { createAuth } from "@/lib/auth";
import { RelationalStoreFactory } from "@/lib/stores/db";
import { isCloudflareBindings } from "@/lib/stores/detect";
import { EnvFactory } from "@/lib/stores/env";
import { KVFactory } from "@/lib/stores/kv";
import { ObjectStoreFactory } from "@/lib/stores/object";
import type { RuntimeEnv, RuntimeMode } from "@/lib/stores/runtime/types";

export interface RuntimeFactoryOptions {
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
  const env = EnvFactory({ cf });
  const db = RelationalStoreFactory({ env, cf });
  const kv = KVFactory({ env, cf });
  const objects = ObjectStoreFactory({
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
      if ("close" in kv && typeof kv.close === "function") {
        await (kv as unknown as { close: () => Promise<void> }).close();
      }
    };
  }

  return runtime;
}

const cache: { value: RuntimeEnv | null; key: string | null } = {
  value: null,
  key: null,
};

export const RuntimeFactory = {
  create(options: RuntimeFactoryOptions = {}): RuntimeEnv {
    const isEdge = options.cf ? isCloudflareBindings(options.cf) : false;
    const realCf = isEdge ? options.cf : undefined;
    const mode: RuntimeMode = isEdge ? "edge" : "node";

    // En Node: cachear por proceso (1 redis conn, 1 libsql conn, etc.)
    // En Edge: cada request crea un RuntimeEnv nuevo (los isolates de Workers
    // no comparten estado y los bindings son inmutables por isolate).
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
