import { GraphQLError } from "graphql";

export class NotFoundError extends GraphQLError {
  constructor(message: string) {
    super(message, {
      extensions: {
        code: "NOT_FOUND",
      },
    });
  }
}

export class DuplicateFieldError extends GraphQLError {
  constructor(message: string, fields?: string | string[]) {
    super(message, {
      extensions: {
        code: "DUPLICATE_FIELD",
        fields,
      },
    });
  }
}

export class UnauthorizedError extends GraphQLError {
  constructor() {
    super("Usted no esta autorizado para realizar esta acción", {
      extensions: {
        code: "UNAUTHORIZED",
      },
    });
  }
}

export class InternalServerError extends GraphQLError {
  constructor(message: string) {
    super(message, {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
      },
    });
  }
}

export class BadRequestError extends GraphQLError {
  constructor(message: string) {
    super(message, {
      extensions: {
        code: "BAD_REQUEST",
      },
    });
  }
}

export class ForeignKeyConstraintError extends GraphQLError {
  constructor(message: string, field?: string) {
    super(message, {
      extensions: {
        code: "FOREIGN_KEY_CONSTRAINT",
        field,
      },
    });
  }
}

export class InvalidInputError extends GraphQLError {
  constructor(message: string) {
    super(message, {
      extensions: {
        code: "INVALID_INPUT",
      },
    });
  }
}
