import { createAuthClient } from "better-auth/react";
import { API_URL } from "@/shared/config/env";

const baseURL = API_URL.replace(/\/api$/, "");

export const authClient = createAuthClient({
  baseURL,
  basePath: "/api/auth",
});

export const { signIn, signOut, useSession } = authClient;
