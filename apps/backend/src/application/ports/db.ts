import type { drizzle as drizzleD1 } from "drizzle-orm/d1";
import type { drizzle as drizzleLibsql } from "drizzle-orm/libsql";
import type * as schema from "@/domain/db/schema";
import type { relations } from "@/domain/db/schema";

export type D1Db = ReturnType<
  typeof drizzleD1<typeof schema, typeof relations>
>;

export type LibsqlDb = ReturnType<
  typeof drizzleLibsql<typeof schema, typeof relations>
>;

export type DatabaseClient = D1Db | LibsqlDb;

export interface DbPort<TClient extends DatabaseClient = DatabaseClient> {
  readonly client: TClient;
  close(): Promise<void>;
}
