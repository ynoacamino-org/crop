import { graphql, print } from "graphql";
import { afterEach, describe, expect, it } from "vitest";
import {
  CreateArticleDocument,
  DeleteArticleDocument,
  GetAuditLogsDocument,
  UpdateArticleDocument,
} from "@/__tests__/graphql/generated/test-gql";
import type { TestContext } from "@/__tests__/helpers";
import {
  closeTestDb,
  createTestContext,
  seedArticle,
  seedUser,
} from "@/__tests__/helpers";
import { auditLogs } from "@/domain/db/schema";
import type { CurrentUser } from "@/shared/graphql/builder";
import { schema } from "@/shared/graphql/schema";

const adminUser: CurrentUser = {
  id: "user-admin-audit",
  email: "admin-audit@example.com",
  role: "ADMIN",
};

const regularUser: CurrentUser = {
  id: "user-regular-audit",
  email: "regular-audit@example.com",
  role: "PUBLIC",
};

describe("Audit logging", () => {
  let tc: TestContext;

  afterEach(async () => {
    if (tc) await closeTestDb(tc);
  });

  describe("createArticle mutation", () => {
    it("creates an audit log entry with CREATE action", async () => {
      tc = await createTestContext({ user: adminUser });
      await seedUser(tc.db, {
        id: adminUser.id,
        email: adminUser.email,
        role: "ADMIN",
      });

      const result = await graphql({
        schema,
        source: print(CreateArticleDocument),
        variableValues: {
          input: {
            title: "Audit Test Article",
            slug: "audit-test-article",
            content:
              "This is a test content for audit logging purposes with enough characters",
          },
        },
        contextValue: tc.context,
      });

      expect(result.errors).toBeUndefined();
      const data = result.data as {
        createArticle: { id: string; title: string };
      };
      expect(data.createArticle.title).toBe("Audit Test Article");

      const logs = await tc.db.select().from(auditLogs);
      const articleLog = logs.find(
        (l) => l.entityId === data.createArticle.id && l.action === "CREATE",
      );
      expect(articleLog).toBeDefined();
      expect(articleLog!.entityType).toBe("Article");
      expect(articleLog!.userId).toBe(adminUser.id);
      expect(articleLog!.userName).toBe(adminUser.email);
      expect(articleLog!.oldValues).toBeNull();
      expect(articleLog!.newValues).toBeDefined();

      const newValues = JSON.parse(articleLog!.newValues!);
      expect(newValues.title).toBe("Audit Test Article");
      expect(newValues.slug).toBe("audit-test-article");
    });

    it("does not create audit log when mutation fails (unauthenticated)", async () => {
      tc = await createTestContext();

      const result = await graphql({
        schema,
        source: print(CreateArticleDocument),
        variableValues: {
          input: {
            title: "Unauthorized Article",
            slug: "unauthorized",
            content:
              "This content is long enough to pass the 50 character validation check",
          },
        },
        contextValue: tc.context,
      });

      expect(result.errors).toBeDefined();
      const logs = await tc.db.select().from(auditLogs);
      expect(logs).toHaveLength(0);
    });
  });

  describe("updateArticle mutation", () => {
    it("creates an audit log entry with old and new values", async () => {
      tc = await createTestContext({ user: adminUser });
      const user = await seedUser(tc.db, {
        id: adminUser.id,
        email: adminUser.email,
        role: "ADMIN",
      });
      const article = await seedArticle(tc.db, {
        title: "Original Title",
        authorId: user.id,
      });

      const result = await graphql({
        schema,
        source: print(UpdateArticleDocument),
        variableValues: {
          id: article.id,
          input: { title: "Updated Title" },
        },
        contextValue: tc.context,
      });

      expect(result.errors).toBeUndefined();
      const data = result.data as { updateArticle: { title: string } };
      expect(data.updateArticle.title).toBe("Updated Title");

      const logs = await tc.db.select().from(auditLogs);
      const updateLog = logs.find(
        (l) => l.entityId === article.id && l.action === "UPDATE",
      );
      expect(updateLog).toBeDefined();
      expect(updateLog!.entityType).toBe("Article");
      expect(updateLog!.userId).toBe(adminUser.id);

      expect(updateLog!.oldValues).toBeDefined();
      const oldValues = JSON.parse(updateLog!.oldValues!);
      expect(oldValues.title).toBe("Original Title");

      expect(updateLog!.newValues).toBeDefined();
      const newValues = JSON.parse(updateLog!.newValues!);
      expect(newValues.title).toBe("Updated Title");
    });

    it("does not create audit log when update fails (not found)", async () => {
      tc = await createTestContext({ user: adminUser });

      const result = await graphql({
        schema,
        source: print(UpdateArticleDocument),
        variableValues: {
          id: "non-existent-id",
          input: { title: "Updated" },
        },
        contextValue: tc.context,
      });

      expect(result.errors).toBeDefined();
      const logs = await tc.db.select().from(auditLogs);
      expect(logs).toHaveLength(0);
    });
  });

  describe("deleteArticle mutation", () => {
    it("creates an audit log entry with old values and DELETE action", async () => {
      tc = await createTestContext({ user: adminUser });
      const user = await seedUser(tc.db, {
        id: adminUser.id,
        email: adminUser.email,
        role: "ADMIN",
      });
      const article = await seedArticle(tc.db, {
        title: "To Be Deleted",
        authorId: user.id,
      });

      const result = await graphql({
        schema,
        source: print(DeleteArticleDocument),
        variableValues: { id: article.id },
        contextValue: tc.context,
      });

      expect(result.errors).toBeUndefined();
      const data = result.data as { deleteArticle: { title: string } };
      expect(data.deleteArticle.title).toBe("To Be Deleted");

      const logs = await tc.db.select().from(auditLogs);
      const deleteLog = logs.find(
        (l) => l.entityId === article.id && l.action === "DELETE",
      );
      expect(deleteLog).toBeDefined();
      expect(deleteLog!.entityType).toBe("Article");
      expect(deleteLog!.userId).toBe(adminUser.id);

      expect(deleteLog!.oldValues).toBeDefined();
      const oldValues = JSON.parse(deleteLog!.oldValues!);
      expect(oldValues.title).toBe("To Be Deleted");

      expect(deleteLog!.newValues).toBeNull();
    });
  });

  describe("multiple mutations", () => {
    it("creates separate audit logs for create, update, and delete", async () => {
      tc = await createTestContext({ user: adminUser });
      await seedUser(tc.db, {
        id: adminUser.id,
        email: adminUser.email,
        role: "ADMIN",
      });

      const createResult = await graphql({
        schema,
        source: print(CreateArticleDocument),
        variableValues: {
          input: {
            title: "Multi Test",
            slug: "multi-test",
            content:
              "This content is long enough to pass the 50 character validation check",
          },
        },
        contextValue: tc.context,
      });
      expect(createResult.errors).toBeUndefined();
      const createdId = (createResult.data as { createArticle: { id: string } })
        .createArticle.id;

      await graphql({
        schema,
        source: print(UpdateArticleDocument),
        variableValues: {
          id: createdId,
          input: { title: "Multi Test Updated" },
        },
        contextValue: tc.context,
      });

      await graphql({
        schema,
        source: print(DeleteArticleDocument),
        variableValues: { id: createdId },
        contextValue: tc.context,
      });

      const logs = await tc.db.select().from(auditLogs);
      const entityLogs = logs.filter((l) => l.entityId === createdId);
      expect(entityLogs).toHaveLength(3);

      const actions = entityLogs.map((l) => l.action).sort();
      expect(actions).toEqual(["CREATE", "DELETE", "UPDATE"]);
    });
  });
});

