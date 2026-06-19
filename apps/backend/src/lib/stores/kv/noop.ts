import { BaseKVStore } from "@/lib/stores/kv/base";

export class NoopKV extends BaseKVStore {
  async get(_key: string): Promise<string | null> {
    return null;
  }

  async put(_key: string, _value: string): Promise<void> {
    // no-op
  }

  async delete(_key: string): Promise<void> {
    // no-op
  }
}
