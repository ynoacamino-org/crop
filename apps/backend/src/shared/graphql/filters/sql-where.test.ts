import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { describe, expect, it } from "vitest";
import { buildDrizzleSqlWhere } from "@/shared/graphql/filters/sql-where";

const testTable = sqliteTable("test", {
  id: text("id").primaryKey(),
  name: text("name"),
  status: text("status"),
  age: integer("age"),
});

describe("buildDrizzleSqlWhere", () => {
  it("returns undefined when filter is null", () => {
    expect(buildDrizzleSqlWhere(null, {})).toBeUndefined();
  });

  it("returns undefined when filter is undefined", () => {
    expect(buildDrizzleSqlWhere(undefined, {})).toBeUndefined();
  });

  it("returns undefined when filter is an empty object", () => {
    expect(buildDrizzleSqlWhere({}, {})).toBeUndefined();
  });

  it("returns undefined when the field is not in the columns map", () => {
    expect(
      buildDrizzleSqlWhere({ nonexistent: { eq: "test" } }, {}),
    ).toBeUndefined();
  });

  it("builds a condition for eq", () => {
    const result = buildDrizzleSqlWhere(
      { name: { eq: "test" } },
      { name: testTable.name },
    );
    expect(result).toBeDefined();
  });

  it("builds a condition for not", () => {
    const result = buildDrizzleSqlWhere(
      { name: { not: "test" } },
      { name: testTable.name },
    );
    expect(result).toBeDefined();
  });

  it("builds a condition for gt", () => {
    const result = buildDrizzleSqlWhere(
      { age: { gt: 18 } },
      { age: testTable.age },
    );
    expect(result).toBeDefined();
  });

  it("builds a condition for gte", () => {
    const result = buildDrizzleSqlWhere(
      { age: { gte: 18 } },
      { age: testTable.age },
    );
    expect(result).toBeDefined();
  });

  it("builds a condition for lt", () => {
    const result = buildDrizzleSqlWhere(
      { age: { lt: 65 } },
      { age: testTable.age },
    );
    expect(result).toBeDefined();
  });

  it("builds a condition for lte", () => {
    const result = buildDrizzleSqlWhere(
      { age: { lte: 65 } },
      { age: testTable.age },
    );
    expect(result).toBeDefined();
  });

  it("builds a condition for in", () => {
    const result = buildDrizzleSqlWhere(
      { status: { in: ["active", "pending"] } },
      { status: testTable.status },
    );
    expect(result).toBeDefined();
  });

  it("builds a condition for notIn", () => {
    const result = buildDrizzleSqlWhere(
      { status: { notIn: ["deleted"] } },
      { status: testTable.status },
    );
    expect(result).toBeDefined();
  });

  it("builds a condition for contains", () => {
    const result = buildDrizzleSqlWhere(
      { name: { contains: "test" } },
      { name: testTable.name },
    );
    expect(result).toBeDefined();
  });

  it("builds a condition for startsWith", () => {
    const result = buildDrizzleSqlWhere(
      { name: { startsWith: "test" } },
      { name: testTable.name },
    );
    expect(result).toBeDefined();
  });

  it("builds a condition for endsWith", () => {
    const result = buildDrizzleSqlWhere(
      { name: { endsWith: "test" } },
      { name: testTable.name },
    );
    expect(result).toBeDefined();
  });

  it("uses only eq for enum fields", () => {
    const enumFields = new Set(["status"]);
    const result = buildDrizzleSqlWhere(
      { status: { eq: "ACTIVE" } },
      { status: testTable.status },
      enumFields,
    );
    expect(result).toBeDefined();
  });

  it("combines multiple conditions with AND", () => {
    const result = buildDrizzleSqlWhere(
      { name: { eq: "test" }, age: { gte: 18 } },
      { name: testTable.name, age: testTable.age },
    );
    expect(result).toBeDefined();
  });

  it("returns undefined when all operator values are undefined", () => {
    const result = buildDrizzleSqlWhere(
      { name: { eq: undefined } },
      { name: testTable.name },
    );
    expect(result).toBeUndefined();
  });

  it("returns undefined when all operator values are null", () => {
    const result = buildDrizzleSqlWhere(
      { name: { eq: null } },
      { name: testTable.name },
    );
    expect(result).toBeUndefined();
  });
});
