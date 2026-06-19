import { Hono } from "hono";
import { createAuth } from "@/lib/auth";

export const authRouter = new Hono<{ Bindings: Cloudflare.Env }>({
  strict: false,
});

authRouter.on(["POST", "GET"], "/**", (c) => {
  const auth = createAuth(c.env);
  return auth.handler(c.req.raw);
});

export default authRouter;
