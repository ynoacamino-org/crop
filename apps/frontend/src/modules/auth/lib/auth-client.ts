import { createAuthClient } from "better-auth/react";
import { BASE_URL } from "@/shared/config/env";

export const authClient = createAuthClient({
  baseURL: BASE_URL,
});

export const { signIn, signOut, useSession } = authClient;
