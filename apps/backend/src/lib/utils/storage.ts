import { storage } from "@/lib/storage";

export interface UploadMediaParams {
  file: File | Blob;
  filename: string;
  prefix: string;
  metadata?: Record<string, string>;
}

export interface UploadMediaResult {
  objectKey: string;
  url: string;
  size: number;
  mimeType: string;
  filename: string;
}

export async function uploadMedia(
  params: UploadMediaParams,
): Promise<UploadMediaResult> {
  const { file, filename, prefix, metadata } = params;

  const objectKey = storage.generateKey(prefix);

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const url = await storage.upload({
    key: objectKey,
    body: buffer,
    contentType: file.type,
    metadata,
  });

  return {
    objectKey,
    url,
    size: file.size,
    mimeType: file.type,
    filename,
  };
}

export async function getMediaSignedUrl(
  objectKey: string,
  expiresIn = 3600,
): Promise<string> {
  return storage.getSignedUrl(objectKey, expiresIn);
}

export function validateMediaType(
  mimeType: string,
  mediaType: "IMAGE" | "VIDEO" | "AUDIO",
): boolean {
  const typeMap = {
    IMAGE: /^image\/(jpeg|jpg|png|gif|webp|svg\+xml)$/,
    VIDEO: /^video\/(mp4|webm|ogg|quicktime|x-msvideo)$/,
    AUDIO: /^audio\/(mpeg|mp3|wav|ogg|webm|aac)$/,
  };

  return typeMap[mediaType].test(mimeType);
}

export function getMediaTypeFromMime(
  mimeType: string,
): "IMAGE" | "VIDEO" | "AUDIO" | null {
  if (/^image\//.test(mimeType)) return "IMAGE";
  if (/^video\//.test(mimeType)) return "VIDEO";
  if (/^audio\//.test(mimeType)) return "AUDIO";
  return null;
}
