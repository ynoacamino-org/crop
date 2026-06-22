import { drizzle } from "drizzle-orm/d1";
import type { D1Db, DbPort } from "@/application/ports/db";
import * as schema from "@/domain/db/schema";
import { relations } from "@/domain/db/schema";
import { isCloudflareBindings } from "@/infrastructure/adapters/detect";

export class D1DbPort implements DbPort<D1Db> {
  readonly client: D1Db;

  static isConfigured(cf?: Cloudflare.Env): cf is Cloudflare.Env {
    return !!(cf && isCloudflareBindings(cf) && "DB" in cf);
  }

  constructor(binding: D1Database) {
    this.client = drizzle(binding, {
      schema,
      relations,
    }) as D1Db;
  }

  async close(): Promise<void> {}
}
