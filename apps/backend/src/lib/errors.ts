import { GraphQLError } from "graphql";

export class NOT_FOUND_ERROR extends GraphQLError {
  constructor(message: string) {
    super(message, {
      extensions: {
        code: "NOT_FOUND",
      },
    });
  }
}

export class DUPLICATE_FIELD_ERROR extends GraphQLError {
  constructor(message: string, fields?: string | string[]) {
    super(message, {
      extensions: {
        code: "DUPLICATE_FIELD",
        fields,
      },
    });
  }
}

export class UNAUTHORIZED_ERROR extends GraphQLError {
  constructor() {
    super("Usted no esta autorizado para realizar esta acción", {
      extensions: {
        code: "UNAUTHORIZED",
      },
    });
  }
}

export class INTERNAL_SERVER_ERROR extends GraphQLError {
  constructor(message: string) {
    super(message, {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
      },
    });
  }
}

export class BAD_REQUEST_ERROR extends GraphQLError {
  constructor(message: string) {
    super(message, {
      extensions: {
        code: "BAD_REQUEST",
      },
    });
  }
}

export class FOREIGN_KEY_CONSTRAINT_ERROR extends GraphQLError {
  constructor(message: string, field?: string) {
    super(message, {
      extensions: {
        code: "FOREIGN_KEY_CONSTRAINT",
        field,
      },
    });
  }
}

export class INVALID_INPUT_ERROR extends GraphQLError {
  constructor(message: string) {
    super(message, {
      extensions: {
        code: "INVALID_INPUT",
      },
    });
  }
}
