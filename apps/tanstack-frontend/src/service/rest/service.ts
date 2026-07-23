import { AuthModule } from "./modules/auth";
import { MediaModule } from "./modules/media";
import type { HttpOptions } from "./types/http";

class RestService {
  auth: AuthModule;
  media: MediaModule;

  constructor(baseUrl: string, options?: HttpOptions) {
    this.auth = new AuthModule(baseUrl, options);
    this.media = new MediaModule(baseUrl, options);
  }
}

export { RestService };
