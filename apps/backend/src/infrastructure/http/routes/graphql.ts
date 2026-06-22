import { Hono } from "hono";
import { createYogaHandler } from "@/infrastructure/graphql/yoga";
import { runtime } from "@/infrastructure/runtime";

export function graphqlRouter(): Hono<{ Bindings: Cloudflare.Env }> {
  const router = new Hono<{ Bindings: Cloudflare.Env }>();

  router.all("/", (c) => {
    const rt = runtime.create({ cf: c.env });
    const yoga = createYogaHandler(rt);
    return yoga.fetch(c.req.raw);
  });

  return router;
}

export const graphqlRoutes = graphqlRouter();
export default graphqlRoutes;
