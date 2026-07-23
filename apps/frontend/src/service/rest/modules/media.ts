import { Http } from "#/service/rest/http";
import type {
  MediaUploadResponse,
  UploadMediaPayload,
} from "#/service/rest/models/media";
import type { HttpOptions } from "#/service/rest/types/http";

class MediaModule {
  private http: Http;

  constructor(baseUrl: string, options?: HttpOptions) {
    this.http = new Http(baseUrl, "media", options);
  }

  async upload(file: File, payload: UploadMediaPayload) {
    return this.http.upload<MediaUploadResponse>(["upload"], file, payload);
  }
}

export { MediaModule };
