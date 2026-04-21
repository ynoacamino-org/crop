import {
  BadRequestError,
  DuplicateFieldError,
  ForeignKeyConstraintError,
  InternalServerError,
  InvalidInputError,
  NotFoundError,
} from "@/lib/errors/gql";

export function handleDbError(
  error: unknown,
  messages?: {
    notFound?: string;
    duplicate?: string;
    foreignKey?: string;
    invalidInput?: string;
  },
): never {
  if (error instanceof Error && "code" in error) {
    const code = String((error as { code?: string }).code ?? "");

    switch (code) {
      case "23505": {
        throw new DuplicateFieldError(
          messages?.duplicate ?? "Ya existe un registro con los mismos valores",
        );
      }
      case "23503": {
        throw new ForeignKeyConstraintError(
          messages?.foreignKey ??
            "No se puede completar la operación por una restricción de clave foránea",
        );
      }
      case "23502": {
        throw new BadRequestError("Hay campos requeridos faltantes");
      }
      case "22P02":
      case "22007": {
        throw new InvalidInputError(
          messages?.invalidInput ?? "Los datos proporcionados no son válidos",
        );
      }
      default: {
        throw new InternalServerError(
          `Error de base de datos: ${error.message}`,
        );
      }
    }
  }

  if (error instanceof Error) {
    if (error.message.includes("not found") && messages?.notFound) {
      throw new NotFoundError(messages.notFound);
    }

    throw new InternalServerError(error.message);
  }

  throw new InternalServerError("Error interno del servidor");
}
