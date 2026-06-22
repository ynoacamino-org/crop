import { Hono } from "hono";
import { authRouter } from "@/infrastructure/http/routes/auth";
import { devRouter } from "@/infrastructure/http/routes/dev";
import { graphqlRouter } from "@/infrastructure/http/routes/graphql";
import { mediaRouter } from "@/infrastructure/http/routes/media";
import { corsConfig } from "@/infrastructure/lib/cors";

export const app = new Hono<{ Bindings: Cloudflare.Env }>();

app.use("*", corsConfig);

app.route("/api/auth", authRouter());
app.route("/api/graphql", graphqlRouter());
app.route("/api/media", mediaRouter());

const nodeEnv = process.env?.NODE_ENV ?? "development";
if (nodeEnv !== "production") {
  app.route("/api/dev", devRouter());
}

export default app;
