export function validateMediaType(
  mimeType: string,
  mediaType: "IMAGE" | "VIDEO" | "AUDIO" | "FILE",
): boolean {
  const typeMap = {
    IMAGE: /^image\/(jpeg|jpg|png|gif|webp|svg\+xml|avif|heic)$/,
    VIDEO: /^video\/(mp4|webm|ogg|quicktime|x-msvideo|avi|mkv)$/,
    AUDIO: /^audio\/(mpeg|mp3|wav|ogg|webm|aac|flac)$/,
    FILE: /^application\/|^text\/|^.+$/,
  };

  return typeMap[mediaType].test(mimeType);
}

export function getMediaTypeFromMime(
  mimeType: string,
): "IMAGE" | "VIDEO" | "AUDIO" | "FILE" {
  if (/^image\//.test(mimeType)) return "IMAGE";
  if (/^video\//.test(mimeType)) return "VIDEO";
  if (/^audio\//.test(mimeType)) return "AUDIO";
  return "FILE";
}
