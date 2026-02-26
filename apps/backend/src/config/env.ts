import dotenv from "dotenv";
import { z } from "zod";

dotenv.config({ path: ".env" });

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: ".env.dev" });
}

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  GOOGLE_CLIENT_ID: z.string().min(1, "GOOGLE_CLIENT_ID is required"),
  GOOGLE_CLIENT_SECRET: z.string().min(1, "GOOGLE_CLIENT_SECRET is required"),
  BETTER_AUTH_SECRET: z
    .string()
    .min(32, "BETTER_AUTH_SECRET must be at least 32 characters"),

  PORT: z.string().regex(/^\d+$/, "PORT must be a number").default("7000"),

  BACKEND_URL: z.url("BACKEND_URL must be a valid URL"),

  S3_ENDPOINT: z.string().min(1, "S3_ENDPOINT is required"),
  S3_REGION: z.string().default("auto"),
  S3_ACCESS_KEY_ID: z.string().min(1, "S3_ACCESS_KEY_ID is required"),
  S3_SECRET_ACCESS_KEY: z.string().min(1, "S3_SECRET_ACCESS_KEY is required"),
  S3_BUCKET_NAME: z.string().default("crop-media"),
  S3_PUBLIC_URL: z.string().optional(),
  S3_FORCE_PATH_STYLE: z.enum(["true", "false"]).default("false"),
});

function validateEnv() {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const missingVars = result.error.issues
      .map((err) => `  - ${err.path.join(".")}: ${err.message}`)
      .join("\n");

    throw new Error(
      `Invalid environment variables:
      ${missingVars}
      
      Check your .env file and ensure all required variables are set.\n See .env.example for reference.`,
    );
  }

  return result.data;
}

export const env = validateEnv();

export const {
  NODE_ENV,
  DATABASE_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  BETTER_AUTH_SECRET,
  PORT,
  BACKEND_URL,
} = env;
