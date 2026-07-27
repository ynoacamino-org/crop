import { GraphQLError } from "graphql";
import {
  BadRequestError,
  DuplicateFieldError,
  ForeignKeyConstraintError,
  InternalServerError,
  InvalidInputError,
  NotFoundError,
} from "@/core/errors/gql";

const UNIQUE_PATTERN = /UNIQUE constraint failed/i;
const FOREIGN_KEY_PATTERN = /FOREIGN KEY constraint failed/i;
const NOT_NULL_PATTERN = /NOT NULL constraint failed/i;
const CHECK_PATTERN = /CHECK constraint failed/i;

export function handleDbError(
  error: unknown,
  messages?: {
    notFound?: string;
    duplicate?: string;
    foreignKey?: string;
    invalidInput?: string;
  },
): never {
  if (error instanceof GraphQLError) {
    throw error;
  }

  if (error instanceof Error) {
    const message = error.message;

    if (UNIQUE_PATTERN.test(message)) {
      throw new DuplicateFieldError(
        messages?.duplicate ?? "Ya existe un registro con los mismos valores",
      );
    }

    if (FOREIGN_KEY_PATTERN.test(message)) {
      throw new ForeignKeyConstraintError(
        messages?.foreignKey ??
          "No se puede completar la operación por una restricción de clave foránea",
      );
    }

    if (NOT_NULL_PATTERN.test(message)) {
      throw new BadRequestError("Hay campos requeridos faltantes");
    }

    if (CHECK_PATTERN.test(message)) {
      throw new InvalidInputError(
        messages?.invalidInput ?? "Los datos proporcionados no son válidos",
      );
    }

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      typeof (error as { code?: unknown }).code === "string"
    ) {
      const code = (error as { code: string }).code;
      if (code.startsWith("SQLITE_CONSTRAINT_UNIQUE")) {
        throw new DuplicateFieldError(
          messages?.duplicate ?? "Ya existe un registro con los mismos valores",
        );
      }
      if (code.startsWith("SQLITE_CONSTRAINT_FOREIGNKEY")) {
        throw new ForeignKeyConstraintError(
          messages?.foreignKey ??
            "No se puede completar la operación por una restricción de clave foránea",
        );
      }
      if (code.startsWith("SQLITE_CONSTRAINT_NOTNULL")) {
        throw new BadRequestError("Hay campos requeridos faltantes");
      }
    }

    if (message.toLowerCase().includes("not found") && messages?.notFound) {
      throw new NotFoundError(messages.notFound);
    }

    throw new InternalServerError(message);
  }

  throw new InternalServerError("Error interno del servidor");
}
