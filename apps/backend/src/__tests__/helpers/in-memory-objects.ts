import { createId } from "@paralleldrive/cuid2";
import type {
  ObjectPort,
  ObjectPortPutOptions,
} from "@/modules/object-storage/ports/storage";

interface StoredObject {
  body: Uint8Array;
  contentType: string;
  metadata?: Record<string, string>;
}

export class InMemoryObjectStorage implements ObjectPort {
  #store = new Map<string, StoredObject>();

  async put(
    key: string,
    body: Uint8Array | ReadableStream,
    options: ObjectPortPutOptions,
  ): Promise<string> {
    const bytes =
      body instanceof Uint8Array
        ? body
        : new Uint8Array(await new Response(body).arrayBuffer());
    this.#store.set(key, {
      body: bytes,
      contentType: options.contentType,
      metadata: options.metadata,
    });
    return key;
  }

  async delete(key: string): Promise<void> {
    this.#store.delete(key);
  }

  async getSignedUrl(key: string, _expiresIn?: number): Promise<string> {
    if (!this.#store.has(key)) {
      throw new Error(`Object not found: ${key}`);
    }
    return `https://test-bucket.s3.test/${key}`;
  }

  getPublicUrl(key: string): string {
    return `https://test-bucket.s3.test/${key}`;
  }

  generateKey(prefix: string): string {
    return `${prefix}/${createId()}`;
  }
}
