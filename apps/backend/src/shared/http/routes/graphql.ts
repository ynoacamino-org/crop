import { Hono } from "hono";
import { runtime } from "@/bootstrap/runtime";
import { createYogaHandler } from "@/shared/graphql/yoga";

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
