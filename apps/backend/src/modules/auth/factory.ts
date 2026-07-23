import type { RuntimeEnv } from "@/bootstrap/types";
import { BetterAuthAdapter } from "@/modules/auth/adapters/better-auth";
import type { AuthPort } from "@/modules/auth/ports/auth";

export function createAuth(rt: RuntimeEnv): AuthPort {
  return new BetterAuthAdapter(rt);
}
