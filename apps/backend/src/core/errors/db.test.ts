import { describe, expect, it } from "vitest";
import { handleDbError } from "@/core/errors/db";
import {
  BadRequestError,
  DuplicateFieldError,
  ForeignKeyConstraintError,
  InternalServerError,
  InvalidInputError,
  NotFoundError,
} from "@/core/errors/gql";

describe("handleDbError", () => {
  describe("when given a UNIQUE constraint error", () => {
    it("throws DuplicateFieldError for a SQLite UNIQUE message", () => {
      expect(() =>
        handleDbError(new Error("UNIQUE constraint failed")),
      ).toThrow(DuplicateFieldError);
    });

    it("throws DuplicateFieldError for a SQLITE_CONSTRAINT_UNIQUE error code", () => {
      const error = Object.assign(new Error("constraint failed"), {
        code: "SQLITE_CONSTRAINT_UNIQUE",
      });
      expect(() => handleDbError(error)).toThrow(DuplicateFieldError);
    });

    it("uses the custom duplicate message when provided", () => {
      try {
        handleDbError(new Error("UNIQUE constraint failed"), {
          duplicate: "Email already exists",
        });
      } catch (e) {
        expect(e).toBeInstanceOf(DuplicateFieldError);
        expect((e as DuplicateFieldError).message).toBe("Email already exists");
      }
    });
  });

  describe("when given a FOREIGN KEY constraint error", () => {
    it("throws ForeignKeyConstraintError for a SQLite FOREIGN KEY message", () => {
      expect(() =>
        handleDbError(new Error("FOREIGN KEY constraint failed")),
      ).toThrow(ForeignKeyConstraintError);
    });

    it("throws ForeignKeyConstraintError for a SQLITE_CONSTRAINT_FOREIGNKEY error code", () => {
      const error = Object.assign(new Error("constraint failed"), {
        code: "SQLITE_CONSTRAINT_FOREIGNKEY",
      });
      expect(() => handleDbError(error)).toThrow(ForeignKeyConstraintError);
    });
  });

  describe("when given a NOT NULL constraint error", () => {
    it("throws BadRequestError for a SQLite NOT NULL message", () => {
      expect(() =>
        handleDbError(new Error("NOT NULL constraint failed")),
      ).toThrow(BadRequestError);
    });

    it("throws BadRequestError for a SQLITE_CONSTRAINT_NOTNULL error code", () => {
      const error = Object.assign(new Error("constraint failed"), {
        code: "SQLITE_CONSTRAINT_NOTNULL",
      });
      expect(() => handleDbError(error)).toThrow(BadRequestError);
    });
  });

  describe("when given a CHECK constraint error", () => {
    it("throws InvalidInputError for a SQLite CHECK message", () => {
      expect(() => handleDbError(new Error("CHECK constraint failed"))).toThrow(
        InvalidInputError,
      );
    });
  });

  describe("when given a not-found error", () => {
    it("throws NotFoundError when the message contains 'not found' and a custom message is provided", () => {
      expect(() =>
        handleDbError(new Error("Record not found"), {
          notFound: "Article not found",
        }),
      ).toThrow(NotFoundError);
    });
  });

  describe("when given an unrecognized error", () => {
    it("throws InternalServerError for an unknown Error instance", () => {
      expect(() => handleDbError(new Error("Something failed"))).toThrow(
        InternalServerError,
      );
    });

    it("throws InternalServerError for a non-Error value", () => {
      expect(() => handleDbError("string error")).toThrow(InternalServerError);
    });

    it("throws InternalServerError for null", () => {
      expect(() => handleDbError(null)).toThrow(InternalServerError);
    });

    it("throws InternalServerError for undefined", () => {
      expect(() => handleDbError(undefined)).toThrow(InternalServerError);
    });
  });
});
