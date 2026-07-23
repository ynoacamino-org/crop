import type { CachePort } from "@/modules/cache/ports/cache";

export class NoopCache implements CachePort {
  async get(_key: string): Promise<string | null> {
    return null;
  }

  async put(_key: string, _value: string): Promise<void> {
    // no-op
  }

  async delete(_key: string): Promise<void> {
    // no-op
  }

  async list(prefix = ""): Promise<string[]> {
    void prefix;
    return [];
  }
}
