import type { AuthPort } from "@/application/ports/auth";
import type { RuntimeEnv } from "@/application/ports/runtime";
import { BetterAuthAdapter } from "@/infrastructure/adapters/auth/better-auth";

export function createAuth(rt: RuntimeEnv): AuthPort {
  return new BetterAuthAdapter(rt);
}
