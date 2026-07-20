import type { KyInstance } from "ky";
import type { MediaUploadResponse, UploadMediaPayload } from "./models/media";

export function createMediaRest(http: KyInstance) {
  return {
    upload: async (file: File, payload: UploadMediaPayload) => {
      const form = new FormData();
      form.append("file", file, file.name);

      if (payload) {
        for (const [key, value] of Object.entries(payload)) {
          if (value !== undefined && value !== null) {
            form.append(key, String(value));
          }
        }
      }

      return http
        .post("media/upload", {
          body: form,
        })
        .json<MediaUploadResponse>();
    },
  };
}
