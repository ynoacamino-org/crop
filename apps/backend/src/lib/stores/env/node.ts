import { BaseEnvStore } from "@/lib/stores/env/base";

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

export class NodeEnv extends BaseEnvStore {
  override get(key: string): string | undefined {
    return getProcess()?.env[key];
  }

  override all(): Record<string, string | undefined> {
    const proc = getProcess();
    return proc ? { ...proc.env } : {};
  }
}
