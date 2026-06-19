import { promises as fs } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { BaseObjectStore, type IdFactory } from "@/lib/stores/object/base";
import type { ObjectStorePutOptions } from "@/lib/stores/object/types";

export interface LocalFsConfig {
  baseDir?: string;
  publicUrlPrefix?: string;
}

export class LocalFsObjectStore extends BaseObjectStore {
  private baseDir: string;
  private publicUrlPrefix: string;

  constructor(config: LocalFsConfig = {}, ids?: IdFactory) {
    super(ids);
    this.baseDir = resolve(config.baseDir ?? "./.data/media");
    this.publicUrlPrefix = config.publicUrlPrefix ?? "/api/media/file";
  }

  private resolve(key: string): string {
    return join(this.baseDir, key);
  }

  async put(
    key: string,
    body: Uint8Array | ReadableStream,
    _options: ObjectStorePutOptions,
  ): Promise<string> {
    const target = this.resolve(key);
    await fs.mkdir(dirname(target), { recursive: true });
    const bytes =
      body instanceof Uint8Array
        ? body
        : new Uint8Array(await new Response(body).arrayBuffer());
    await fs.writeFile(target, bytes);
    return this.getPublicUrl(key);
  }

  async delete(key: string): Promise<void> {
    const target = this.resolve(key);
    try {
      await fs.unlink(target);
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code !== "ENOENT") {
        throw err;
      }
    }
  }

  async getSignedUrl(key: string): Promise<string> {
    return this.getPublicUrl(key);
  }

  getPublicUrl(key: string): string {
    return `${this.publicUrlPrefix}/${key}`;
  }

  getBaseDir(): string {
    return this.baseDir;
  }
}
