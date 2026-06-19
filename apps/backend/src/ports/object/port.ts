export interface ObjectStorePutOptions {
  contentType: string;
  metadata?: Record<string, string>;
}

export interface ObjectStore {
  put(
    key: string,
    body: Uint8Array | ReadableStream,
    options: ObjectStorePutOptions,
  ): Promise<string>;
  delete(key: string): Promise<void>;
  getSignedUrl(key: string, expiresIn?: number): Promise<string>;
  getPublicUrl(key: string): string;
  generateKey(prefix: string): string;
}
