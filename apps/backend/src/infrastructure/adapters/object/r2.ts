import { createId } from "@paralleldrive/cuid2";
import type {
  ObjectPort,
  ObjectPortPutOptions,
} from "@/application/ports/object";
import { isCloudflareBindings } from "@/infrastructure/adapters/detect";

export class R2ObjectPort implements ObjectPort {
  private readonly ids: () => string;

  static isConfigured(cf?: Cloudflare.Env): cf is Cloudflare.Env {
    return !!(cf && isCloudflareBindings(cf) && "MY_BUCKET" in cf);
  }

  constructor(
    private readonly bucket: R2Bucket,
    ids: () => string = () => createId(),
  ) {
    this.ids = ids;
  }

  async put(
    key: string,
    body: Uint8Array | ReadableStream,
    options: ObjectPortPutOptions,
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
    return key;
  }

  generateKey(prefix: string): string {
    return `${prefix}/${this.ids()}`;
  }
}
