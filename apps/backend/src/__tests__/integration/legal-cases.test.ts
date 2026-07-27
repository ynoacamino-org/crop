import { graphql, print } from "graphql";
import { describe, expect, it } from "vitest";
import {
  CreateLegalCaseDocument,
  DeleteLegalCaseDocument,
  GetLegalCaseDocument,
  GetLegalCasesDocument,
  UpdateLegalCaseDocument,
} from "@/__tests__/graphql/generated/test-gql";
import {
  closeTestDb,
  createTestContext,
  seedCaseType,
  seedCourt,
  seedLegalCase,
} from "@/__tests__/helpers";
import type { CurrentUser } from "@/shared/graphql/builder";
import { schema } from "@/shared/graphql/schema";

const testUser: CurrentUser = {
  id: "user-test-1",
  email: "test@example.com",
  role: "ADMIN",
};

describe("LegalCase resolvers", () => {
  describe("legalCase query", () => {
    it("returns a legal case by id", async () => {
      const tc = await createTestContext({ user: testUser });
      const court = await seedCourt(tc.db, { name: "Corte Suprema" });
      const caseType = await seedCaseType(tc.db, { name: "Civil" });
      const legalCase = await seedLegalCase(tc.db, {
        caseNumber: "CASO-001",
        caseName: "Juan vs Pedro",
        courtId: court.id,
        caseTypeId: caseType.id,
      });

      const result = await graphql({
        schema,
        source: print(GetLegalCaseDocument),
        variableValues: { id: legalCase.id },
        contextValue: tc.context,
      });

      expect(result.errors).toBeUndefined();
      const data = result.data as {
        legalCase: {
          caseNumber: string;
          caseName: string;
          court: { name: string };
          caseType: { name: string };
        };
      };
      expect(data.legalCase.caseNumber).toBe("CASO-001");
      expect(data.legalCase.caseName).toBe("Juan vs Pedro");
      expect(data.legalCase.court.name).toBe("Corte Suprema");
      expect(data.legalCase.caseType.name).toBe("Civil");
      closeTestDb(tc);
    });
  });

  describe("legalCases query", () => {
    it("returns paginated legal cases", async () => {
      const tc = await createTestContext({ user: testUser });
      await seedLegalCase(tc.db, {
        caseNumber: "CASO-001",
        caseName: "Case 1",
      });
      await seedLegalCase(tc.db, {
        caseNumber: "CASO-002",
        caseName: "Case 2",
      });

      const result = await graphql({
        schema,
        source: print(GetLegalCasesDocument),
        variableValues: { take: 10, skip: 0 },
        contextValue: tc.context,
      });

      expect(result.errors).toBeUndefined();
      const data = result.data as {
        legalCases: {
          items: Array<{ caseNumber: string }>;
          pageInfo: { totalCount: number };
        };
      };
      expect(data.legalCases.items).toHaveLength(2);
      expect(data.legalCases.pageInfo.totalCount).toBe(2);
      closeTestDb(tc);
    });
  });

  describe("createLegalCase mutation", () => {
    it("creates a legal case when authenticated", async () => {
      const tc = await createTestContext({ user: testUser });
      const court = await seedCourt(tc.db, { name: "Corte" });

      const result = await graphql({
        schema,
        source: print(CreateLegalCaseDocument),
        variableValues: {
          input: {
            caseNumber: "NEW-001",
            caseName: "New Case",
            courtId: court.id,
          },
        },
        contextValue: tc.context,
      });

      expect(result.errors).toBeUndefined();
      const data = result.data as {
        createLegalCase: { caseNumber: string; caseName: string };
      };
      expect(data.createLegalCase.caseNumber).toBe("NEW-001");
      expect(data.createLegalCase.caseName).toBe("New Case");
      closeTestDb(tc);
    });

    it("rejects createLegalCase when unauthenticated", async () => {
      const tc = await createTestContext();

      const result = await graphql({
        schema,
        source: print(CreateLegalCaseDocument),
        variableValues: {
          input: { caseNumber: "NEW-001", caseName: "New Case" },
        },
        contextValue: tc.context,
      });

      expect(result.errors).toBeDefined();
      expect(result.errors![0]!.extensions?.code).toBe("UNAUTHORIZED");
      closeTestDb(tc);
    });
  });

  describe("updateLegalCase mutation", () => {
    it("updates a legal case when authenticated", async () => {
      const tc = await createTestContext({ user: testUser });
      const legalCase = await seedLegalCase(tc.db, {
        caseNumber: "CASO-001",
        caseName: "Original",
      });

      const result = await graphql({
        schema,
        source: print(UpdateLegalCaseDocument),
        variableValues: {
          id: legalCase.id,
          input: { caseName: "Updated Case" },
        },
        contextValue: tc.context,
      });

      expect(result.errors).toBeUndefined();
      const data = result.data as { updateLegalCase: { caseName: string } };
      expect(data.updateLegalCase.caseName).toBe("Updated Case");
      closeTestDb(tc);
    });
  });

  describe("deleteLegalCase mutation", () => {
    it("deletes a legal case when authenticated", async () => {
      const tc = await createTestContext({ user: testUser });
      const legalCase = await seedLegalCase(tc.db, {
        caseNumber: "CASO-DEL",
        caseName: "To Delete",
      });

      const result = await graphql({
        schema,
        source: print(DeleteLegalCaseDocument),
        variableValues: { id: legalCase.id },
        contextValue: tc.context,
      });

      expect(result.errors).toBeUndefined();
      const data = result.data as { deleteLegalCase: { caseName: string } };
      expect(data.deleteLegalCase.caseName).toBe("To Delete");
      closeTestDb(tc);
    });
  });
});
