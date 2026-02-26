import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z
    .url("NEXT_PUBLIC_API_URL must be a valid URL")
    .default("http://localhost:8000/api"),
  INTERNAL_API_URL: z
    .url("INTERNAL_API_URL must be a valid URL")
    .default("http://localhost:8000/api"),
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
      
      Check your .env.local file and ensure all required variables are set.
      See .env.example for reference.`,
    );
  }

  return result.data;
}

const env = validateEnv();

export const API_URL = env.NEXT_PUBLIC_API_URL;
export const INTERNAL_API_URL = env.INTERNAL_API_URL;
