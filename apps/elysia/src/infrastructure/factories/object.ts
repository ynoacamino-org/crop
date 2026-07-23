import type { EnvPort } from "@/application/ports/config";
import type { ObjectPort } from "@/application/ports/object";
import { S3ObjectPort } from "@/infrastructure/adapters/object/s3";

export function createObject(env: EnvPort): ObjectPort {
  if (S3ObjectPort.isConfigured(env)) {
    return new S3ObjectPort(env);
  }

  throw new Error(
    "[object-store] S3 no configurado. Proporcione S3_ACCESS_KEY_ID + S3_SECRET_ACCESS_KEY.",
  );
}
