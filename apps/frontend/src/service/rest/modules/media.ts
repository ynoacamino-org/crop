import { Http } from "../http";
import type { MediaUploadResponse, UploadMediaPayload } from "../models/media";
import type { HttpOptions } from "../types/http";

class MediaModule {
  private http: Http;
  private readonly prefix = "media";

  constructor(prefix: string, options?: HttpOptions) {
    this.http = new Http([prefix, this.prefix], options);
  }

  async upload(file: File, payload: UploadMediaPayload) {
    return this.http.upload<MediaUploadResponse>(["upload"], file, payload);
  }
}

export { MediaModule };
