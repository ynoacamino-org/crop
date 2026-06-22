import type { EnvPort } from "@/application/ports/config";
import type { ObjectPort } from "@/application/ports/object";
import { R2ObjectPort } from "@/infrastructure/adapters/object/r2";
import { S3ObjectPort } from "@/infrastructure/adapters/object/s3";

export interface ObjectOptions {
  env: EnvPort;
  cf?: Cloudflare.Env;
}

export function createObject(opts: ObjectOptions): ObjectPort {
  if (R2ObjectPort.isConfigured(opts.cf)) {
    return new R2ObjectPort(opts.cf.MY_BUCKET as R2Bucket);
  }

  if (S3ObjectPort.isConfigured(opts.env)) {
    return new S3ObjectPort(opts.env);
  }

  throw new Error(
    "[object-store] No remote storage configured. Provide either " +
      "an R2 binding (Cloudflare MY_BUCKET) or S3 credentials " +
      "(S3_ACCESS_KEY_ID + S3_SECRET_ACCESS_KEY [+ S3_ENDPOINT]). " +
      "Local filesystem storage has been removed.",
  );
}
