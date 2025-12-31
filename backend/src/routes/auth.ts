import { Hono } from "hono";
import { auth } from "../auth";

export const authRoutes = new Hono();

authRoutes.all("/**", (c) => {
  return auth.handler(c.req.raw);
});

export type AppType = typeof authRoutes;
export default authRoutes;
