import type { EnvStore } from "@/ports/config/port";
import { isCloudflareBindings } from "@/ports/detect";
import type { ObjectStore } from "@/ports/object/port";
import { R2ObjectStore } from "@/ports/object/r2";
import { type S3Config, S3ObjectStore } from "@/ports/object/s3";

export interface ObjectStoreFactoryOptions {
  env: EnvStore;
  cf?: Cloudflare.Env;
  preferR2Binding?: boolean;
}

export function createObjectStore(
  opts: ObjectStoreFactoryOptions,
): ObjectStore {
  if (
    opts.preferR2Binding &&
    opts.cf &&
    isCloudflareBindings(opts.cf) &&
    "MY_BUCKET" in opts.cf
  ) {
    return new R2ObjectStore(
      opts.cf.MY_BUCKET as R2Bucket,
      opts.env.get("S3_PUBLIC_URL") ?? "",
    );
  }

  const accessKeyId = opts.env.get("S3_ACCESS_KEY_ID") ?? "";
  const secretAccessKey = opts.env.get("S3_SECRET_ACCESS_KEY") ?? "";

  if (accessKeyId && secretAccessKey) {
    const config: S3Config = {
      endpoint: opts.env.get("S3_ENDPOINT") || undefined,
      region: opts.env.get("S3_REGION") ?? undefined,
      bucket: opts.env.get("S3_BUCKET_NAME") ?? "crop-media",
      accessKeyId,
      secretAccessKey,
      publicUrl: opts.env.get("S3_PUBLIC_URL") ?? undefined,
      forcePathStyle: opts.env.get("S3_FORCE_PATH_STYLE") === "true",
    };
    return new S3ObjectStore(config);
  }

  throw new Error(
    "[object-store] No remote storage configured. Provide either " +
      "an R2 binding (Cloudflare MY_BUCKET) or S3 credentials " +
      "(S3_ACCESS_KEY_ID + S3_SECRET_ACCESS_KEY [+ S3_ENDPOINT]). " +
      "Local filesystem storage has been removed.",
  );
}
