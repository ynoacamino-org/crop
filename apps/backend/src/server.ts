import { Hono } from "hono";
import { corsConfig } from "@/config/cors";
import { authRouter } from "@/routes/auth";
import { devRouter } from "@/routes/dev";
import { graphqlRouter } from "@/routes/graphql";
import { mediaRouter } from "@/routes/media";

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
