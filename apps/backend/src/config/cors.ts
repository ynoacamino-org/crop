import { cors } from "hono/cors";
import { BACKEND_URL } from "./env";

export const corsConfig = cors({
  origin: ["http://localhost:8000", BACKEND_URL],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization", "Cookie"],
  exposeHeaders: ["Content-Length", "Set-Cookie"],
  maxAge: 600,
  credentials: true,
});
