import { Elysia } from "elysia";
import type { RuntimeEnv } from "@/application/ports/runtime";

export function authRoutes(rt: RuntimeEnv) {
  return new Elysia().all("/**", async ({ request }) => {
    return rt.auth.handler(request);
  });
}
