import { graphql, print } from "graphql";
import { describe, expect, it } from "vitest";
import {
  CreateArticleDocument,
  DeleteArticleDocument,
  GetArticleByIdDocument,
  GetArticlesDocument,
  UpdateArticleDocument,
} from "@/__tests__/graphql/generated/test-gql";
import {
  closeTestDb,
  createTestContext,
  seedArticle,
  seedUser,
} from "@/__tests__/helpers";
import type { CurrentUser } from "@/shared/graphql/builder";
import { schema } from "@/shared/graphql/schema";

const testUser: CurrentUser = {
  id: "user-test-1",
  email: "test@example.com",
  role: "ADMIN",
};

describe("Article resolvers", () => {
  describe("article query", () => {
    it("returns an article by id", async () => {
      const tc = await createTestContext({ user: testUser });
      const user = await seedUser(tc.db, {
        id: testUser.id,
        email: testUser.email,
        role: "ADMIN",
      });
      const article = await seedArticle(tc.db, {
        title: "Test Article",
        authorId: user.id,
        status: "PUBLISHED",
      });

      const result = await graphql({
        schema,
        source: print(GetArticleByIdDocument),
        variableValues: { id: article.id },
        contextValue: tc.context,
      });

      expect(result.errors).toBeUndefined();
      const data = result.data as {
        article: { title: string; status: string; author: { email: string } };
      };
      expect(data.article.title).toBe("Test Article");
      expect(data.article.status).toBe("PUBLISHED");
      expect(data.article.author.email).toBe(testUser.email);
      closeTestDb(tc);
    });

    it("returns null for a non-existent article", async () => {
      const tc = await createTestContext({ user: testUser });

      const result = await graphql({
        schema,
        source: print(GetArticleByIdDocument),
        variableValues: { id: "non-existent" },
        contextValue: tc.context,
      });

      const data = result.data as { article: null };
      expect(data.article).toBeNull();
      closeTestDb(tc);
    });

    it("returns null when querying without id or slug", async () => {
      const tc = await createTestContext({ user: testUser });

      const result = await graphql({
        schema,
        source: print(GetArticleByIdDocument),
        variableValues: {},
        contextValue: tc.context,
      });

      expect(result.errors).toBeDefined();
      closeTestDb(tc);
    });
  });

  describe("articles query", () => {
    it("returns paginated articles", async () => {
      const tc = await createTestContext({ user: testUser });
      const user = await seedUser(tc.db, { id: testUser.id, role: "ADMIN" });

      await seedArticle(tc.db, {
        title: "Article 1",
        authorId: user.id,
        status: "PUBLISHED",
      });
      await seedArticle(tc.db, {
        title: "Article 2",
        authorId: user.id,
        status: "DRAFT",
      });
      await seedArticle(tc.db, {
        title: "Article 3",
        authorId: user.id,
        status: "PUBLISHED",
      });

      const result = await graphql({
        schema,
        source: print(GetArticlesDocument),
        variableValues: { take: 10, skip: 0 },
        contextValue: tc.context,
      });

      expect(result.errors).toBeUndefined();
      const data = result.data as {
        articles: {
          items: Array<{ title: string }>;
          pageInfo: { totalCount: number };
        };
      };
      expect(data.articles.items).toHaveLength(3);
      expect(data.articles.pageInfo.totalCount).toBe(3);
      closeTestDb(tc);
    });

    it("filters articles by status", async () => {
      const tc = await createTestContext({ user: testUser });
      const user = await seedUser(tc.db, { id: testUser.id, role: "ADMIN" });

      await seedArticle(tc.db, {
        title: "Published",
        authorId: user.id,
        status: "PUBLISHED",
      });
      await seedArticle(tc.db, {
        title: "Draft",
        authorId: user.id,
        status: "DRAFT",
      });

      const result = await graphql({
        schema,
        source: print(GetArticlesDocument),
        variableValues: {
          take: 10,
          skip: 0,
          filter: { status: { eq: "PUBLISHED" } },
        },
        contextValue: tc.context,
      });

      expect(result.errors).toBeUndefined();
      const data = result.data as {
        articles: { items: Array<{ title: string; status: string }> };
      };
      expect(data.articles.items).toHaveLength(1);
      expect(data!.articles!.items![0]!.status).toBe("PUBLISHED");
      closeTestDb(tc);
    });
  });

  describe("createArticle mutation", () => {
    it("creates an article when authenticated", async () => {
      const tc = await createTestContext({ user: testUser });
      await seedUser(tc.db, { id: testUser.id, role: "ADMIN" });

      const result = await graphql({
        schema,
        source: print(CreateArticleDocument),
        variableValues: {
          input: {
            title: "New Article",
            slug: "new-article",
            content:
              "This is the full content of the new article with enough text to pass the minimum length validation.",
          },
        },
        contextValue: tc.context,
      });

      expect(result.errors).toBeUndefined();
      const data = result.data as {
        createArticle: { title: string; content: string; status: string };
      };
      expect(data.createArticle.title).toBe("New Article");
      expect(data.createArticle.content).toBe(
        "This is the full content of the new article with enough text to pass the minimum length validation.",
      );
      expect(data.createArticle.status).toBe("DRAFT");
      closeTestDb(tc);
    });

    it("rejects createArticle when unauthenticated", async () => {
      const tc = await createTestContext();

      const result = await graphql({
        schema,
        source: print(CreateArticleDocument),
        variableValues: {
          input: {
            title: "New Article",
            slug: "new-article-unauth",
            content:
              "This is the full content of the new article with enough text to pass the minimum length validation.",
          },
        },
        contextValue: tc.context,
      });

      expect(result.errors).toBeDefined();
      expect(result.errors![0]!.extensions?.code).toBe("UNAUTHORIZED");
      closeTestDb(tc);
    });
  });

  describe("updateArticle mutation", () => {
    it("updates an article when authenticated", async () => {
      const tc = await createTestContext({ user: testUser });
      const user = await seedUser(tc.db, { id: testUser.id, role: "ADMIN" });
      const article = await seedArticle(tc.db, {
        title: "Original",
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
      closeTestDb(tc);
    });

    it("returns error when updating non-existent article", async () => {
      const tc = await createTestContext({ user: testUser });

      const result = await graphql({
        schema,
        source: print(UpdateArticleDocument),
        variableValues: {
          id: "non-existent",
          input: { title: "Updated" },
        },
        contextValue: tc.context,
      });

      expect(result.errors).toBeDefined();
      expect(result.errors![0]!.extensions?.code).toBe("NOT_FOUND");
      closeTestDb(tc);
    });
  });

  describe("deleteArticle mutation", () => {
    it("deletes an article when authenticated", async () => {
      const tc = await createTestContext({ user: testUser });
      const user = await seedUser(tc.db, { id: testUser.id, role: "ADMIN" });
      const article = await seedArticle(tc.db, {
        title: "To Delete",
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
      expect(data.deleteArticle.title).toBe("To Delete");
      closeTestDb(tc);
    });

    it("rejects deleteArticle when unauthenticated", async () => {
      const tc = await createTestContext();

      const result = await graphql({
        schema,
        source: print(DeleteArticleDocument),
        variableValues: { id: "any-id" },
        contextValue: tc.context,
      });

      expect(result.errors).toBeDefined();
      expect(result.errors![0]!.extensions?.code).toBe("UNAUTHORIZED");
      closeTestDb(tc);
    });
  });
});
