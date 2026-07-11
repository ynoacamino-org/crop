import { http } from "#/lib/http-client";
import type { AuthGetSession } from "./models/auth";

export async function getSession() {
  return http.get("auth/get-session").json<AuthGetSession>();
}
