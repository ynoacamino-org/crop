import { createId } from "@paralleldrive/cuid2";
import type { ObjectStore, ObjectStorePutOptions } from "@/ports/object/port";

export type IdFactory = () => string;

const defaultIdFactory: IdFactory = () => createId();

export abstract class BaseObjectStore implements ObjectStore {
  protected readonly ids: IdFactory;

  constructor(ids: IdFactory = defaultIdFactory) {
    this.ids = ids;
  }

  abstract put(
    key: string,
    body: Uint8Array | ReadableStream,
    options: ObjectStorePutOptions,
  ): Promise<string>;

  abstract delete(key: string): Promise<void>;

  abstract getSignedUrl(key: string, expiresIn?: number): Promise<string>;

  abstract getPublicUrl(key: string): string;

  generateKey(prefix: string): string {
    return `${prefix}/${this.ids()}`;
  }
}
