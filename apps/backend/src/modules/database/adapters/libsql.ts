import { drizzle } from "drizzle-orm/libsql";
import { relations } from "@/domain/db/schema";
import type { EnvConfig } from "@/modules/config/env";
import type { DbPort, LibsqlDb } from "@/modules/database/ports/db";

interface MaybeCloseable {
  $client?: { close?: () => Promise<void> | void };
}

export class LibsqlDbPort implements DbPort<LibsqlDb> {
  readonly client: LibsqlDb;

  static isConfigured(config: EnvConfig): boolean {
    return !!config.database.url;
  }

  constructor(config: EnvConfig) {
    const url = config.database.url;
    if (!url) {
      throw new Error("[db] DATABASE_URL no configurado para LibsqlDbPort.");
    }
    this.client = drizzle(url, { relations }) as LibsqlDb;
  }

  async close(): Promise<void> {
    const client = (this.client as MaybeCloseable).$client;
    if (client?.close) {
      try {
        await client.close();
      } catch {
        // ignore
      }
    }
  }
}
