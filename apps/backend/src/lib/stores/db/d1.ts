import { drizzle } from "drizzle-orm/d1";
import * as schema from "@/db/schema";
import { relations } from "@/db/schema";
import { BaseRelationalStore } from "@/lib/stores/db/base";

export class D1RelationalStore extends BaseRelationalStore {
  readonly client: ReturnType<typeof drizzle<typeof schema>>;

  constructor(binding: D1Database) {
    super();
    this.client = drizzle(binding, { schema, relations });
  }
}
