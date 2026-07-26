import { createAuthClient } from "better-auth/react";
import { env } from "@/env/client";

const baseURL = env.VITE_API_URL.replace(/\/api$/, "");

export const authClient = createAuthClient({
  baseURL,
  basePath: "/api/auth",
});

export const { signIn, signOut, useSession } = authClient;

export default authClient;
