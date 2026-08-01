import { graphql, print } from "graphql";
import { describe, expect, it } from "vitest";
import {
  CreateApiKeyDocument,
  DeleteApiKeyDocument,
  GetApiKeysDocument,
} from "@/__tests__/graphql/generated/test-gql";
import {
  closeTestDb,
  createTestContext,
  seedApiKey,
  seedUser,
} from "@/__tests__/helpers";
import { buildContext } from "@/core/context";
import {
  BetterAuthAdapter,
  createBetterAuth,
} from "@/modules/auth/adapters/better-auth";
import { schema } from "@/shared/graphql/schema";

describe("API Keys & BetterAuth Integration Suite", () => {
  describe("BetterAuthAdapter & API Types", () => {
    it("instantiates BetterAuthAdapter satisfying AuthPort interface without type errors", async () => {
      const tc = await createTestContext();
      const adapter = new BetterAuthAdapter(tc.context.runtime);

      expect(adapter.api).toBeDefined();
      expect(adapter.handler).toBeDefined();
      expect(typeof adapter.api.verifyApiKey).toBe("function");
      expect(typeof adapter.api.createApiKey).toBe("function");
      expect(typeof adapter.api.deleteApiKey).toBe("function");
      expect(typeof adapter.api.listApiKeys).toBe("function");

      closeTestDb(tc);
    });

    it("verifies seeded API keys correctly through verifyApiKey endpoint", async () => {
      const tc = await createTestContext();
      const user = await seedUser(tc.db, {
        id: "user-verify-1",
        email: "verify1@example.com",
        name: "Verify User",
      });

      const seededKey = await seedApiKey(tc.db, {
        userId: user.id,
        name: "My Production Key",
      });

      const authInstance = createBetterAuth(tc.context.runtime);

      // Verify valid key
      const verification = await authInstance.api.verifyApiKey({
        body: {
          key: seededKey.key,
        },
      });

      expect(verification.valid).toBe(true);
      expect(verification.key).toBeDefined();
      expect(verification.key?.referenceId).toBe(user.id);
      expect(verification.key?.name).toBe("My Production Key");

      // Verify invalid key
      const invalidVerification = await authInstance.api.verifyApiKey({
        body: {
          key: "crop_invalid_key_999999999999999999999999999999",
        },
      });

      expect(invalidVerification.valid).toBe(false);

      closeTestDb(tc);
    });
  });

  describe("x-api-key Header Context Resolution", () => {
    it("resolves user in buildContext when valid x-api-key header is provided", async () => {
      const tc = await createTestContext();
      const user = await seedUser(tc.db, {
        id: "user-apikey-ctx",
        email: "apikey-ctx@example.com",
        name: "API Key Context User",
        role: "COLLABORATOR",
      });

      const seededKey = await seedApiKey(tc.db, {
        userId: user.id,
        name: "Context Auth Key",
      });

      const requestWithKey = new Request("http://localhost:7000/graphql", {
        headers: {
          "x-api-key": seededKey.key,
        },
      });

      const contextWithKey = await buildContext(
        tc.context.runtime,
        requestWithKey,
      );

      expect(contextWithKey.user).toBeDefined();
      expect(contextWithKey.user?.id).toBe(user.id);
      expect(contextWithKey.user?.role).toBe("COLLABORATOR");
      expect(contextWithKey.request).toBe(requestWithKey);

      closeTestDb(tc);
    });

    it("returns undefined user in buildContext when invalid x-api-key header is provided", async () => {
      const tc = await createTestContext();

      const requestWithBadKey = new Request("http://localhost:7000/graphql", {
        headers: {
          "x-api-key": "crop_non_existent_key_123456",
        },
      });

      const contextWithBadKey = await buildContext(
        tc.context.runtime,
        requestWithBadKey,
      );

      expect(contextWithBadKey.user).toBeUndefined();

      closeTestDb(tc);
    });
  });

  describe("GraphQL API Key Resolvers with x-api-key Authentication", () => {
    it("creates, queries, and deletes API keys via GraphQL when authenticated with API key", async () => {
      const tc = await createTestContext();
      const user = await seedUser(tc.db, {
        id: "user-gql-full",
        email: "gql-full@example.com",
        role: "ADMIN",
      });

      const initialKey = await seedApiKey(tc.db, {
        userId: user.id,
        name: "Initial Key",
      });

      const request = new Request("http://localhost:7000/graphql", {
        headers: {
          "x-api-key": initialKey.key,
        },
      });

      const context = await buildContext(tc.context.runtime, request);

      // 1. Create a new API key via mutation
      const createRes = await graphql({
        schema,
        source: print(CreateApiKeyDocument),
        variableValues: {
          input: {
            name: "New Key From GraphQL",
            expiresIn: 30,
          },
        },
        contextValue: context,
      });

      expect(createRes.errors).toBeUndefined();
      const createData = createRes.data as {
        createApiKey: { id: string; name: string; prefix: string };
      };
      expect(createData.createApiKey).toBeDefined();
      expect(createData.createApiKey.name).toBe("New Key From GraphQL");

      // 2. Delete created API key via mutation
      const deleteRes = await graphql({
        schema,
        source: print(DeleteApiKeyDocument),
        variableValues: {
          id: createData.createApiKey.id,
        },
        contextValue: context,
      });

      expect(deleteRes.errors).toBeUndefined();
      const deleteData = deleteRes.data as { deleteApiKey: boolean };
      expect(deleteData.deleteApiKey).toBe(true);

      closeTestDb(tc);
    });

    it("rejects apiKeys query when user is unauthenticated", async () => {
      const tc = await createTestContext();

      const result = await graphql({
        schema,
        source: print(GetApiKeysDocument),
        contextValue: tc.context,
      });

      expect(result.errors).toBeDefined();
      expect(result.errors![0]!.extensions?.code).toBe("UNAUTHORIZED");

      closeTestDb(tc);
    });
  });
});
