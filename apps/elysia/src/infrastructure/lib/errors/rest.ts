export class UnauthorizedError extends Error {
  status = 401;
  constructor(message = "Usted no está autorizado para realizar esta acción") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class BadRequestError extends Error {
  status = 400;
  constructor(message: string) {
    super(message);
    this.name = "BadRequestError";
  }
}

export class NotFoundError extends Error {
  status = 404;
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export class ForbiddenError extends Error {
  status = 403;
  constructor(message = "No tiene permisos para acceder a este recurso") {
    super(message);
    this.name = "ForbiddenError";
  }
}

export class InternalServerError extends Error {
  status = 500;
  constructor(message = "Error interno del servidor") {
    super(message);
    this.name = "InternalServerError";
  }
}

export class ConflictError extends Error {
  status = 409;
  constructor(message: string) {
    super(message);
    this.name = "ConflictError";
  }
}

export class PayloadTooLargeError extends Error {
  status = 413;
  constructor(message = "El archivo es demasiado grande") {
    super(message);
    this.name = "PayloadTooLargeError";
  }
}

export class UnsupportedMediaTypeError extends Error {
  status = 415;
  constructor(message = "Tipo de archivo no soportado") {
    super(message);
    this.name = "UnsupportedMediaTypeError";
  }
}
