import { apiKey } from "@better-auth/api-key";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import type { RuntimeEnv } from "@/bootstrap/types";
import { authSchema } from "@/domain/db/schema";
import type { AuthPort } from "@/modules/auth/ports/auth";

export function createBetterAuth(rt: RuntimeEnv) {
  const { auth, backendUrl, nodeEnv } = rt.config;

  const trustedOrigins = ["http://localhost:8000", backendUrl];

  return betterAuth({
    database: drizzleAdapter(rt.db.client as never, {
      provider: "sqlite",
      schema: authSchema,
    }),
    secret: auth.secret,
    baseURL: backendUrl,
    basePath: "/api/auth",
    trustedOrigins,
    user: {
      modelName: "User",
      additionalFields: {
        role: {
          type: "string",
          enumValues: ["ADMIN", "COLLABORATOR", "PUBLIC"],
          defaultValue: "PUBLIC",
          input: false,
        },
      },
    },
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
      minPasswordLength: 8,
      maxPasswordLength: 128,
    },
    session: {
      cookieCache: {
        enabled: true,
        maxAge: 15 * 60,
      },
    },
    plugins: [
      apiKey({
        defaultPrefix: "crop_",
        defaultKeyLength: 48,
        enableMetadata: true,
      }),
    ],
    advanced: {
      useSecureCookies: nodeEnv === "production",
    },
  });
}

export type BetterAuthInstance = ReturnType<typeof createBetterAuth>;
export type BetterAuthApi = BetterAuthInstance["api"];

export class BetterAuthAdapter implements AuthPort {
  public readonly api: BetterAuthApi;
  public readonly handler: AuthPort["handler"];

  constructor(rt: RuntimeEnv) {
    const authInstance = createBetterAuth(rt);
    this.api = authInstance.api;
    this.handler = authInstance.handler;
  }
}
