import { graphql, print } from "graphql";
import { describe, expect, it } from "vitest";
import {
  GetCourtDocument,
  GetCourtsDocument,
} from "@/__tests__/graphql/generated/test-gql";
import { closeTestDb, createTestContext, seedCourt } from "@/__tests__/helpers";
import { schema } from "@/shared/graphql/schema";

describe("Court resolvers", () => {
  describe("court query", () => {
    it("returns a court by id", async () => {
      const tc = await createTestContext();
      const court = await seedCourt(tc.db, {
        name: "Corte Suprema",
        type: "SUPREMA",
        jurisdiction: "NACIONAL",
      });

      const result = await graphql({
        schema,
        source: print(GetCourtDocument),
        variableValues: { id: court.id },
        contextValue: tc.context,
      });

      expect(result.errors).toBeUndefined();
      const data = result.data as {
        court: { name: string; type: string; jurisdiction: string };
      };
      expect(data.court.name).toBe("Corte Suprema");
      expect(data.court.type).toBe("SUPREMA");
      expect(data.court.jurisdiction).toBe("NACIONAL");
      closeTestDb(tc);
    });

    it("returns null for a non-existent court", async () => {
      const tc = await createTestContext();

      const result = await graphql({
        schema,
        source: print(GetCourtDocument),
        variableValues: { id: "non-existent" },
        contextValue: tc.context,
      });

      const data = result.data as { court: null };
      expect(data.court).toBeNull();
      closeTestDb(tc);
    });
  });

  describe("courts query", () => {
    it("returns paginated courts", async () => {
      const tc = await createTestContext();
      await seedCourt(tc.db, { name: "Court 1", type: "SUPREMA" });
      await seedCourt(tc.db, { name: "Court 2", type: "SUPERIOR" });
      await seedCourt(tc.db, { name: "Court 3", type: "PRIMERA_INSTANCIA" });

      const result = await graphql({
        schema,
        source: print(GetCourtsDocument),
        variableValues: { take: 10, skip: 0 },
        contextValue: tc.context,
      });

      expect(result.errors).toBeUndefined();
      const data = result.data as {
        courts: {
          items: Array<{ name: string }>;
          pageInfo: { totalCount: number };
        };
      };
      expect(data.courts.items).toHaveLength(3);
      expect(data.courts.pageInfo.totalCount).toBe(3);
      closeTestDb(tc);
    });

    it("respects pagination with take and skip", async () => {
      const tc = await createTestContext();
      await seedCourt(tc.db, { name: "Court 1" });
      await seedCourt(tc.db, { name: "Court 2" });
      await seedCourt(tc.db, { name: "Court 3" });

      const result = await graphql({
        schema,
        source: print(GetCourtsDocument),
        variableValues: { take: 2, skip: 0 },
        contextValue: tc.context,
      });

      expect(result.errors).toBeUndefined();
      const data = result.data as {
        courts: {
          items: Array<{ name: string }>;
          pageInfo: { hasNextPage: boolean };
        };
      };
      expect(data.courts.items).toHaveLength(2);
      expect(data.courts.pageInfo.hasNextPage).toBe(true);
      closeTestDb(tc);
    });
  });
});
