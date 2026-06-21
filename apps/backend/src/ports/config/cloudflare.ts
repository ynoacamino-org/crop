import type { EnvStore } from "@/ports/config/port";

export class CloudflareEnv implements EnvStore {
  constructor(private readonly bindings: Cloudflare.Env) {}

  get(key: string): string | undefined {
    if (!this.bindings) return undefined;
    const value = (this.bindings as unknown as Record<string, unknown>)[key];
    if (typeof value === "string") return value;
    if (typeof value === "number" || typeof value === "boolean") {
      return String(value);
    }
    return undefined;
  }

  getRequired(key: string): string {
    const v = this.get(key);
    if (v === undefined || v === "") {
      throw new Error(`[env] Falta la variable requerida: ${key}`);
    }
    return v;
  }

  all(): Record<string, string | undefined> {
    const result: Record<string, string | undefined> = {};
    if (!this.bindings) return result;
    for (const [key, value] of Object.entries(this.bindings)) {
      if (typeof value === "string") {
        result[key] = value;
      } else if (typeof value === "number" || typeof value === "boolean") {
        result[key] = String(value);
      }
    }
    return result;
  }
}
