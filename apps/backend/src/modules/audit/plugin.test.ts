import { describe, expect, it } from "vitest";
import {
  createAuditTracingConfig,
  isAuditableMutation,
} from "@/modules/audit/plugin";

describe("isAuditableMutation", () => {
  it("returns true for create mutations", () => {
    expect(isAuditableMutation("createArticle")).toBe(true);
    expect(isAuditableMutation("createLegalCase")).toBe(true);
    expect(isAuditableMutation("createMedia")).toBe(true);
    expect(isAuditableMutation("createCaseType")).toBe(true);
  });

  it("returns true for update mutations", () => {
    expect(isAuditableMutation("updateArticle")).toBe(true);
    expect(isAuditableMutation("updateLegalCase")).toBe(true);
    expect(isAuditableMutation("updateMedia")).toBe(true);
    expect(isAuditableMutation("updateMe")).toBe(true);
    expect(isAuditableMutation("updateUser")).toBe(true);
  });

  it("returns true for delete mutations", () => {
    expect(isAuditableMutation("deleteArticle")).toBe(true);
    expect(isAuditableMutation("deleteLegalCase")).toBe(true);
    expect(isAuditableMutation("deleteMedia")).toBe(true);
    expect(isAuditableMutation("deleteMe")).toBe(true);
    expect(isAuditableMutation("deleteUser")).toBe(true);
  });

  it("returns false for query fields", () => {
    expect(isAuditableMutation("article")).toBe(false);
    expect(isAuditableMutation("articles")).toBe(false);
    expect(isAuditableMutation("me")).toBe(false);
    expect(isAuditableMutation("users")).toBe(false);
    expect(isAuditableMutation("auditLogs")).toBe(false);
  });

  it("returns false for unrelated field names", () => {
    expect(isAuditableMutation("categories")).toBe(false);
    expect(isAuditableMutation("tags")).toBe(false);
    expect(isAuditableMutation("courts")).toBe(false);
  });
});

describe("createAuditTracingConfig", () => {
  const config = createAuditTracingConfig();

  describe("default", () => {
    it("returns true for auditable mutations", () => {
      expect(config.default({ kind: "Mutation", name: "createArticle" })).toBe(
        true,
      );
      expect(
        config.default({ kind: "Mutation", name: "updateLegalCase" }),
      ).toBe(true);
      expect(config.default({ kind: "Mutation", name: "deleteUser" })).toBe(
        true,
      );
    });

    it("returns false for non-mutation fields", () => {
      expect(config.default({ kind: "Query", name: "articles" })).toBe(false);
      expect(config.default({ kind: "Query", name: "me" })).toBe(false);
    });

    it("returns false for mutations without a name", () => {
      expect(config.default({ kind: "Mutation" })).toBe(false);
    });

    it("returns false for non-auditable mutations", () => {
      expect(
        config.default({ kind: "Mutation", name: "someOtherMutation" }),
      ).toBe(false);
    });
  });

  describe("wrap", () => {
    it("returns original resolver for non-mutation fields", () => {
      const resolver = () => "original";
      const wrapped = config.wrap(resolver, undefined, {
        kind: "Query",
        name: "articles",
      });
      expect(wrapped).toBe(resolver);
    });

    it("returns original resolver for mutations without a name", () => {
      const resolver = () => "original";
      const wrapped = config.wrap(resolver, undefined, { kind: "Mutation" });
      expect(wrapped).toBe(resolver);
    });

    it("returns original resolver for non-auditable mutations", () => {
      const resolver = () => "original";
      const wrapped = config.wrap(resolver, undefined, {
        kind: "Mutation",
        name: "someOtherMutation",
      });
      expect(wrapped).toBe(resolver);
    });

    it("returns a wrapped resolver for auditable mutations", () => {
      const resolver = () => "original";
      const wrapped = config.wrap(resolver, undefined, {
        kind: "Mutation",
        name: "createArticle",
      });
      expect(wrapped).not.toBe(resolver);
      expect(typeof wrapped).toBe("function");
    });
  });
});
