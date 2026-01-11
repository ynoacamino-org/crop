import {
  BadRequestError,
  DuplicateFieldError,
  ForeignKeyConstraintError,
  InternalServerError,
  InvalidInputError,
  NotFoundError,
} from "@/lib/errors/gql";
import { Prisma } from "@prisma/client/client";

export function handlePrismaError(
  error: unknown,
  messages?: {
    notFound?: string;
    duplicate?: string;
    foreignKey?: string;
    invalidInput?: string;
  },
): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      // Record not found
      case "P2025": {
        throw new NotFoundError(
          messages?.notFound ?? "El recurso solicitado no existe",
        );
      }

      // Unique constraint violation
      case "P2002": {
        const fields = error.meta?.target as string[];
        throw new DuplicateFieldError(
          messages?.duplicate
            ? `${messages.duplicate}: ${fields.join(", ")}`
            : `Ya existe un registro con los mismos valores en: ${fields.join(", ")}`,
          fields,
        );
      }

      // Foreign key constraint violation
      case "P2003": {
        const field = error.meta?.field_name as string;
        throw new ForeignKeyConstraintError(
          messages?.foreignKey
            ? `${messages.foreignKey}: ${field}`
            : `No se puede completar la operación debido a: ${field}`,
          field,
        );
      }

      // Invalid input data
      case "P2006":
      case "P2007": {
        throw new InvalidInputError(
          messages?.invalidInput ?? "Los datos proporcionados no son válidos",
        );
      }

      // Required field missing
      case "P2011": {
        const field = error.meta?.constraint as string;
        throw new BadRequestError(`El campo ${field} es requerido`);
      }

      // Required relation not found
      case "P2018": {
        const relations = error.meta?.required_connected_fields as string[];
        throw new BadRequestError(
          `Las relaciones requeridas no fueron encontradas: ${relations.join(", ")}`,
        );
      }

      // Transaction failed
      case "P2034": {
        throw new InternalServerError(
          "La transacción falló. Por favor, intente nuevamente",
        );
      }

      default: {
        throw new InternalServerError(
          `Error de base de datos: ${error.message}`,
        );
      }
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    throw new InvalidInputError(
      "Los datos de entrada no cumplen con el formato esperado",
    );
  }

  throw new InternalServerError("Error interno del servidor");
}
