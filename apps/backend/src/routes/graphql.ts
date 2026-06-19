import { Hono } from "hono";
import { createYogaHandler } from "@/lib/yoga";

export const graphqlRouter = new Hono<{ Bindings: Cloudflare.Env }>();

graphqlRouter.all("/", (c) => {
  const yoga = createYogaHandler(c.env);
  return yoga.fetch(c.req.raw);
});

export default graphqlRouter;
