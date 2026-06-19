import type { RelationalStore } from "@/lib/stores/db/types";

export abstract class BaseRelationalStore implements RelationalStore {
  abstract readonly client: unknown;

  async close(): Promise<void> {
    // default: no-op (D1 no requiere cierre)
  }
}
