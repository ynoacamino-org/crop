import type { KVStore } from "@/ports/kv/port";

export abstract class BaseKVStore implements KVStore {
  abstract get(key: string): Promise<string | null>;

  abstract put(
    key: string,
    value: string,
    opts?: { ttl?: number },
  ): Promise<void>;

  abstract delete(key: string): Promise<void>;

  async list(prefix = ""): Promise<string[]> {
    void prefix;
    return [];
  }

  async getMany(keys: string[]): Promise<Record<string, string | null>> {
    const entries = await Promise.all(
      keys.map(async (k) => [k, await this.get(k)] as const),
    );
    return Object.fromEntries(entries);
  }
}
