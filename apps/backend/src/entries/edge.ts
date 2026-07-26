import { Hono } from "hono";
import { createCorsConfig } from "@/core/cors";
import { authRouter } from "@/modules/auth/http/routes";
import { mediaRouter } from "@/modules/media/http/routes";
import { devRouter } from "@/shared/http/routes/dev";
import { graphqlRouter } from "@/shared/http/routes/graphql";

const BACKEND_URL = process.env?.BACKEND_URL ?? "http://localhost:7000";
const NODE_ENV = process.env?.NODE_ENV ?? "development";

export const app = new Hono<{ Bindings: Cloudflare.Env }>();

app.use("*", createCorsConfig(BACKEND_URL));

app.route("/api/auth", authRouter());
app.route("/api/graphql", graphqlRouter());
app.route("/api/media", mediaRouter());

if (NODE_ENV !== "production") {
  app.route("/api/dev", devRouter());
}

export default app;
