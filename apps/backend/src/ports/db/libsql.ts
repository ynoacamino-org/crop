import { drizzle } from "drizzle-orm/libsql";
import * as schema from "@/db/schema";
import { relations } from "@/db/schema";
import { BaseRelationalStore } from "@/ports/db/base";
import type { Db } from "@/ports/db/port";

interface MaybeCloseable {
  $client?: { close?: () => Promise<void> | void };
}

export class LibsqlRelationalStore extends BaseRelationalStore {
  readonly client: Db;

  constructor(url: string) {
    super();
    this.client = drizzle(url, {
      schema,
      relations,
    }) as unknown as Db;
  }

  override async close(): Promise<void> {
    const client = (this.client as unknown as MaybeCloseable).$client;
    if (client?.close) {
      try {
        await client.close();
      } catch {
        // ignore
      }
    }
  }
}
