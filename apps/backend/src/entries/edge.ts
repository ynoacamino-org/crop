import { Hono } from "hono";
import { corsConfig } from "@/core/cors";
import { authRouter } from "@/modules/auth/http/routes";
import { mediaRouter } from "@/modules/media/http/routes";
import { devRouter } from "@/shared/http/routes/dev";
import { graphqlRouter } from "@/shared/http/routes/graphql";

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
