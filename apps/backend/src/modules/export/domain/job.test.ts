import { describe, expect, it } from "vitest";
import { CreateExportJobSchema } from "@/modules/export/domain/job";

describe("CreateExportJobSchema", () => {
  it("accepts a valid type without optional fields", () => {
    expect(
      CreateExportJobSchema.safeParse({ type: "legal-cases-csv" }).success,
    ).toBe(true);
  });

  it("accepts all valid export types", () => {
    for (const type of ["legal-cases-csv", "articles-csv", "courts-csv"]) {
      expect(CreateExportJobSchema.safeParse({ type }).success).toBe(true);
    }
  });

  it("rejects an invalid type", () => {
    expect(
      CreateExportJobSchema.safeParse({ type: "invalid-type" }).success,
    ).toBe(false);
  });

  it("accepts filters as a string-keyed record", () => {
    const result = CreateExportJobSchema.safeParse({
      type: "articles-csv",
      filters: { status: "PUBLISHED", authorId: "123" },
    });
    expect(result.success).toBe(true);
  });

  it("accepts columns as a string array", () => {
    const result = CreateExportJobSchema.safeParse({
      type: "courts-csv",
      columns: ["name", "type", "jurisdiction"],
    });
    expect(result.success).toBe(true);
  });

  it("accepts both filters and columns together", () => {
    const result = CreateExportJobSchema.safeParse({
      type: "legal-cases-csv",
      filters: { jurisdiction: "NACIONAL" },
      columns: ["caseNumber", "caseName"],
    });
    expect(result.success).toBe(true);
  });

  it("rejects filters with a non-object type", () => {
    expect(
      CreateExportJobSchema.safeParse({
        type: "articles-csv",
        filters: "not-an-object",
      }).success,
    ).toBe(false);
  });

  it("rejects columns with non-string elements", () => {
    expect(
      CreateExportJobSchema.safeParse({
        type: "articles-csv",
        columns: [123, 456],
      }).success,
    ).toBe(false);
  });
});
