import {
  BAD_REQUEST_ERROR,
  DUPLICATE_FIELD_ERROR,
  FOREIGN_KEY_CONSTRAINT_ERROR,
  INTERNAL_SERVER_ERROR,
  INVALID_INPUT_ERROR,
  NOT_FOUND_ERROR,
} from "@/lib/errors";
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
        throw new NOT_FOUND_ERROR(
          messages?.notFound ?? "El recurso solicitado no existe",
        );
      }

      // Unique constraint violation
      case "P2002": {
        const fields = error.meta?.target as string[];
        throw new DUPLICATE_FIELD_ERROR(
          messages?.duplicate
            ? `${messages.duplicate}: ${fields.join(", ")}`
            : `Ya existe un registro con los mismos valores en: ${fields.join(", ")}`,
          fields,
        );
      }

      // Foreign key constraint violation
      case "P2003": {
        const field = error.meta?.field_name as string;
        throw new FOREIGN_KEY_CONSTRAINT_ERROR(
          messages?.foreignKey
            ? `${messages.foreignKey}: ${field}`
            : `No se puede completar la operación debido a: ${field}`,
          field,
        );
      }

      // Invalid input data
      case "P2006":
      case "P2007": {
        throw new INVALID_INPUT_ERROR(
          messages?.invalidInput ?? "Los datos proporcionados no son válidos",
        );
      }

      // Required field missing
      case "P2011": {
        const field = error.meta?.constraint as string;
        throw new BAD_REQUEST_ERROR(`El campo ${field} es requerido`);
      }

      // Required relation not found
      case "P2018": {
        const relations = error.meta?.required_connected_fields as string[];
        throw new BAD_REQUEST_ERROR(
          `Las relaciones requeridas no fueron encontradas: ${relations.join(", ")}`,
        );
      }

      // Transaction failed
      case "P2034": {
        throw new INTERNAL_SERVER_ERROR(
          "La transacción falló. Por favor, intente nuevamente",
        );
      }

      default: {
        throw new INTERNAL_SERVER_ERROR(
          `Error de base de datos: ${error.message}`,
        );
      }
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    throw new INVALID_INPUT_ERROR(
      "Los datos de entrada no cumplen con el formato esperado",
    );
  }

  throw new INTERNAL_SERVER_ERROR("Error interno del servidor");
}
