import { Http } from "../http";
import type { AuthGetSession } from "../models/auth";
import type { HttpOptions } from "../types/http";

class AuthModule {
  private http: Http;

  constructor(prefix: string, options?: HttpOptions) {
    this.http = new Http([prefix, "auth"], options);
  }

  getSession() {
    return this.http.get<AuthGetSession>(["get-session"]);
  }
}

export { AuthModule };
