import { drizzle } from "drizzle-orm/libsql";
import type { EnvPort } from "@/application/ports/config";
import type { DbPort, LibsqlDb } from "@/application/ports/db";
import * as schema from "@/domain/db/schema";
import { relations } from "@/domain/db/schema";

interface MaybeCloseable {
  $client?: { close?: () => Promise<void> | void };
}

export class LibsqlDbPort implements DbPort<LibsqlDb> {
  readonly client: LibsqlDb;

  static isConfigured(env: EnvPort): boolean {
    return !!env.get("DATABASE_URL");
  }

  constructor(env: EnvPort) {
    const url = env.get("DATABASE_URL");
    if (!url) {
      throw new Error("[db] DATABASE_URL no configurado para LibsqlDbPort.");
    }
    this.client = drizzle(url, {
      schema,
      relations,
    }) as LibsqlDb;
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
