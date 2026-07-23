import { Hono } from "hono";
import { runtime } from "@/bootstrap/runtime";

export function authRouter(): Hono<{ Bindings: Cloudflare.Env }> {
  const router = new Hono<{ Bindings: Cloudflare.Env }>({ strict: false });

  router.on(["POST", "GET"], "/**", (c) => {
    const rt = runtime.create({ cf: c.env });
    return rt.auth.handler(c.req.raw);
  });

  return router;
}

export const authRoutes = authRouter();
export default authRoutes;
