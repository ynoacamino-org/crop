import { drizzle } from "drizzle-orm/d1";
import { relations } from "@/domain/db/schema";
import { isCloudflareBindings } from "@/modules/config/adapters/detect";
import type { D1Db, DbPort } from "@/modules/database/ports/db";

export class D1DbPort implements DbPort<D1Db> {
  readonly client: D1Db;

  static isConfigured(cf?: Cloudflare.Env): cf is Cloudflare.Env {
    return !!(cf && isCloudflareBindings(cf) && "DB" in cf);
  }

  constructor(binding: D1Database) {
    this.client = drizzle(binding, { relations }) as D1Db;
  }

  async close(): Promise<void> {}
}
