import { Hono } from "hono";
import { RuntimeFactory } from "@/lib/env";
import { YogaHandlerFactory } from "@/lib/yoga";

export function GraphqlRouterFactory(): Hono<{ Bindings: Cloudflare.Env }> {
  const router = new Hono<{ Bindings: Cloudflare.Env }>();

  router.all("/", (c) => {
    const rt = RuntimeFactory.create({ cf: c.env });
    const yoga = YogaHandlerFactory(rt);
    return yoga.fetch(c.req.raw);
  });

  return router;
}

export const graphqlRouter = GraphqlRouterFactory();
export default graphqlRouter;
