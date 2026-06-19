import { BaseObjectStore, type IdFactory } from "@/ports/object/base";
import type { ObjectStorePutOptions } from "@/ports/object/port";

export class R2ObjectStore extends BaseObjectStore {
  constructor(
    private readonly bucket: R2Bucket,
    private readonly publicUrl: string = "",
    ids?: IdFactory,
  ) {
    super(ids);
  }

  async put(
    key: string,
    body: Uint8Array | ReadableStream,
    options: ObjectStorePutOptions,
  ): Promise<string> {
    const httpMetadata: R2HTTPMetadata = {
      contentType: options.contentType,
    };

    const customMetadata: Record<string, string> = {};
    if (options.metadata) {
      for (const [k, v] of Object.entries(options.metadata)) {
        customMetadata[k] = v;
      }
    }

    await this.bucket.put(key, body, {
      httpMetadata,
      customMetadata,
    });

    return this.getPublicUrl(key);
  }

  async delete(key: string): Promise<void> {
    await this.bucket.delete(key);
  }

  async getSignedUrl(key: string, _expiresIn = 3600): Promise<string> {
    return this.getPublicUrl(key);
  }

  getPublicUrl(key: string): string {
    if (this.publicUrl) {
      return `${this.publicUrl.replace(/\/$/, "")}/${key}`;
    }
    return key;
  }
}
