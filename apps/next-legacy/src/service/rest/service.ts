import { AuthModule } from "./modules/auth";
import { MediaModule } from "./modules/media";
import type { HttpOptions } from "./types/http";

class RestService {
  auth: AuthModule;
  media: MediaModule;

  constructor(prefix: string, options?: HttpOptions) {
    this.auth = new AuthModule(prefix, options);
    this.media = new MediaModule(prefix, options);
  }
}

export { RestService };
