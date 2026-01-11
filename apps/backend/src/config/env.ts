import dotenv from "dotenv";

dotenv.config({ path: ".env" });

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: ".env.dev" });
}

export const env = {
  DATABASE_URL: process.env.DATABASE_URL || "",

  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET || "",

  PORT: process.env.PORT || "",
  BACKEND_URL: process.env.BACKEND_URL || "",

  S3_ENDPOINT: process.env.S3_ENDPOINT || "",
  S3_REGION: process.env.S3_REGION || "auto",
  S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID || "",
  S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY || "",
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME || "crop-media",
  S3_PUBLIC_URL: process.env.S3_PUBLIC_URL || "",
  S3_FORCE_PATH_STYLE: process.env.S3_FORCE_PATH_STYLE || "false",
};

// Mantener exports individuales para compatibilidad
export const {
  DATABASE_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  BETTER_AUTH_SECRET,
  PORT,
  BACKEND_URL,
} = env;
