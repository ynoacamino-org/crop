import { describe, expect, it } from "vitest";
import { generateCaseSlug } from "@/core/utils/generate-slug";

describe("generateCaseSlug", () => {
  it("generates a basic slug from name and case number", () => {
    expect(generateCaseSlug("Caso de Prueba", "123-2024")).toBe(
      "caso-de-prueba-123-2024",
    );
  });

  it("converts the name to lowercase", () => {
    expect(generateCaseSlug("CASO TEST", "001")).toBe("caso-test-001");
  });

  it("strips accents and diacritics", () => {
    expect(generateCaseSlug("Caso con Acentos", "001")).toBe(
      "caso-con-acentos-001",
    );
  });

  it("removes special characters from the name", () => {
    expect(generateCaseSlug("Caso!@#$%^&*()", "001")).toBe("caso-001");
  });

  it("replaces spaces with hyphens", () => {
    expect(generateCaseSlug("Caso De Prueba Largo", "001")).toBe(
      "caso-de-prueba-largo-001",
    );
  });

  it("collapses consecutive hyphens into one", () => {
    expect(generateCaseSlug("Caso---Test", "001")).toBe("caso-test-001");
  });

  it("truncates the base slug to 60 characters", () => {
    const longName = "A".repeat(100);
    const result = generateCaseSlug(longName, "001");
    expect(result.split("-001").at(0)?.length).toBeLessThanOrEqual(60);
  });

  it("handles an empty case name", () => {
    expect(generateCaseSlug("", "001")).toBe("-001");
  });

  it("strips special characters from the case number", () => {
    expect(generateCaseSlug("Caso", "123/456")).toBe("caso-123-456");
  });

  it("handles a name composed entirely of spaces", () => {
    expect(generateCaseSlug("   ", "001")).toBe("-001");
  });
});
