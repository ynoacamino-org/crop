import { Hono } from "hono";
import { corsConfig } from "./config/cors";
import { PORT } from "./config/env";
import authRoutes from "./routes/auth";
import graphqlRoutes from "./routes/graphql";
import { mediaRouter } from "./routes/media";

const app = new Hono();

app.use("*", corsConfig);

app.route("/api/auth", authRoutes);
app.route("/api/graphql", graphqlRoutes);
app.route("/api/media", mediaRouter);

export default {
  port: Number(PORT),
  fetch: app.fetch,
};