describe("Audit logs query", () => {
  let tc: TestContext;

  afterEach(async () => {
    if (tc) await closeTestDb(tc);
  });

  it("returns audit logs for admin users", async () => {
    tc = await createTestContext({ user: adminUser });
    await seedUser(tc.db, {
      id: adminUser.id,
      email: adminUser.email,
      role: "ADMIN",
    });

    await graphql({
      schema,
      source: print(CreateArticleDocument),
      variableValues: {
        input: {
          title: "Query Test",
          slug: "query-test",
          content:
            "This content is long enough to pass the 50 character validation check",
        },
      },
      contextValue: tc.context,
    });

    await tc.db.select().from(auditLogs);

    const result = await graphql({
      schema,
      source: print(GetAuditLogsDocument),
      variableValues: { take: 10, skip: 0 },
      contextValue: tc.context,
    });

    expect(result.errors).toBeUndefined();
    const data = result.data as {
      auditLogs: {
        items: Array<{
          entityType: string;
          action: string;
          newValues: string | null;
        }>;
        pageInfo: { totalCount: number };
      };
    };
    expect(data.auditLogs.items.length).toBeGreaterThanOrEqual(1);
    expect(data.auditLogs.pageInfo.totalCount).toBeGreaterThanOrEqual(1);

    const articleLog = data.auditLogs.items.find(
      (i) => i.entityType === "Article",
    );
    expect(articleLog).toBeDefined();
    expect(articleLog!.action).toBe("CREATE");
  });

  it("rejects audit logs query for non-admin users", async () => {
    tc = await createTestContext({ user: regularUser });
    await seedUser(tc.db, {
      id: regularUser.id,
      email: regularUser.email,
      role: "PUBLIC",
    });

    const result = await graphql({
      schema,
      source: print(GetAuditLogsDocument),
      variableValues: { take: 10, skip: 0 },
      contextValue: tc.context,
    });

    expect(result.errors).toBeDefined();
    expect(result.errors![0]!.extensions?.code).toBe("UNAUTHORIZED");
  });

  it("rejects audit logs query for unauthenticated users", async () => {
    tc = await createTestContext();

    const result = await graphql({
      schema,
      source: print(GetAuditLogsDocument),
      variableValues: { take: 10, skip: 0 },
      contextValue: tc.context,
    });

    expect(result.errors).toBeDefined();
    expect(result.errors![0]!.extensions?.code).toBe("UNAUTHORIZED");
  });

  it("filters audit logs by entity type", async () => {
    tc = await createTestContext({ user: adminUser });
    await seedUser(tc.db, {
      id: adminUser.id,
      email: adminUser.email,
      role: "ADMIN",
    });

    await graphql({
      schema,
      source: print(CreateArticleDocument),
      variableValues: {
        input: {
          title: "Filter Test",
          slug: "filter-test",
          content:
            "This content is long enough to pass the 50 character validation check",
        },
      },
      contextValue: tc.context,
    });

    await tc.db.select().from(auditLogs);

    const result = await graphql({
      schema,
      source: print(GetAuditLogsDocument),
      variableValues: {
        take: 10,
        skip: 0,
        filter: { entityType: { eq: "Article" } },
      },
      contextValue: tc.context,
    });

    expect(result.errors).toBeUndefined();
    const data = result.data as {
      auditLogs: {
        items: Array<{ entityType: string }>;
      };
    };
    expect(data.auditLogs.items.length).toBeGreaterThanOrEqual(1);
    expect(data.auditLogs.items.every((i) => i.entityType === "Article")).toBe(
      true,
    );
  });

  it("paginates audit logs correctly", async () => {
    tc = await createTestContext({ user: adminUser });
    await seedUser(tc.db, {
      id: adminUser.id,
      email: adminUser.email,
      role: "ADMIN",
    });

    for (let i = 0; i < 3; i++) {
      await graphql({
        schema,
        source: print(CreateArticleDocument),
        variableValues: {
          input: {
            title: `Pagination Test ${i}`,
            slug: `pagination-test-${i}`,
            content:
              "This content is long enough to pass the 50 character validation check",
          },
        },
        contextValue: tc.context,
      });
    }

    await tc.db.select().from(auditLogs);

    const page1 = await graphql({
      schema,
      source: print(GetAuditLogsDocument),
      variableValues: { take: 2, skip: 0 },
      contextValue: tc.context,
    });

    expect(page1.errors).toBeUndefined();
    const data1 = page1.data as {
      auditLogs: {
        items: Array<unknown>;
        pageInfo: {
          totalCount: number;
          hasNextPage: boolean;
          hasPreviousPage: boolean;
        };
      };
    };
    expect(data1.auditLogs.items).toHaveLength(2);
    expect(data1.auditLogs.pageInfo.totalCount).toBeGreaterThanOrEqual(3);
    expect(data1.auditLogs.pageInfo.hasNextPage).toBe(true);
    expect(data1.auditLogs.pageInfo.hasPreviousPage).toBe(false);

    const page2 = await graphql({
      schema,
      source: print(GetAuditLogsDocument),
      variableValues: { take: 2, skip: 2 },
      contextValue: tc.context,
    });

    expect(page2.errors).toBeUndefined();
    const data2 = page2.data as {
      auditLogs: {
        items: Array<unknown>;
        pageInfo: { hasNextPage: boolean; hasPreviousPage: boolean };
      };
    };
    expect(data2.auditLogs.pageInfo.hasPreviousPage).toBe(true);
  });
});
