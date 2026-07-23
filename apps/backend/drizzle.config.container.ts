import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/domain/db/schema.ts",
  dialect: "turso",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "http://localhost:8080",
    authToken: process.env.DATABASE_AUTH_TOKEN ?? "",
  },
});
