import type { DbAny, RelationalStore } from "@/ports/db/port";

export abstract class BaseRelationalStore implements RelationalStore {
  abstract readonly client: DbAny;

  async close(): Promise<void> {
    // default: no-op (D1 no requiere cierre)
  }
}
