import { drizzle } from "drizzle-orm/d1";
import * as schema from "@/db/schema";
import { relations } from "@/db/schema";
import type { D1Db, RelationalStore } from "@/ports/db/port";

export class D1RelationalStore implements RelationalStore<D1Db> {
  readonly client: D1Db;

  constructor(binding: D1Database) {
    this.client = drizzle(binding, {
      schema,
      relations,
    }) as D1Db;
  }

  async close(): Promise<void> {}
}
