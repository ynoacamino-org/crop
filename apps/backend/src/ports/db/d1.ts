import { drizzle } from "drizzle-orm/d1";
import * as schema from "@/db/schema";
import { relations } from "@/db/schema";
import { BaseRelationalStore } from "@/ports/db/base";
import type { D1Db } from "@/ports/db/port";

export class D1RelationalStore extends BaseRelationalStore {
  readonly client: D1Db;

  constructor(binding: D1Database) {
    super();
    this.client = drizzle(binding, {
      schema,
      relations,
    }) as D1Db;
  }
}
