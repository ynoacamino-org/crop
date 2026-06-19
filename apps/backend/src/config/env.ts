import { EnvFactory } from "@/lib/stores/env";
import type { EnvStore } from "@/lib/stores/env/types";

export interface AppEnv {
  NODE_ENV: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  BETTER_AUTH_SECRET: string;
  PORT: string;
  BACKEND_URL: string;
  S3_ENDPOINT: string;
  S3_REGION: string;
  S3_ACCESS_KEY_ID: string;
  S3_SECRET_ACCESS_KEY: string;
  S3_BUCKET_NAME: string;
  S3_PUBLIC_URL: string;
  S3_FORCE_PATH_STYLE: "true" | "false";
  DATABASE_URL: string;
  REDIS_URL: string;
  DEV_SEED_TOKEN: string;
}

let _env: EnvStore | null = null;

export function getEnvStore(input?: { cf?: Cloudflare.Env }): EnvStore {
  if (!_env) {
    _env = EnvFactory(input);
  }
  return _env;
}

export function resetEnvStore(): void {
  _env = null;
}

function readValue(key: string, fallback = ""): string {
  return getEnvStore().get(key) ?? fallback;
}

export function getAppEnv(): AppEnv {
  const forcePath = readValue("S3_FORCE_PATH_STYLE", "false") as
    | "true"
    | "false";
  return {
    NODE_ENV: readValue("NODE_ENV", "development"),
    GOOGLE_CLIENT_ID: readValue("GOOGLE_CLIENT_ID"),
    GOOGLE_CLIENT_SECRET: readValue("GOOGLE_CLIENT_SECRET"),
    BETTER_AUTH_SECRET: readValue("BETTER_AUTH_SECRET"),
    PORT: readValue("PORT", "7000"),
    BACKEND_URL: readValue("BACKEND_URL", "http://localhost:7000"),
    S3_ENDPOINT: readValue("S3_ENDPOINT"),
    S3_REGION: readValue("S3_REGION", "auto"),
    S3_ACCESS_KEY_ID: readValue("S3_ACCESS_KEY_ID"),
    S3_SECRET_ACCESS_KEY: readValue("S3_SECRET_ACCESS_KEY"),
    S3_BUCKET_NAME: readValue("S3_BUCKET_NAME", "crop-media"),
    S3_PUBLIC_URL: readValue("S3_PUBLIC_URL"),
    S3_FORCE_PATH_STYLE: forcePath,
    DATABASE_URL: readValue("DATABASE_URL"),
    REDIS_URL: readValue("REDIS_URL"),
    DEV_SEED_TOKEN: readValue("DEV_SEED_TOKEN"),
  };
}

export const env = new Proxy({} as AppEnv, {
  get(_target, prop) {
    const values = getAppEnv();
    return values[prop as keyof AppEnv];
  },
});

export const {
  NODE_ENV,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  BETTER_AUTH_SECRET,
  PORT,
  BACKEND_URL,
} = new Proxy({} as AppEnv, {
  get(_target, prop) {
    const values = getAppEnv();
    return values[prop as keyof AppEnv];
  },
});
