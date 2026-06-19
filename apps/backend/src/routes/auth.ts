import { Hono } from "hono";
import { RuntimeFactory } from "@/lib/env";

export function AuthRouterFactory(): Hono<{ Bindings: Cloudflare.Env }> {
  const router = new Hono<{ Bindings: Cloudflare.Env }>({ strict: false });

  router.on(["POST", "GET"], "/**", (c) => {
    const rt = RuntimeFactory.create({ cf: c.env });
    return rt.auth.handler(c.req.raw);
  });

  return router;
}

export const authRouter = AuthRouterFactory();
export default authRouter;
