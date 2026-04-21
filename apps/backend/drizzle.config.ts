import "dotenv/config";
import { config as loadDotenv } from "dotenv";
import { defineConfig } from "drizzle-kit";

if (process.env.NODE_ENV !== "production") {
  loadDotenv({ path: ".env.dev", override: false });
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required to run Drizzle Kit commands");
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  strict: true,
  verbose: true,
});
