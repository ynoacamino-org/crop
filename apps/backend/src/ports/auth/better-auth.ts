import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { authSchema } from "@/db/schema";
import type { AuthInstance } from "@/ports/auth/port";
import type { RuntimeEnv } from "@/ports/runtime/port";

export function createBetterAuth(rt: RuntimeEnv): AuthInstance {
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

  return auth as AuthInstance;
}
