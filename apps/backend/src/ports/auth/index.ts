import { createBetterAuth } from "@/ports/auth/better-auth";
import type { AuthInstance } from "@/ports/auth/port";
import type { RuntimeEnv } from "@/ports/runtime/port";

export function createAuth(rt: RuntimeEnv): AuthInstance {
  return createBetterAuth(rt);
}

export type { AuthInstance } from "@/ports/auth/port";
