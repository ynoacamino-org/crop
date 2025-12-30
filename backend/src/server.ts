import { useCookies } from "@whatwg-node/server-plugin-cookies";
import { createYoga } from "graphql-yoga";
import { Hono } from "hono";
import { auth } from "./auth";
import { schema } from "./schema";

const app = new Hono();

// Auth routes
app.on(["POST", "GET"], "/api/auth/**", (c) => {
  return auth.handler(c.req.raw);
});

const yoga = createYoga({
  schema,
  plugins: [useCookies()],
  graphqlEndpoint: "/graphql",
  context: async ({ request }) => {
    const session = await auth.api.getSession({ headers: request.headers });

    return {
      user: session?.user
        ? {
            id: Number(session.user.id),
            role: session.user.role || "PUBLIC",
          }
        : undefined,
    };
  },
});

app.all("/graphql", (c) => {
  return yoga.fetch(c.req.raw);
});

app.get("/", (c) => {
  return c.text("Hello bun!");
});

export default {
  port: 8000,
  fetch: app.fetch,
};
