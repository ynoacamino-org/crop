import { graphql, print } from "graphql";
import { describe, expect, it } from "vitest";
import {
  CreateCaseTypeDocument,
  DeleteCaseTypeDocument,
  GetCaseTypeDocument,
  GetCaseTypesDocument,
  UpdateCaseTypeDocument,
} from "@/__tests__/graphql/generated/test-gql";
import {
  closeTestDb,
  createTestContext,
  seedCaseType,
} from "@/__tests__/helpers";
import type { CurrentUser } from "@/shared/graphql/builder";
import { schema } from "@/shared/graphql/schema";

const testUser: CurrentUser = {
  id: "user-test-1",
  email: "test@example.com",
  role: "ADMIN",
};

describe("CaseType resolvers", () => {
  describe("caseType query", () => {
    it("returns a case type by id", async () => {
      const tc = await createTestContext({ user: testUser });
      const caseType = await seedCaseType(tc.db, {
        name: "Civil",
        slug: "civil",
      });

      const result = await graphql({
        schema,
        source: print(GetCaseTypeDocument),
        variableValues: { id: caseType.id },
        contextValue: tc.context,
      });

      expect(result.errors).toBeUndefined();
      const data = result.data as { caseType: { name: string; slug: string } };
      expect(data.caseType.name).toBe("Civil");
      expect(data.caseType.slug).toBe("civil");
      closeTestDb(tc);
    });

    it("returns null for a non-existent case type", async () => {
      const tc = await createTestContext({ user: testUser });

      const result = await graphql({
        schema,
        source: print(GetCaseTypeDocument),
        variableValues: { id: "non-existent" },
        contextValue: tc.context,
      });

      const data = result.data as { caseType: null };
      expect(data.caseType).toBeNull();
      closeTestDb(tc);
    });
  });

  describe("caseTypes query", () => {
    it("returns all case types", async () => {
      const tc = await createTestContext({ user: testUser });
      await seedCaseType(tc.db, { name: "Civil", slug: "civil" });
      await seedCaseType(tc.db, { name: "Penal", slug: "penal" });

      const result = await graphql({
        schema,
        source: print(GetCaseTypesDocument),
        variableValues: { take: 50, skip: 0 },
        contextValue: tc.context,
      });

      expect(result.errors).toBeUndefined();
      const data = result.data as {
        caseTypes: { items: Array<{ name: string }> };
      };
      expect(data.caseTypes.items).toHaveLength(2);
      closeTestDb(tc);
    });
  });

  describe("createCaseType mutation", () => {
    it("creates a case type when authenticated", async () => {
      const tc = await createTestContext({ user: testUser });

      const result = await graphql({
        schema,
        source: print(CreateCaseTypeDocument),
        variableValues: {
          input: { name: "Laboral", slug: "laboral", color: "#3B82F6" },
        },
        contextValue: tc.context,
      });

      expect(result.errors).toBeUndefined();
      const data = result.data as {
        createCaseType: { name: string; slug: string; color: string };
      };
      expect(data.createCaseType.name).toBe("Laboral");
      expect(data.createCaseType.slug).toBe("laboral");
      expect(data.createCaseType.color).toBe("#3B82F6");
      closeTestDb(tc);
    });

    it("rejects createCaseType when unauthenticated", async () => {
      const tc = await createTestContext();

      const result = await graphql({
        schema,
        source: print(CreateCaseTypeDocument),
        variableValues: {
          input: { name: "Laboral", slug: "laboral" },
        },
        contextValue: tc.context,
      });

      expect(result.errors).toBeDefined();
      expect(result.errors![0]!.extensions?.code).toBe("UNAUTHORIZED");
      closeTestDb(tc);
    });
  });

  describe("updateCaseType mutation", () => {
    it("updates a case type when authenticated", async () => {
      const tc = await createTestContext({ user: testUser });
      const caseType = await seedCaseType(tc.db, {
        name: "Original",
        slug: "original",
      });

      const result = await graphql({
        schema,
        source: print(UpdateCaseTypeDocument),
        variableValues: {
          id: caseType.id,
          input: { name: "Updated", color: "#FF0000" },
        },
        contextValue: tc.context,
      });

      expect(result.errors).toBeUndefined();
      const data = result.data as {
        updateCaseType: { name: string; color: string };
      };
      expect(data.updateCaseType.name).toBe("Updated");
      expect(data.updateCaseType.color).toBe("#FF0000");
      closeTestDb(tc);
    });
  });

  describe("deleteCaseType mutation", () => {
    it("deletes a case type when authenticated", async () => {
      const tc = await createTestContext({ user: testUser });
      const caseType = await seedCaseType(tc.db, {
        name: "To Delete",
        slug: "to-delete",
      });

      const result = await graphql({
        schema,
        source: print(DeleteCaseTypeDocument),
        variableValues: { id: caseType.id },
        contextValue: tc.context,
      });

      expect(result.errors).toBeUndefined();
      const data = result.data as { deleteCaseType: { name: string } };
      expect(data.deleteCaseType.name).toBe("To Delete");
      closeTestDb(tc);
    });
  });
});
