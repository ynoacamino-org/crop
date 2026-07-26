import { ServiceError } from "@/services/types/errors";

export function getErrorMessage(err: unknown): string {
  if (err instanceof ServiceError) {
    return err.message;
  }
  if (err instanceof Error) {
    return err.message;
  }
  if (typeof err === "string") {
    return err;
  }
  return "Error desconocido";
}
