import { drizzle } from "drizzle-orm/libsql";
import * as schema from "@/db/schema";
import { relations } from "@/db/schema";
import type { LibsqlDb, RelationalStore } from "@/ports/db/port";

interface MaybeCloseable {
  $client?: { close?: () => Promise<void> | void };
}

export class LibsqlRelationalStore implements RelationalStore<LibsqlDb> {
  readonly client: LibsqlDb;

  constructor(url: string) {
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
