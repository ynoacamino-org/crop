import { HTTPException } from "hono/http-exception";

export class UnauthorizedError extends HTTPException {
  constructor(message = "Usted no está autorizado para realizar esta acción") {
    super(401, { message });
  }
}

export class BadRequestError extends HTTPException {
  constructor(message: string) {
    super(400, { message });
  }
}

export class NotFoundError extends HTTPException {
  constructor(message: string) {
    super(404, { message });
  }
}

export class ForbiddenError extends HTTPException {
  constructor(message = "No tiene permisos para acceder a este recurso") {
    super(403, { message });
  }
}

export class InternalServerError extends HTTPException {
  constructor(message = "Error interno del servidor") {
    super(500, { message });
  }
}

export class ConflictError extends HTTPException {
  constructor(message: string) {
    super(409, { message });
  }
}

export class PayloadTooLargeError extends HTTPException {
  constructor(message = "El archivo es demasiado grande") {
    super(413, { message });
  }
}

export class UnsupportedMediaTypeError extends HTTPException {
  constructor(message = "Tipo de archivo no soportado") {
    super(415, { message });
  }
}
