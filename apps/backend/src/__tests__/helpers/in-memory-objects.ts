import { mkdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createId } from "@paralleldrive/cuid2";
import S3rver from "s3rver";
import { S3ObjectPort } from "@/modules/object-storage/adapters/s3";
import type {
  ObjectPort,
  ObjectPortPutOptions,
} from "@/modules/object-storage/ports/storage";

export class InMemoryObjectStorage implements ObjectPort {
  private server?: S3rver;
  private adapter?: S3ObjectPort;
  private readonly dir: string;
  private readonly port: number;
  private readonly bucket: string;

  constructor(opts?: { port?: number; bucket?: string }) {
    this.port = opts?.port ?? 4569;
    this.bucket = opts?.bucket ?? "test-bucket";
    this.dir = join(tmpdir(), `s3rver-${createId()}`);
  }

  public async start(): Promise<void> {
    if (this.server) return;

    mkdirSync(this.dir, { recursive: true });

    this.server = new S3rver({
      port: this.port,
      address: "127.0.0.1",
      directory: this.dir,
      silent: true,
      configureBuckets: [
        {
          name: this.bucket,
          configs: [],
        },
      ],
    });

    await this.server.run();

    const endpoint = `http://127.0.0.1:${this.port}`;
    this.adapter = new S3ObjectPort({
      nodeEnv: "test",
      backendUrl: "http://localhost:7000",
      port: 7000,
      auth: { secret: "test-secret" },
      database: { url: ":memory:" },
      s3: {
        accessKeyId: "S3RVER",
        secretAccessKey: "S3RVER",
        region: "us-east-1",
        bucket: this.bucket,
        endpoint,
        publicUrl: `${endpoint}/${this.bucket}`,
        forcePathStyle: true,
      },
      redis: { url: undefined, token: undefined },
      dev: { seedToken: undefined },
    });
  }

  public async stop(): Promise<void> {
    if (this.server) {
      await this.server.close();
      this.server = undefined;
    }
    try {
      rmSync(this.dir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup error if already removed
    }
  }

  private async getAdapter(): Promise<S3ObjectPort> {
    if (!this.adapter) {
      await this.start();
    }
    return this.adapter!;
  }

  async put(
    key: string,
    body: Uint8Array | ReadableStream,
    options: ObjectPortPutOptions,
  ): Promise<string> {
    const adapter = await this.getAdapter();
    return adapter.put(key, body, options);
  }

  async delete(key: string): Promise<void> {
    const adapter = await this.getAdapter();
    return adapter.delete(key);
  }

  async getSignedUrl(key: string, expiresIn?: number): Promise<string> {
    const adapter = await this.getAdapter();
    return adapter.getSignedUrl(key, expiresIn);
  }

  getPublicUrl(key: string): string {
    if (this.adapter) {
      return this.adapter.getPublicUrl(key);
    }
    return `http://127.0.0.1:${this.port}/${this.bucket}/${key}`;
  }

  generateKey(prefix: string): string {
    return `${prefix}/${createId()}`;
  }
}
