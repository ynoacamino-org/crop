import type { KVStore } from "@/ports/kv/port";

export class NoopKV implements KVStore {
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
