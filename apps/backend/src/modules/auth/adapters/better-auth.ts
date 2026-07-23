import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import type { RuntimeEnv } from "@/bootstrap/types";
import { authSchema } from "@/domain/db/schema";
import type { AuthPort } from "@/modules/auth/ports/auth";

export class BetterAuthAdapter implements AuthPort {
  public readonly api: AuthPort["api"];
  public readonly handler: AuthPort["handler"];

  constructor(rt: RuntimeEnv) {
    const secret = rt.env.get("BETTER_AUTH_SECRET") ?? "";
    const baseURL = rt.env.get("BACKEND_URL") ?? "http://localhost:7000";
    const nodeEnv = rt.env.get("NODE_ENV") ?? "development";
    const googleClientId = rt.env.get("GOOGLE_CLIENT_ID") ?? "";
    const googleClientSecret = rt.env.get("GOOGLE_CLIENT_SECRET") ?? "";

    const auth = betterAuth({
      database: drizzleAdapter(rt.db.client as never, {
        provider: "sqlite",
        schema: authSchema,
      }),
      secret,
      baseURL,
      basePath: "/api/auth",
      trustedOrigins: ["http://localhost:8000", baseURL],
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
      socialProviders: {
        google: {
          prompt: "select_account",
          clientId: googleClientId,
          clientSecret: googleClientSecret,
        },
      },
      session: {
        cookieCache: {
          enabled: true,
          maxAge: 15 * 60,
        },
      },
      advanced: {
        useSecureCookies: nodeEnv === "production",
      },
    });

    this.api = auth.api;
    this.handler = auth.handler;
  }
}
