import { BaseEnvStore } from "@/lib/stores/env/base";

export class CloudflareEnv extends BaseEnvStore {
  constructor(private readonly bindings: Cloudflare.Env) {
    super();
  }

  override get(key: string): string | undefined {
    if (!this.bindings) return undefined;
    const value = (this.bindings as unknown as Record<string, unknown>)[key];
    if (typeof value === "string") return value;
    if (typeof value === "number" || typeof value === "boolean") {
      return String(value);
    }
    return undefined;
  }

  override all(): Record<string, string | undefined> {
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
