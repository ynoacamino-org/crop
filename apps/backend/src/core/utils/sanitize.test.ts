import { describe, expect, it } from "vitest";
import { sanitize } from "@/core/utils/sanitize";

describe("sanitize", () => {
  it("converts null to undefined", () => {
    expect(sanitize(null)).toBeUndefined();
  });

  it("returns primitives unchanged", () => {
    expect(sanitize("hello")).toBe("hello");
    expect(sanitize(42)).toBe(42);
    expect(sanitize(true)).toBe(true);
    expect(sanitize(undefined)).toBeUndefined();
  });

  it("replaces null values with undefined in object properties", () => {
    const result = sanitize({ a: 1, b: null, c: "test" });
    expect(result).toEqual({ a: 1, c: "test" });
    expect(result.b).toBeUndefined();
  });

  it("recursively sanitizes nested objects", () => {
    const result = sanitize({
      outer: {
        inner: null,
        value: "keep",
      },
    });
    expect(result).toEqual({ outer: { value: "keep" } });
  });

  it("converts null to undefined inside arrays", () => {
    const result = sanitize([1, null, "test", null]);
    expect(result).toEqual([1, undefined, "test", undefined]);
  });

  it("converts null to undefined inside arrays of objects", () => {
    const result = sanitize([
      { a: 1, b: null },
      { c: null, d: 2 },
    ]);
    expect(result).toEqual([
      { a: 1, b: undefined },
      { c: undefined, d: 2 },
    ]);
  });

  it("handles deeply nested objects", () => {
    const result = sanitize({
      level1: {
        level2: {
          level3: null,
          keep: "value",
        },
      },
    });
    expect(result).toEqual({
      level1: {
        level2: { keep: "value" },
      },
    });
  });

  it("handles empty arrays", () => {
    expect(sanitize([])).toEqual([]);
  });

  it("handles empty objects", () => {
    expect(sanitize({})).toEqual({});
  });

  it("does not mutate the original object", () => {
    const original = { a: 1, b: null };
    sanitize(original);
    expect(original).toEqual({ a: 1, b: null });
  });
});
