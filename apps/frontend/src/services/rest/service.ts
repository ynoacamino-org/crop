import { AuthModule } from "@/services/rest/modules/auth";
import { MediaModule } from "@/services/rest/modules/media";
import type { HttpOptions } from "@/services/rest/types/http";

class RestService {
  auth: AuthModule;
  media: MediaModule;

  constructor(baseUrl: string, options?: HttpOptions) {
    this.auth = new AuthModule(baseUrl, options);
    this.media = new MediaModule(baseUrl, options);
  }
}

export { RestService };
