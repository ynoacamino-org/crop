import { graphql, print } from "graphql";
import { describe, expect, it } from "vitest";
import {
  GetMeDocument,
  GetUsersDocument,
  UpdateMeDocument,
} from "@/__tests__/graphql/generated/test-gql";
import { closeTestDb, createTestContext, seedUser } from "@/__tests__/helpers";
import type { CurrentUser } from "@/shared/graphql/builder";
import { schema } from "@/shared/graphql/schema";

describe("User resolvers", () => {
  describe("me query", () => {
    it("returns the current user when authenticated", async () => {
      const tc = await createTestContext({
        user: { id: "user-1", email: "me@example.com", role: "ADMIN" },
      });
      await seedUser(tc.db, {
        id: "user-1",
        email: "me@example.com",
        name: "Me User",
        role: "ADMIN",
      });

      const result = await graphql({
        schema,
        source: print(GetMeDocument),
        contextValue: tc.context,
      });

      expect(result.errors).toBeUndefined();
      const data = result.data as {
        me: { email: string; name: string; role: string };
      };
      expect(data.me.email).toBe("me@example.com");
      expect(data.me.name).toBe("Me User");
      expect(data.me.role).toBe("ADMIN");
      closeTestDb(tc);
    });

    it("returns error when unauthenticated", async () => {
      const tc = await createTestContext();

      const result = await graphql({
        schema,
        source: print(GetMeDocument),
        contextValue: tc.context,
      });

      expect(result.errors).toBeDefined();
      closeTestDb(tc);
    });
  });

  describe("users query", () => {
    it("returns paginated users when authenticated", async () => {
      const currentUser: CurrentUser = {
        id: "user-1",
        email: "admin@example.com",
        role: "ADMIN",
      };
      const tc = await createTestContext({ user: currentUser });
      await seedUser(tc.db, { id: "user-1", role: "ADMIN" });
      await seedUser(tc.db, { name: "User 2", role: "COLLABORATOR" });
      await seedUser(tc.db, { name: "User 3", role: "PUBLIC" });

      const result = await graphql({
        schema,
        source: print(GetUsersDocument),
        variableValues: { take: 10, skip: 0 },
        contextValue: tc.context,
      });

      expect(result.errors).toBeUndefined();
      const data = result.data as {
        users: {
          items: Array<{ name: string; role: string }>;
          pageInfo: { totalCount: number };
        };
      };
      expect(data.users.items).toHaveLength(3);
      expect(data.users.pageInfo.totalCount).toBe(3);
      closeTestDb(tc);
    });
  });

  describe("updateMe mutation", () => {
    it("updates the current user profile", async () => {
      const currentUser: CurrentUser = {
        id: "user-1",
        email: "me@example.com",
        role: "PUBLIC",
      };
      const tc = await createTestContext({ user: currentUser });
      await seedUser(tc.db, {
        id: "user-1",
        email: "me@example.com",
        name: "Old Name",
      });

      const result = await graphql({
        schema,
        source: print(UpdateMeDocument),
        variableValues: { input: { name: "New Name" } },
        contextValue: tc.context,
      });

      expect(result.errors).toBeUndefined();
      const data = result.data as { updateMe: { name: string } };
      expect(data.updateMe.name).toBe("New Name");
      closeTestDb(tc);
    });

    it("rejects updateMe when unauthenticated", async () => {
      const tc = await createTestContext();

      const result = await graphql({
        schema,
        source: print(UpdateMeDocument),
        variableValues: { input: { name: "Hacked" } },
        contextValue: tc.context,
      });

      expect(result.errors).toBeDefined();
      expect(result.errors![0]!.extensions?.code).toBe("UNAUTHORIZED");
      closeTestDb(tc);
    });
  });
});
