import { Hono } from "hono";
import { corsConfig } from "./config/cors";
import { NODE_ENV } from "./config/env";
import authRoutes from "./routes/auth";
import { devRouter } from "./routes/dev";
import graphqlRoutes from "./routes/graphql";
import { mediaRouter } from "./routes/media";

const app = new Hono<{ Bindings: Cloudflare.Env }>();

app.use("*", corsConfig);

app.route("/api/auth", authRoutes);
app.route("/api/graphql", graphqlRoutes);
app.route("/api/media", mediaRouter);

if (NODE_ENV !== "production") {
  app.route("/api/dev", devRouter);
}

export default app;
