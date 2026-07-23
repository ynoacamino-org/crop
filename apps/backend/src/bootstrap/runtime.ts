import { createContainer } from "@/bootstrap/container";
import type { RuntimeEnv, RuntimeMode } from "@/bootstrap/types";
import { CloudflareEnv } from "@/modules/config/adapters/cloudflare";

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
      const rt = createContainer({ cf: realCf, mode });
      cache.value = rt;
      cache.key = key;
      return rt;
    }

    return createContainer({ cf: realCf, mode });
  },
  resetCache(): void {
    cache.value = null;
    cache.key = null;
  },
};

export type { RuntimeEnv, RuntimeMode } from "@/bootstrap/types";
