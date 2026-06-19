import { drizzle } from "drizzle-orm/libsql";
import * as schema from "@/db/schema";
import { relations } from "@/db/schema";
import { BaseRelationalStore } from "@/ports/db/base";
import type { LibsqlDb } from "@/ports/db/port";

interface MaybeCloseable {
  $client?: { close?: () => Promise<void> | void };
}

export class LibsqlRelationalStore extends BaseRelationalStore {
  readonly client: LibsqlDb;

  constructor(url: string) {
    super();
    this.client = drizzle(url, {
      schema,
      relations,
    }) as LibsqlDb;
  }

  override async close(): Promise<void> {
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
