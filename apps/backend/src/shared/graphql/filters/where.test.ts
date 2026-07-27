import { describe, expect, it } from "vitest";
import { buildDrizzleWhere } from "@/shared/graphql/filters/where";

describe("buildDrizzleWhere", () => {
  it("returns undefined when filter is null", () => {
    expect(buildDrizzleWhere(null)).toBeUndefined();
  });

  it("returns undefined when filter is undefined", () => {
    expect(buildDrizzleWhere(undefined)).toBeUndefined();
  });

  it("returns undefined when filter is an empty object", () => {
    expect(buildDrizzleWhere({})).toBeUndefined();
  });

  it("builds an eq filter", () => {
    expect(buildDrizzleWhere({ name: { eq: "test" } })).toEqual({
      name: { eq: "test" },
    });
  });

  it("builds a contains filter as like with wildcards on both sides", () => {
    expect(buildDrizzleWhere({ name: { contains: "test" } })).toEqual({
      name: { like: "%test%" },
    });
  });

  it("builds a startsWith filter as like with a trailing wildcard", () => {
    expect(buildDrizzleWhere({ name: { startsWith: "test" } })).toEqual({
      name: { like: "test%" },
    });
  });

  it("builds an endsWith filter as like with a leading wildcard", () => {
    expect(buildDrizzleWhere({ name: { endsWith: "test" } })).toEqual({
      name: { like: "%test" },
    });
  });

  it("builds a gt filter", () => {
    expect(buildDrizzleWhere({ age: { gt: 18 } })).toEqual({ age: { gt: 18 } });
  });

  it("builds a gte filter", () => {
    expect(buildDrizzleWhere({ age: { gte: 18 } })).toEqual({
      age: { gte: 18 },
    });
  });

  it("builds a lt filter", () => {
    expect(buildDrizzleWhere({ age: { lt: 65 } })).toEqual({ age: { lt: 65 } });
  });

  it("builds a lte filter", () => {
    expect(buildDrizzleWhere({ age: { lte: 65 } })).toEqual({
      age: { lte: 65 },
    });
  });

  it("builds a not filter as ne", () => {
    expect(buildDrizzleWhere({ status: { not: "deleted" } })).toEqual({
      status: { ne: "deleted" },
    });
  });

  it("builds an in filter", () => {
    expect(
      buildDrizzleWhere({ status: { in: ["active", "pending"] } }),
    ).toEqual({
      status: { in: ["active", "pending"] },
    });
  });

  it("resolves enum fields using only eq", () => {
    const enumFields = new Set(["status", "role"]);
    const result = buildDrizzleWhere({ status: { eq: "ACTIVE" } }, enumFields);
    expect(result).toEqual({ status: { eq: "ACTIVE" } });
  });

  it("handles multiple fields at once", () => {
    const result = buildDrizzleWhere({
      name: { contains: "test" },
      age: { gte: 18 },
    });
    expect(result).toEqual({
      name: { like: "%test%" },
      age: { gte: 18 },
    });
  });

  it("ignores fields with null values", () => {
    expect(
      buildDrizzleWhere({
        name: null as unknown as Record<string, unknown>,
        age: undefined as unknown as Record<string, unknown>,
      }),
    ).toBeUndefined();
  });

  it("ignores operators whose value is undefined", () => {
    expect(buildDrizzleWhere({ name: { eq: undefined } })).toBeUndefined();
  });
});
