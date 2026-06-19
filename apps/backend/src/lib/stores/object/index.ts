import { isCloudflareBindings } from "@/lib/stores/detect";
import type { EnvStore } from "@/lib/stores/env/types";
import { LocalFsObjectStore } from "@/lib/stores/object/local";
import { R2ObjectStore } from "@/lib/stores/object/r2";
import { type S3Config, S3ObjectStore } from "@/lib/stores/object/s3";
import type { ObjectStore } from "@/lib/stores/object/types";

export interface ObjectStoreFactoryOptions {
  env: EnvStore;
  cf?: Cloudflare.Env;
  preferR2Binding?: boolean;
}

export function ObjectStoreFactory(
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
  return new LocalFsObjectStore({
    baseDir: opts.env.get("LOCAL_MEDIA_DIR") ?? "./.data/media",
    publicUrlPrefix: opts.env.get("S3_PUBLIC_URL") ?? "/api/media/file",
  });
}
