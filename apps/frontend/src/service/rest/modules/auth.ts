import { Http } from "@/service/rest/http";
import type { AuthGetSession } from "@/service/rest/models/auth";
import type { HttpOptions } from "@/service/rest/types/http";

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
