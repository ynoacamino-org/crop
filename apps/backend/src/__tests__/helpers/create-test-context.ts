import { InMemoryCache } from "@/__tests__/helpers/in-memory-cache";
import { createTestDb, type TestDb } from "@/__tests__/helpers/in-memory-db";
import { InMemoryObjectStorage } from "@/__tests__/helpers/in-memory-objects";
import type { RuntimeEnv } from "@/bootstrap/types";
import type { AppContext } from "@/core/context";
import { createBetterAuth } from "@/modules/auth/adapters/better-auth";
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

const sharedObjectStorage = new InMemoryObjectStorage();

export async function createTestContext(
  opts: CreateTestContextOptions = {},
): Promise<TestContext> {
  const testDb = await createTestDb();
  const mockRuntime = createMockRuntime(testDb.db);

  const context: AppContext = {
    user: opts.user,
    db: testDb.db,
    runtime: mockRuntime,
    request: new Request("http://localhost:7000"),
  };

  return {
    db: testDb.db,
    context,
    close: async () => {
      await testDb.close();
    },
  };
}

function createMockRuntime(db: DatabaseClient): RuntimeEnv {
  const mockRt = {
    mode: "node" as const,
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
        secret: "test-secret-min-length-32-chars-key",
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
    objects: sharedObjectStorage,
  };

  const authInstance = createBetterAuth(mockRt as unknown as RuntimeEnv);

  return {
    ...mockRt,
    auth: {
      api: authInstance.api,
      handler: authInstance.handler,
    },
  };
}
