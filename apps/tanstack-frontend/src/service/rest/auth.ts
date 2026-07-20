import type { KyInstance } from "ky";
import type { AuthGetSession } from "./models/auth";

export function createAuthRest(http: KyInstance) {
  return {
    getSession: () => http.get("auth/get-session").json<AuthGetSession>(),
  };
}
