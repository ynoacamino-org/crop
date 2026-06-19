import type { ObjectStore } from "@/ports/object/port";
import type { RuntimeEnv } from "@/ports/runtime/port";

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

export function getMediaService(rt: RuntimeEnv): MediaService {
  return new MediaService(rt.objects);
}

export function uploadMedia(
  rt: RuntimeEnv,
  params: UploadMediaParams,
): Promise<UploadMediaResult> {
  return getMediaService(rt).upload(params);
}

export function getMediaSignedUrl(
  rt: RuntimeEnv,
  objectKey: string,
  expiresIn = 3600,
): Promise<string> {
  return getMediaService(rt).getSignedUrl(objectKey, expiresIn);
}

export function deleteMedia(rt: RuntimeEnv, objectKey: string): Promise<void> {
  return getMediaService(rt).delete(objectKey);
}

export function getMediaPublicUrl(rt: RuntimeEnv, objectKey: string): string {
  return getMediaService(rt).getPublicUrl(objectKey);
}
