import { cors } from "hono/cors";

export function createCorsConfig(backendUrl: string) {
  return cors({
    origin: ["http://localhost:8000", backendUrl],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "Cookie", "x-api-key"],
    exposeHeaders: ["Content-Length", "Set-Cookie"],
    maxAge: 600,
    credentials: true,
  });
}
