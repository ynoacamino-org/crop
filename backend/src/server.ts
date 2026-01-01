import { Hono } from "hono";
import { cors } from "hono/cors";
import { BACKEND_URL, PORT } from "./config/env";
import authRoutes from "./routes/auth";

import graphqlRoutes from "./routes/graphql";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: [BACKEND_URL],
    allowMethods: ["*"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
    maxAge: 600,
    credentials: true,
  }),
);

app.route("/api/auth", authRoutes);
app.route("/api/graphql", graphqlRoutes);

export default {
  port: Number(PORT),
  fetch: app.fetch,
};
