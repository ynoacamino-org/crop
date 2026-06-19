import type { EnvStore } from "@/ports/config/port";

export abstract class BaseEnvStore implements EnvStore {
  abstract get(key: string): string | undefined;

  getRequired(key: string): string {
    const v = this.get(key);
    if (v === undefined || v === "") {
      throw new Error(`[env] Falta la variable requerida: ${key}`);
    }
    return v;
  }

  all(): Record<string, string | undefined> {
    return {};
  }
}
