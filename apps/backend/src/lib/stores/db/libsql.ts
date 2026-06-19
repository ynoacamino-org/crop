import { drizzle } from "drizzle-orm/libsql";
import * as schema from "@/db/schema";
import { relations } from "@/db/schema";
import { BaseRelationalStore } from "@/lib/stores/db/base";

type LibsqlClient = ReturnType<typeof drizzle>;

interface MaybeCloseable {
  $client?: { close?: () => Promise<void> | void };
}

export class LibsqlRelationalStore extends BaseRelationalStore {
  readonly client: LibsqlClient;

  constructor(url: string) {
    super();
    this.client = drizzle(url, { schema, relations });
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
