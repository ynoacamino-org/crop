import type { EnvPort } from "@/modules/config/ports/config";

export function createEnvConfig(env: EnvPort) {
  return {
    nodeEnv: env.get("NODE_ENV") ?? "development",
    backendUrl: env.get("BACKEND_URL") ?? "http://localhost:7000",
    port: Number.parseInt(env.get("PORT") ?? "7000", 10),

    auth: {
      secret: env.getRequired("BETTER_AUTH_SECRET"),
    },

    database: {
      url: env.get("DATABASE_URL"),
    },

    s3: {
      accessKeyId: env.get("S3_ACCESS_KEY_ID") ?? "",
      secretAccessKey: env.get("S3_SECRET_ACCESS_KEY") ?? "",
      region: env.get("S3_REGION") ?? "us-east-1",
      bucket: env.get("S3_BUCKET_NAME") ?? "crop-media",
      endpoint: env.get("S3_ENDPOINT") ?? "",
      publicUrl: env.get("S3_PUBLIC_URL") ?? "",
      forcePathStyle: env.get("S3_FORCE_PATH_STYLE") === "true",
    },

    redis: {
      url: env.get("UPSTASH_REDIS_REST_URL"),
      token: env.get("UPSTASH_REDIS_REST_TOKEN"),
    },

    dev: {
      seedToken: env.get("DEV_SEED_TOKEN"),
    },
  } as const;
}

export type EnvConfig = ReturnType<typeof createEnvConfig>;
