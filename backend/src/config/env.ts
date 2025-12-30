import dotenv from "dotenv";

const envFile = process.env.NODE_ENV === "production" ? ".env" : ".env.dev";

dotenv.config({ path: envFile });

export const {
  DATABASE_URL = "",
  GOOGLE_CLIENT_ID = "",
  GOOGLE_CLIENT_SECRET = "",
  BETTER_AUTH_SECRET = "",
  PORT = "7000",
  BETTER_AUTH_URL = "http://localhost:7000",
} = process.env;
