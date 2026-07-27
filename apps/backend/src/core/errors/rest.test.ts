import { describe, expect, it } from "vitest";
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  InternalServerError,
  NotFoundError,
  PayloadTooLargeError,
  UnauthorizedError,
  UnsupportedMediaTypeError,
} from "@/core/errors/rest";

describe("UnauthorizedError (REST)", () => {
  it("sets status to 401", () => {
    expect(new UnauthorizedError().status).toBe(401);
  });

  it("uses a Spanish default message", () => {
    expect(new UnauthorizedError().message).toBe(
      "Usted no está autorizado para realizar esta acción",
    );
  });

  it("accepts a custom message", () => {
    expect(new UnauthorizedError("Token expired").message).toBe(
      "Token expired",
    );
  });
});

describe("BadRequestError (REST)", () => {
  it("sets status to 400", () => {
    expect(new BadRequestError("Bad request").status).toBe(400);
  });
});

describe("NotFoundError (REST)", () => {
  it("sets status to 404", () => {
    expect(new NotFoundError("Not found").status).toBe(404);
  });
});

describe("ForbiddenError", () => {
  it("sets status to 403", () => {
    expect(new ForbiddenError().status).toBe(403);
  });

  it("uses a Spanish default message", () => {
    expect(new ForbiddenError().message).toBe(
      "No tiene permisos para acceder a este recurso",
    );
  });
});

describe("InternalServerError (REST)", () => {
  it("sets status to 500", () => {
    expect(new InternalServerError().status).toBe(500);
  });

  it("uses a Spanish default message", () => {
    expect(new InternalServerError().message).toBe(
      "Error interno del servidor",
    );
  });
});

describe("ConflictError", () => {
  it("sets status to 409", () => {
    expect(new ConflictError("Conflict").status).toBe(409);
  });
});

describe("PayloadTooLargeError", () => {
  it("sets status to 413", () => {
    expect(new PayloadTooLargeError().status).toBe(413);
  });

  it("uses a Spanish default message", () => {
    expect(new PayloadTooLargeError().message).toBe(
      "El archivo es demasiado grande",
    );
  });
});

describe("UnsupportedMediaTypeError", () => {
  it("sets status to 415", () => {
    expect(new UnsupportedMediaTypeError().status).toBe(415);
  });

  it("uses a Spanish default message", () => {
    expect(new UnsupportedMediaTypeError().message).toBe(
      "Tipo de archivo no soportado",
    );
  });
});
