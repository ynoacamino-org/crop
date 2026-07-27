import { describe, expect, it } from "vitest";
import {
  BadRequestError,
  DuplicateFieldError,
  ForeignKeyConstraintError,
  InternalServerError,
  InvalidInputError,
  NotFoundError,
  UnauthorizedError,
} from "@/core/errors/gql";

describe("NotFoundError (GraphQL)", () => {
  it("sets extensions.code to NOT_FOUND", () => {
    const error = new NotFoundError("Resource not found");
    expect(error.extensions?.code).toBe("NOT_FOUND");
  });

  it("preserves the provided message", () => {
    const error = new NotFoundError("Article not found");
    expect(error.message).toBe("Article not found");
  });
});

describe("DuplicateFieldError", () => {
  it("sets extensions.code to DUPLICATE_FIELD", () => {
    const error = new DuplicateFieldError("Duplicate");
    expect(error.extensions?.code).toBe("DUPLICATE_FIELD");
  });

  it("accepts a single field as string", () => {
    const error = new DuplicateFieldError("Duplicate", "email");
    expect(error.extensions?.fields).toBe("email");
  });

  it("accepts multiple fields as an array", () => {
    const error = new DuplicateFieldError("Duplicate", ["email", "name"]);
    expect(error.extensions?.fields).toEqual(["email", "name"]);
  });
});

describe("UnauthorizedError", () => {
  it("sets extensions.code to UNAUTHORIZED", () => {
    const error = new UnauthorizedError();
    expect(error.extensions?.code).toBe("UNAUTHORIZED");
  });

  it("uses a Spanish default message", () => {
    const error = new UnauthorizedError();
    expect(error.message).toBe(
      "Usted no esta autorizado para realizar esta acción",
    );
  });
});

describe("InternalServerError", () => {
  it("sets extensions.code to INTERNAL_SERVER_ERROR", () => {
    const error = new InternalServerError("Internal error");
    expect(error.extensions?.code).toBe("INTERNAL_SERVER_ERROR");
  });
});

describe("BadRequestError (GraphQL)", () => {
  it("sets extensions.code to BAD_REQUEST", () => {
    const error = new BadRequestError("Invalid request");
    expect(error.extensions?.code).toBe("BAD_REQUEST");
  });
});

describe("ForeignKeyConstraintError", () => {
  it("sets extensions.code to FOREIGN_KEY_CONSTRAINT", () => {
    const error = new ForeignKeyConstraintError("FK error");
    expect(error.extensions?.code).toBe("FOREIGN_KEY_CONSTRAINT");
  });

  it("accepts an optional field parameter", () => {
    const error = new ForeignKeyConstraintError("FK error", "courtId");
    expect(error.extensions?.field).toBe("courtId");
  });
});

describe("InvalidInputError", () => {
  it("sets extensions.code to INVALID_INPUT", () => {
    const error = new InvalidInputError("Invalid input");
    expect(error.extensions?.code).toBe("INVALID_INPUT");
  });
});
