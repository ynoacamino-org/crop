export interface ObjectPortPutOptions {
  contentType: string;
  metadata?: Record<string, string>;
}

export interface ObjectPort {
  put(
    key: string,
    body: Uint8Array | ReadableStream,
    options: ObjectPortPutOptions,
  ): Promise<string>;
  delete(key: string): Promise<void>;
  getSignedUrl(key: string, expiresIn?: number): Promise<string>;
  getPublicUrl(key: string): string;
  generateKey(prefix: string): string;
}
