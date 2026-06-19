declare const process: { env: Record<string, string | undefined> } | undefined;

type NodeEnv = "development" | "production" | "test";
type S3ForcePathStyle = "true" | "false";

interface AppEnv {
  NODE_ENV: NodeEnv;
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
  S3_FORCE_PATH_STYLE: S3ForcePathStyle;
}

function getVar(key: string, fallback = ""): string {
  if (typeof process !== "undefined" && process.env) {
    return process.env[key] ?? fallback;
  }
  return fallback;
}

function readEnv(): AppEnv {
  const nodeEnv =
    (getVar("NODE_ENV", "development") as NodeEnv) ?? "development";

  const forcePath = getVar("S3_FORCE_PATH_STYLE", "false") as S3ForcePathStyle;

  return {
    NODE_ENV: nodeEnv,
    GOOGLE_CLIENT_ID: getVar("GOOGLE_CLIENT_ID"),
    GOOGLE_CLIENT_SECRET: getVar("GOOGLE_CLIENT_SECRET"),
    BETTER_AUTH_SECRET: getVar("BETTER_AUTH_SECRET"),
    PORT: getVar("PORT", "7000"),
    BACKEND_URL: getVar("BACKEND_URL", "http://localhost:7000"),
    S3_ENDPOINT: getVar("S3_ENDPOINT"),
    S3_REGION: getVar("S3_REGION", "auto"),
    S3_ACCESS_KEY_ID: getVar("S3_ACCESS_KEY_ID"),
    S3_SECRET_ACCESS_KEY: getVar("S3_SECRET_ACCESS_KEY"),
    S3_BUCKET_NAME: getVar("S3_BUCKET_NAME", "crop-media"),
    S3_PUBLIC_URL: getVar("S3_PUBLIC_URL"),
    S3_FORCE_PATH_STYLE: forcePath,
  };
}

export const env = readEnv();

export const {
  NODE_ENV,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  BETTER_AUTH_SECRET,
  PORT,
  BACKEND_URL,
} = env;
