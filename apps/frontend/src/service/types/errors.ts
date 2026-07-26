export class ServiceError extends Error {
  readonly statusCode?: number;
  readonly code?: string;

  constructor(
    message: string,
    options?: { statusCode?: number; code?: string; cause?: unknown },
  ) {
    super(message, { cause: options?.cause });
    this.name = "ServiceError";
    this.statusCode = options?.statusCode;
    this.code = options?.code;
  }
}
