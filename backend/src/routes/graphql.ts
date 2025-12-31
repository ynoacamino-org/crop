import { Hono } from "hono";
import { yoga } from "../yoga";

export const graphqlRoutes = new Hono();

graphqlRoutes.all("/", (c) => {
  return yoga.fetch(c.req.raw);
});

export type AppType = typeof graphqlRoutes;
export default graphqlRoutes;
