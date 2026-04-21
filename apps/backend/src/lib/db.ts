import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { DATABASE_URL } from "@/config/env";
import * as schema from "@/db/schema";
import { relations } from "@/db/schema";

const pool = new Pool({
  connectionString: DATABASE_URL,
});

export const db = drizzle({
  client: pool,
  schema,
  relations,
});

export { pool };
