import { Hono } from "hono";
import { cors } from "hono/cors";
import { auth } from "./auth";
import { BACKEND_URL, PORT } from "./config/env";
import { yoga } from "./yoga";

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

app.all("/auth/**", (c) => {
  return auth.handler(c.req.raw);
});

app.all("/graphql", (c) => {
  return yoga.fetch(c.req.raw);
});

export default {
  port: Number(PORT),
  fetch: app.fetch,
};
