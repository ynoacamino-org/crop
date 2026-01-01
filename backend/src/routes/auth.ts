import { Hono } from "hono";
import { type AuthType, auth } from "../auth";

export const authRouter = new Hono<{ Bindings: AuthType }>({
  strict: false,
});

authRouter.on(["POST", "GET"], "/**", (c) => {
  return auth.handler(c.req.raw);
});

export default authRouter;
