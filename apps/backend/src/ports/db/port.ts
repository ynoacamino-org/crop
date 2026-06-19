import type { drizzle as drizzleD1 } from "drizzle-orm/d1";
import type { drizzle as drizzleLibsql } from "drizzle-orm/libsql";
import type * as schema from "@/db/schema";
import type { relations } from "@/db/schema";

export type Db = ReturnType<typeof drizzleD1<typeof schema, typeof relations>>;

export type DbAny =
  | ReturnType<typeof drizzleD1<typeof schema, typeof relations>>
  | ReturnType<typeof drizzleLibsql<typeof schema, typeof relations>>;

export interface RelationalStore {
  readonly client: DbAny;
  close?(): Promise<void>;
}
