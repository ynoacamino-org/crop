import type { EnvConfig } from "@/modules/config/env";
import { R2ObjectPort } from "@/modules/object-storage/adapters/r2";
import { S3ObjectPort } from "@/modules/object-storage/adapters/s3";
import type { ObjectPort } from "@/modules/object-storage/ports/storage";

export interface ObjectOptions {
  config: EnvConfig;
  cf?: Cloudflare.Env;
}

export function createObject(opts: ObjectOptions): ObjectPort {
  if (R2ObjectPort.isConfigured(opts.cf)) {
    return new R2ObjectPort(opts.cf.MY_BUCKET as R2Bucket);
  }

  if (S3ObjectPort.isConfigured(opts.config)) {
    return new S3ObjectPort(opts.config);
  }

  throw new Error(
    "[object-store] No remote storage configured. Provide either " +
      "an R2 binding (Cloudflare MY_BUCKET) or S3 credentials " +
      "(S3_ACCESS_KEY_ID + S3_SECRET_ACCESS_KEY [+ S3_ENDPOINT]). " +
      "Local filesystem storage has been removed.",
  );
}
