import { Hono } from "hono";
import { auth } from "./auth";
import { yoga } from "./yoga";

const app = new Hono();

app.on(["POST", "GET"], "/api/auth/**", (c) => {
  return auth.handler(c.req.raw);
});

app.all("/graphql", (c) => {
  return yoga.fetch(c.req.raw);
});

export default {
  port: 8000,
  fetch: app.fetch,
};
