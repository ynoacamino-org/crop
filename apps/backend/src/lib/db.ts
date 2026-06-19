import { type DrizzleD1Database, drizzle as drizzleD1 } from "drizzle-orm/d1";
import * as schema from "@/db/schema";
import { relations } from "@/db/schema";

declare global {
  var __cropDb: DrizzleD1Database<typeof schema> | undefined;
}

export type Db = DrizzleD1Database<typeof schema>;

export function getDb(env: Cloudflare.Env): Db {
  if (!globalThis.__cropDb) {
    globalThis.__cropDb = drizzleD1(env.DB, { schema, relations });
  }
  return globalThis.__cropDb;
}

export function setDb(db: Db): void {
  globalThis.__cropDb = db;
}

function buildDb(): Db {
  return new Proxy({} as Db, {
    get(_target, prop, receiver) {
      if (!globalThis.__cropDb) {
        throw new Error(
          "[db] No inicializado. Llama getDb(env) en un request handler (edge) o setDb(db) al boot (node).",
        );
      }
      return Reflect.get(globalThis.__cropDb, prop, receiver);
    },
  });
}

// biome-ignore lint/suspicious/noExplicitAny: dynamic proxy with full type inference
export const db: any = buildDb();
