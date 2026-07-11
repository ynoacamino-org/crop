import { http } from "#/lib/http-client";
import type { MediaUploadResponse, UploadMediaPayload } from "./models/media";

export async function upload(file: File, payload: UploadMediaPayload) {
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
}
