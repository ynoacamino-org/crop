import { Hono } from "hono";
import { yoga } from "@/lib/yoga";

export const graphqlRouter = new Hono();

graphqlRouter.all("/", (c) => {
  return yoga.fetch(c.req.raw);
});

export default graphqlRouter;
