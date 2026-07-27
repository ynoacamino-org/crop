import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import { relations } from "@/domain/db/schema";

export interface TestDb {
  db: ReturnType<typeof drizzle<typeof relations>>;
  close: () => Promise<void>;
}

export async function createTestDb(): Promise<TestDb> {
  const client = createClient({ url: ":memory:" });
  const db = drizzle({ client, relations });

  await migrate(db, { migrationsFolder: "./drizzle" });

  return {
    db,
    close: async () => {
      client.close();
    },
  };
}

export async function closeTestDb(testDb: TestDb): Promise<void> {
  await testDb.close();
}
