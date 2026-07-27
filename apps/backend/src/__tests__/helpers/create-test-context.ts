import { InMemoryCache } from "@/__tests__/helpers/in-memory-cache";
import { createTestDb, type TestDb } from "@/__tests__/helpers/in-memory-db";
import { InMemoryObjectStorage } from "@/__tests__/helpers/in-memory-objects";
import type { RuntimeEnv } from "@/bootstrap/types";
import type { AppContext } from "@/core/context";
import type { DatabaseClient } from "@/modules/database/ports/db";
import type { CurrentUser } from "@/shared/graphql/builder";

export interface TestContext {
  db: TestDb["db"];
  context: AppContext;
  close: () => Promise<void>;
}

interface CreateTestContextOptions {
  user?: CurrentUser;
}

export async function createTestContext(
  opts: CreateTestContextOptions = {},
): Promise<TestContext> {
  const testDb = await createTestDb();
  const mockRuntime = createMockRuntime(testDb.db);

  const context: AppContext = {
    user: opts.user,
    db: testDb.db,
    runtime: mockRuntime,
  };

  return {
    db: testDb.db,
    context,
    close: testDb.close,
  };
}

function createMockRuntime(db: DatabaseClient): RuntimeEnv {
  return {
    mode: "node",
    env: {
      get: () => undefined,
      getRequired: () => "",
      all: () => ({}),
    },
    config: {
      nodeEnv: "test",
      backendUrl: "http://localhost:7000",
      port: 7000,
      auth: {
        secret: "test-secret",
      },
      database: { url: ":memory:" },
      s3: {
        accessKeyId: "",
        secretAccessKey: "",
        region: "us-east-1",
        bucket: "test-bucket",
        endpoint: "",
        publicUrl: "",
        forcePathStyle: false,
      },
      redis: { url: undefined, token: undefined },
      dev: { seedToken: undefined },
    },
    db: {
      client: db,
      close: async () => {},
    },
    cache: new InMemoryCache(),
    objects: new InMemoryObjectStorage(),
    auth: {
      api: {
        getSession: async () => null,
      },
      handler: async () => new Response("Not implemented"),
    },
  };
}
