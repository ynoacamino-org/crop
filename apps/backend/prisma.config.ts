import { defineConfig, env } from "prisma/config";

import "dotenv/config";
import dotenv from "dotenv";

dotenv.config({ path: ".env.dev" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "bun ./prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
