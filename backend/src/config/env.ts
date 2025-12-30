import dotenv from "dotenv";

const envFile = process.env.NODE_ENV === "production" ? ".env" : ".env.dev";

dotenv.config({ path: envFile });

export const {
  DATABASE_URL = "",
  GOOGLE_CLIENT_ID = "",
  GOOGLE_CLIENT_SECRET = "",
  BETTER_AUTH_SECRET = "",
  PORT = "5000",
  BACKEND_URL = "http://localhost:5000",
} = process.env;
