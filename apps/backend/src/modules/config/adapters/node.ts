import type { EnvPort } from "@/modules/config/ports/config";

interface ProcessLike {
  env: Record<string, string | undefined>;
}

function getProcess(): ProcessLike | undefined {
  if (typeof globalThis !== "undefined" && "process" in globalThis) {
    const proc = (globalThis as { process?: ProcessLike }).process;
    if (proc?.env) return proc;
  }
  return undefined;
}

export class NodeEnv implements EnvPort {
  get(key: string): string | undefined {
    return getProcess()?.env[key];
  }

  getRequired(key: string): string {
    const v = this.get(key);
    if (v === undefined || v === "") {
      throw new Error(`[env] Falta la variable requerida: ${key}`);
    }
    return v;
  }

  all(): Record<string, string | undefined> {
    const proc = getProcess();
    return proc ? { ...proc.env } : {};
  }
}
