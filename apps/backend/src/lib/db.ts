import { type DrizzleD1Database, drizzle } from "drizzle-orm/d1";
import * as schema from "@/db/schema";
import { relations } from "@/db/schema";

declare global {
  var __cropDb: DrizzleD1Database<typeof schema> | undefined;
}

export type Db = DrizzleD1Database<typeof schema>;

export function getDb(env: Cloudflare.Env): Db {
  if (!globalThis.__cropDb) {
    globalThis.__cropDb = drizzle(env.DB, { schema, relations });
  }
  return globalThis.__cropDb;
}

function buildDb(): Db {
  return new Proxy({} as Db, {
    get(_target, prop, receiver) {
      if (!globalThis.__cropDb) {
        throw new Error(
          "[db] No inicializado. Llama getDb(env) antes de usar `db` (p.ej. desde un request handler).",
        );
      }
      return Reflect.get(globalThis.__cropDb, prop, receiver);
    },
  });
}

// biome-ignore lint/suspicious/noExplicitAny: dynamic proxy with full type inference
export const db: any = buildDb();
