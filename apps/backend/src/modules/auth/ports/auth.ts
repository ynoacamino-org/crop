import type { BetterAuthApi } from "@/modules/auth/adapters/better-auth";

export interface AuthPort {
  api: BetterAuthApi;
  handler: (request: Request) => Promise<Response>;
}
