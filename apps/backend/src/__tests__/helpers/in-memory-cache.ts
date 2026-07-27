import type { CachePort } from "@/modules/cache/ports/cache";

export class InMemoryCache implements CachePort {
  #store = new Map<string, string>();

  async get(key: string): Promise<string | null> {
    return this.#store.get(key) ?? null;
  }

  async put(key: string, value: string): Promise<void> {
    this.#store.set(key, value);
  }

  async delete(key: string): Promise<void> {
    this.#store.delete(key);
  }

  async list(prefix = ""): Promise<string[]> {
    return [...this.#store.keys()].filter((k) => k.startsWith(prefix));
  }
}
