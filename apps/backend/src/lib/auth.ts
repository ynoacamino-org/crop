import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import {
  BACKEND_URL,
  BETTER_AUTH_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} from "@/config/env";
import { authSchema } from "@/db/schema";
import { db } from "@/lib/db";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: authSchema,
  }),
  secret: BETTER_AUTH_SECRET,
  baseURL: BACKEND_URL,
  basePath: "/api/auth",
  trustedOrigins: ["http://localhost:8000", BACKEND_URL],
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
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 15 * 60,
    },
  },
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
  },
});

export type AuthType = {
  user: typeof auth.$Infer.Session.user | null;
  session: typeof auth.$Infer.Session | null;
};
