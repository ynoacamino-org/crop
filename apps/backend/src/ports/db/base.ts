import type { DatabaseClient, RelationalStore } from "@/ports/db/port";

export abstract class BaseRelationalStore implements RelationalStore {
  abstract readonly client: DatabaseClient;

  async close(): Promise<void> {
  }
}
