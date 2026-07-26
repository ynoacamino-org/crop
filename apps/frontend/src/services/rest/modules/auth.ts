import { Http } from "@/services/rest/http";
import type { AuthGetSession } from "@/services/rest/models/auth";
import type { HttpOptions } from "@/services/rest/types/http";

class AuthModule {
  private http: Http;

  constructor(baseUrl: string, options?: HttpOptions) {
    this.http = new Http(baseUrl, "auth", options);
  }

  getSession() {
    return this.http.get<AuthGetSession>(["get-session"]);
  }
}

export { AuthModule };
