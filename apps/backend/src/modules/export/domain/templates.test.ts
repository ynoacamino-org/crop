import { describe, expect, it } from "vitest";
import {
  EXPORT_TEMPLATES,
  getAllExportTemplates,
  getExportTemplate,
  getExportTemplateByQueryKey,
} from "@/modules/export/domain/templates";

describe("EXPORT_TEMPLATES", () => {
  it("contains exactly 3 templates", () => {
    expect(Object.keys(EXPORT_TEMPLATES)).toHaveLength(3);
  });

  it("has a template for each export type", () => {
    expect(EXPORT_TEMPLATES["legal-cases-csv"]).toBeDefined();
    expect(EXPORT_TEMPLATES["articles-csv"]).toBeDefined();
    expect(EXPORT_TEMPLATES["courts-csv"]).toBeDefined();
  });
});

describe("getExportTemplate", () => {
  it("returns the template for a valid type", () => {
    const template = getExportTemplate("legal-cases-csv");
    expect(template).toBeDefined();
    expect(template?.name).toBe("Casos Legales");
    expect(template?.queryKey).toBe("legalCases");
  });

  it("returns undefined for an invalid type", () => {
    expect(getExportTemplate("invalid-type" as never)).toBeUndefined();
  });
});

describe("getAllExportTemplates", () => {
  it("returns an array of 3 templates", () => {
    expect(getAllExportTemplates()).toHaveLength(3);
  });

  it("each template has the required fields", () => {
    for (const template of getAllExportTemplates()) {
      expect(template.name).toBeDefined();
      expect(template.type).toBeDefined();
      expect(template.columns).toBeInstanceOf(Array);
      expect(template.defaultColumns).toBeInstanceOf(Array);
      expect(template.queryKey).toBeDefined();
    }
  });
});

describe("getExportTemplateByQueryKey", () => {
  it("returns the template matching the queryKey", () => {
    const template = getExportTemplateByQueryKey("legalCases");
    expect(template).toBeDefined();
    expect(template?.type).toBe("legal-cases-csv");
  });

  it("returns undefined for a non-existent queryKey", () => {
    expect(getExportTemplateByQueryKey("nonexistent")).toBeUndefined();
  });

  it("finds the articles template by queryKey", () => {
    expect(getExportTemplateByQueryKey("articles")?.type).toBe("articles-csv");
  });

  it("finds the courts template by queryKey", () => {
    expect(getExportTemplateByQueryKey("courts")?.type).toBe("courts-csv");
  });
});
