import dotenv from "dotenv";

dotenv.config({ path: ".env" });

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: ".env.dev" });
}

export const {
  DATABASE_URL = "",
  GOOGLE_CLIENT_ID = "",
  GOOGLE_CLIENT_SECRET = "",
  BETTER_AUTH_SECRET = "",
  PORT = "",
  BACKEND_URL = "",
} = process.env;
