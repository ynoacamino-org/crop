import { ObjectStoreFactory } from "@/lib/stores/object";
import type { ObjectStore } from "@/lib/stores/object/types";

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

export class MediaService {
  constructor(private readonly store: ObjectStore) {}

  async upload(params: UploadMediaParams): Promise<UploadMediaResult> {
    const { file, filename, prefix, metadata } = params;

    const objectKey = this.store.generateKey(prefix);

    const arrayBuffer = await file.arrayBuffer();
    const body = new Uint8Array(arrayBuffer);

    const url = await this.store.put(objectKey, body, {
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

  async getSignedUrl(objectKey: string, expiresIn = 3600): Promise<string> {
    return this.store.getSignedUrl(objectKey, expiresIn);
  }

  async delete(objectKey: string): Promise<void> {
    return this.store.delete(objectKey);
  }

  getPublicUrl(objectKey: string): string {
    return this.store.getPublicUrl(objectKey);
  }
}

let _service: MediaService | null = null;

function getService(): MediaService {
  if (!_service) {
    const store = ObjectStoreFactory({
      env: {} as never,
      preferR2Binding: true,
    });
    _service = new MediaService(store);
  }
  return _service;
}

export async function uploadMedia(
  params: UploadMediaParams,
): Promise<UploadMediaResult> {
  return getService().upload(params);
}

export async function getMediaSignedUrl(
  objectKey: string,
  expiresIn = 3600,
): Promise<string> {
  return getService().getSignedUrl(objectKey, expiresIn);
}

export async function deleteMedia(objectKey: string): Promise<void> {
  return getService().delete(objectKey);
}

export function getMediaPublicUrl(objectKey: string): string {
  return getService().getPublicUrl(objectKey);
}

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
