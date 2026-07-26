import { AuthModule } from "@/service/rest/modules/auth";
import { MediaModule } from "@/service/rest/modules/media";
import type { HttpOptions } from "@/service/rest/types/http";

class RestService {
  auth: AuthModule;
  media: MediaModule;

  constructor(baseUrl: string, options?: HttpOptions) {
    this.auth = new AuthModule(baseUrl, options);
    this.media = new MediaModule(baseUrl, options);
  }
}

export { RestService };
