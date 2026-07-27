import { graphql, print } from "graphql";
import { describe, expect, it } from "vitest";
import {
  GetCategoriesDocument,
  GetTagsDocument,
} from "@/__tests__/graphql/generated/test-gql";
import {
  closeTestDb,
  createTestContext,
  seedCategory,
  seedTag,
} from "@/__tests__/helpers";
import { schema } from "@/shared/graphql/schema";

describe("Categories and Tags resolvers", () => {
  describe("categories query", () => {
    it("returns all categories", async () => {
      const tc = await createTestContext();
      await seedCategory(tc.db, {
        name: "Derecho Civil",
        slug: "derecho-civil",
      });
      await seedCategory(tc.db, {
        name: "Derecho Penal",
        slug: "derecho-penal",
      });

      const result = await graphql({
        schema,
        source: print(GetCategoriesDocument),
        contextValue: tc.context,
      });

      expect(result.errors).toBeUndefined();
      const data = result.data as {
        categories: Array<{ name: string; slug: string }>;
      };
      expect(data.categories).toHaveLength(2);
      expect(data.categories.map((c) => c.name)).toContain("Derecho Civil");
      closeTestDb(tc);
    });

    it("returns empty array when no categories exist", async () => {
      const tc = await createTestContext();

      const result = await graphql({
        schema,
        source: print(GetCategoriesDocument),
        contextValue: tc.context,
      });

      expect(result.errors).toBeUndefined();
      const data = result.data as { categories: unknown[] };
      expect(data.categories).toHaveLength(0);
      closeTestDb(tc);
    });
  });

  describe("tags query", () => {
    it("returns all tags", async () => {
      const tc = await createTestContext();
      await seedTag(tc.db, { name: "jurisprudencia", slug: "jurisprudencia" });
      await seedTag(tc.db, { name: "doctrina", slug: "doctrina" });

      const result = await graphql({
        schema,
        source: print(GetTagsDocument),
        contextValue: tc.context,
      });

      expect(result.errors).toBeUndefined();
      const data = result.data as {
        tags: Array<{ name: string; slug: string }>;
      };
      expect(data.tags).toHaveLength(2);
      expect(data.tags.map((t) => t.name)).toContain("jurisprudencia");
      closeTestDb(tc);
    });

    it("returns empty array when no tags exist", async () => {
      const tc = await createTestContext();

      const result = await graphql({
        schema,
        source: print(GetTagsDocument),
        contextValue: tc.context,
      });

      expect(result.errors).toBeUndefined();
      const data = result.data as { tags: unknown[] };
      expect(data.tags).toHaveLength(0);
      closeTestDb(tc);
    });
  });
});
